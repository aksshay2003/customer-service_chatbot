from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from datetime import datetime
from typing import List, Optional
import uuid

chat_router = APIRouter()

# In-memory storage for demo purpose
chats = {}

class Message(BaseModel):
    sender: str  # 'user' or 'bot'
    text: str
    timestamp: datetime
    intent: Optional[str] = None
    confidence: Optional[float] = None

class ChatRequest(BaseModel):
    user_message: str

class ChatResponse(BaseModel):
    messages: List[Message]
    case_id: str

def detect_intent(text: str):
    # Dummy intent detection
    if "refund" in text.lower():
        return ("Refund Request", 0.9)
    if "help" in text.lower():
        return ("General Inquiry", 0.7)
    return ("General Inquiry", 0.6)

@chat_router.post("/chat", response_model=ChatResponse)
async def chat_endpoint(request: ChatRequest):
    case_id = str(uuid.uuid4())[:8]
    now = datetime.utcnow()

    # Detect intent
    intent, confidence = detect_intent(request.user_message)

    # Initialize chat messages
    user_msg = Message(sender="user", text=request.user_message, timestamp=now, intent=intent, confidence=confidence)
    bot_reply_text = "Thank you for reaching out! How can I assist you further?"
    bot_msg = Message(sender="bot", text=bot_reply_text, timestamp=now)

    # Save chat session (demo only)
    chats[case_id] = [user_msg, bot_msg]

    return ChatResponse(messages=[bot_msg, user_msg], case_id=case_id)
