import logging
from collections import defaultdict
from datetime import datetime, timedelta, timezone
from typing import Any, Dict, List, Optional

from bson import ObjectId
from fastapi import APIRouter, Depends, HTTPException, Query, WebSocket, WebSocketDisconnect
from pydantic import BaseModel

from backend.api.deps import get_current_user
from backend.core.database import get_database
from backend.core.security import decode_access_token
from backend.models.appointment import AppointmentModel
from backend.models.doctor import DoctorModel
from backend.models.patient import PatientModel
from backend.models.user import UserModel
from backend.schemas.user import UserResponse

logger = logging.getLogger(__name__)

router = APIRouter()


class SignalPayload(BaseModel):
    type: str
    offer: Optional[Dict[str, Any]] = None
    answer: Optional[Dict[str, Any]] = None
    candidate: Optional[Dict[str, Any]] = None
    text: Optional[str] = None
    time: Optional[str] = None
    sender: Optional[str] = None


async def verify_room_access(room_id: str, user_id: str) -> dict:
    user = await UserModel.get_by_id(user_id)
    if not user:
        raise HTTPException(status_code=401, detail="User not found")

    appointment = await AppointmentModel.get_by_id(room_id)
    if not appointment:
        raise HTTPException(status_code=404, detail="Consultation room not found")

    if appointment.get("status") == "cancelled":
        raise HTTPException(status_code=400, detail="This appointment has been cancelled")

    user_role = user.get("role", "patient")
    user_str_id = str(user["_id"])

    if user_role == "admin":
        return {"user": user, "appointment": appointment, "role": "admin"}

    if user_role == "patient":
        profile = await PatientModel.get_by_user_id(user_str_id)
        is_allowed = (
            (profile and appointment.get("patient_id") == str(profile["_id"]))
            or appointment.get("patient_id") == user_str_id
        )
        if not is_allowed:
            raise HTTPException(status_code=403, detail="Unauthorized consultation participant")
        return {"user": user, "appointment": appointment, "role": "patient"}

    if user_role == "doctor":
        profile = await DoctorModel.get_by_user_id(user_str_id)
        is_allowed = (
            (profile and appointment.get("doctor_id") == str(profile["_id"]))
            or appointment.get("doctor_id") == user_str_id
        )
        if not is_allowed:
            raise HTTPException(status_code=403, detail="Unauthorized consultation participant")
        return {"user": user, "appointment": appointment, "role": "doctor"}

    return {"user": user, "appointment": appointment, "role": user_role}


# ==========================================
# REST Signaling Endpoints (Vercel & HTTP)
# ==========================================

@router.post("/api/v1/consultation/{room_id}/join")
async def join_room(
    room_id: str,
    current_user: UserResponse = Depends(get_current_user),
):
    await verify_room_access(room_id, current_user.id)
    db = get_database()
    now = datetime.now(timezone.utc)

    await db["consultation_presence"].update_one(
        {"room_id": room_id, "user_id": current_user.id},
        {"$set": {"last_seen": now, "role": current_user.role, "name": current_user.name}},
        upsert=True,
    )

    threshold = now - timedelta(seconds=25)
    other = await db["consultation_presence"].find_one({
        "room_id": room_id,
        "user_id": {"$ne": current_user.id},
        "last_seen": {"$gte": threshold},
    })

    return {
        "status": "joined",
        "peer_ready": other is not None,
        "other_participant": other.get("name") if other else None,
    }


@router.post("/api/v1/consultation/{room_id}/heartbeat")
async def room_heartbeat(
    room_id: str,
    current_user: UserResponse = Depends(get_current_user),
):
    await verify_room_access(room_id, current_user.id)
    db = get_database()
    now = datetime.now(timezone.utc)

    await db["consultation_presence"].update_one(
        {"room_id": room_id, "user_id": current_user.id},
        {"$set": {"last_seen": now, "role": current_user.role}},
        upsert=True,
    )

    threshold = now - timedelta(seconds=25)
    other = await db["consultation_presence"].find_one({
        "room_id": room_id,
        "user_id": {"$ne": current_user.id},
        "last_seen": {"$gte": threshold},
    })

    return {
        "peer_ready": other is not None,
    }


@router.post("/api/v1/consultation/{room_id}/signal")
async def post_signal(
    room_id: str,
    signal: SignalPayload,
    current_user: UserResponse = Depends(get_current_user),
):
    await verify_room_access(room_id, current_user.id)
    db = get_database()
    now = datetime.now(timezone.utc)

    doc = {
        "room_id": room_id,
        "sender_id": current_user.id,
        "sender_role": current_user.role,
        "payload": signal.model_dump(exclude_none=True),
        "created_at": now,
    }
    result = await db["consultation_signals"].insert_one(doc)

    return {"status": "sent", "id": str(result.inserted_id)}


@router.get("/api/v1/consultation/{room_id}/signals")
async def get_signals(
    room_id: str,
    after_id: Optional[str] = Query(None),
    current_user: UserResponse = Depends(get_current_user),
):
    await verify_room_access(room_id, current_user.id)
    db = get_database()

    query: Dict[str, Any] = {
        "room_id": room_id,
        "sender_id": {"$ne": current_user.id},
    }

    if after_id:
        try:
            query["_id"] = {"$gt": ObjectId(after_id)}
        except Exception:
            pass

    cursor = db["consultation_signals"].find(query).sort("_id", 1).limit(50)
    docs = await cursor.to_list(length=50)

    signals = [
        {
            "id": str(doc["_id"]),
            "payload": doc["payload"],
            "sender_role": doc.get("sender_role"),
        }
        for doc in docs
    ]

    last_id = signals[-1]["id"] if signals else after_id

    return {
        "signals": signals,
        "last_id": last_id,
    }


# ==========================================
# WebSocket Signaling Endpoint (Local & Native)
# ==========================================

class ConnectionManager:
    def __init__(self):
        self.rooms: dict[str, list[WebSocket]] = defaultdict(list)

    async def connect(self, room_id: str, websocket: WebSocket) -> bool:
        if len(self.rooms[room_id]) >= 2:
            await websocket.close(code=1013, reason="Consultation room is full")
            return False

        self.rooms[room_id].append(websocket)

        # When 2 participants are connected, inform BOTH that peer is ready
        if len(self.rooms[room_id]) == 2:
            for conn in self.rooms[room_id]:
                try:
                    await conn.send_json({"type": "peer-ready"})
                except Exception:
                    pass

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
        user_id = claims["sub"]
        await verify_room_access(room_id, user_id)
    except Exception as e:
        logger.warning(f"WebSocket auth failed for room {room_id}: {e}")
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
