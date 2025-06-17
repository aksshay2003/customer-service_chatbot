from fastapi import FastAPI
from api.endpoints.chat import chat_router

app = FastAPI(title="CAW Studios AI Support Chatbot")

app.include_router(chat_router, prefix="/api")

@app.get("/")
async def root():
    return {"message": "Welcome to CAW Studios AI Support Chatbot"}
