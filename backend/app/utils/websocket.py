import socketio
from typing import Dict
import logging

logger = logging.getLogger(__name__)

# Create Socket.IO server
sio = socketio.AsyncServer(
    async_mode='asgi',
    cors_allowed_origins='*',
    logger=True,
    engineio_logger=True
)

# Store active connections
active_users: Dict[str, str] = {}  # sid -> user_email


@sio.event
async def connect(sid, environ):
    logger.info(f"Client connected: {sid}")
    await sio.emit('connection_established', {'sid': sid}, room=sid)


@sio.event
async def disconnect(sid):
    logger.info(f"Client disconnected: {sid}")
    if sid in active_users:
        del active_users[sid]


@sio.event
async def join_asteroid_room(sid, data):
    """Join a chat room for a specific asteroid"""
    asteroid_id = data.get('asteroid_id')
    user_email = data.get('user_email', 'Anonymous')
    
    if not asteroid_id:
        await sio.emit('error', {'message': 'asteroid_id required'}, room=sid)
        return
    
    room = f"asteroid_{asteroid_id}"
    await sio.enter_room(sid, room)
    active_users[sid] = user_email
    
    logger.info(f"User {user_email} ({sid}) joined room {room}")
    
    # Notify room
    await sio.emit('user_joined', {
        'user_email': user_email,
        'asteroid_id': asteroid_id
    }, room=room, skip_sid=sid)


@sio.event
async def leave_asteroid_room(sid, data):
    """Leave an asteroid chat room"""
    asteroid_id = data.get('asteroid_id')
    
    if not asteroid_id:
        return
    
    room = f"asteroidasteroid_{asteroid_id}"
    await sio.leave_room(sid, room)
    user_email = active_users.get(sid, 'Anonymous')
    
    logger.info(f"User {user_email} ({sid}) left room {room}")
    
    # Notify room
    await sio.emit('user_left', {
        'user_email': user_email,
        'asteroid_id': asteroid_id
    }, room=room)


@sio.event
async def send_message(sid, data):
    """Send a chat message to an asteroid room"""
    asteroid_id = data.get('asteroid_id')
    message = data.get('message')
    user_email = active_users.get(sid, 'Anonymous')
    user_id = data.get('user_id')
    
    if not asteroid_id or not message:
        await sio.emit('error', {'message': 'asteroid_id and message required'}, room=sid)
        return
    
    room = f"asteroid_{asteroid_id}"
    
    # Broadcast message to all in room
    message_data = {
        'asteroid_id': asteroid_id,
        'user_email': user_email,
        'user_id': user_id,
        'message': message,
        'timestamp': None  # Will be set by client
    }
    
    await sio.emit('new_message', message_data, room=room)
    logger.info(f"Message from {user_email} in {room}: {message[:50]}")


@sio.event
async def get_online_users(sid, data):
    """Get list of users currently in an asteroid room"""
    asteroid_id = data.get('asteroid_id')
    if not asteroid_id:
        return
    
    room = f"asteroid_{asteroid_id}"
    room_sids = sio.manager.rooms.get('/', {}).get(room, set())
    
    online_users = [active_users.get(s, 'Anonymous') for s in room_sids if s in active_users]
    
    await sio.emit('online_users', {
        'asteroid_id': asteroid_id,
        'users': online_users,
        'count': len(online_users)
    }, room=sid)
