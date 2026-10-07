from collections import defaultdict

from fastapi import APIRouter, WebSocket, WebSocketDisconnect


router = APIRouter()


class ConnectionManager:
    def __init__(self):
        self.rooms: dict[str, list[WebSocket]] = defaultdict(list)

    async def connect(self, room_id: str, websocket: WebSocket):
        await websocket.accept()
        self.rooms[room_id].append(websocket)

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
    await manager.connect(room_id, websocket)

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