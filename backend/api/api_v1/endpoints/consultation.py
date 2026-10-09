from collections import defaultdict

from fastapi import APIRouter, WebSocket, WebSocketDisconnect

from backend.core.security import decode_access_token
from backend.models.appointment import AppointmentModel
from backend.models.doctor import DoctorModel
from backend.models.patient import PatientModel
from backend.models.user import UserModel


router = APIRouter()


class ConnectionManager:
    def __init__(self):
        self.rooms: dict[str, list[WebSocket]] = defaultdict(list)

    async def connect(self, room_id: str, websocket: WebSocket) -> bool:
        if len(self.rooms[room_id]) >= 2:
            await websocket.close(code=1013, reason="Consultation room is full")
            return False
        has_waiting_participant = len(self.rooms[room_id]) == 1
        self.rooms[room_id].append(websocket)
        if has_waiting_participant:
            await self.rooms[room_id][0].send_json({"type": "peer-ready"})
        return True

    def disconnect(self, room_id: str, websocket: WebSocket):
        if websocket in self.rooms[room_id]:
            self.rooms[room_id].remove(websocket)

        if not self.rooms[room_id]:
            del self.rooms[room_id]

    async def broadcast(
        self,
        room_id: str,
        message: dict,
        sender: WebSocket,
    ):
        disconnected = []

        for connection in self.rooms.get(room_id, []):
            if connection is sender:
                continue

            try:
                await connection.send_json(message)
            except Exception:
                disconnected.append(connection)

        for connection in disconnected:
            self.disconnect(room_id, connection)


manager = ConnectionManager()


@router.websocket("/ws/{room_id}")
async def consultation_websocket(
    websocket: WebSocket,
    room_id: str,
):
    await websocket.accept()
    token = websocket.query_params.get("token")
    if not token:
        await websocket.send_json({"error": "Authentication required"})
        await websocket.close(code=1008, reason="Authentication required")
        return
    try:
        claims = decode_access_token(token)
        user = await UserModel.get_by_id(claims["sub"])
        appointment = await AppointmentModel.get_by_id(room_id)
        if not user or not appointment or appointment.get("status") != "confirmed":
            raise ValueError("Invalid consultation room")
        if user.get("role") == "patient":
            profile = await PatientModel.get_by_user_id(str(user["_id"]))
            allowed = profile and appointment["patient_id"] == str(profile["_id"])
        elif user.get("role") == "doctor":
            profile = await DoctorModel.get_by_user_id(str(user["_id"]))
            allowed = profile and appointment["doctor_id"] == str(profile["_id"])
        else:
            allowed = False
        if not allowed:
            raise ValueError("Unauthorized consultation participant")
    except Exception as e:
        import traceback
        traceback.print_exc()
        await websocket.send_json({"error": f"Unauthorized consultation room: {e}"})
        await websocket.close(code=1008, reason="Unauthorized consultation room")
        return
    if not await manager.connect(room_id, websocket):
        return

    try:
        while True:
            message = await websocket.receive_json()

            await manager.broadcast(
                room_id,
                message,
                websocket,
            )

    except WebSocketDisconnect:
        manager.disconnect(room_id, websocket)
