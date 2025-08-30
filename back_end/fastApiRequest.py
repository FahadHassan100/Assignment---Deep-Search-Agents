from fastapi import FastAPI, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from typing import Optional, List, Dict, Any
from main import call_agent
import json


class Message(BaseModel):
    id: int
    role: str
    content: str
    username: Optional[str] = None
    user_email: Optional[str] = None
    deep_search: Optional[bool] = False
    resources: Optional[List[Dict[str, Any]]] = None

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"Hello": "World"}

@app.get("/testing")
def testing_url():
    return {"Server": "Working Prefect!"}


# @app.post("/chat")
# async def chat_with_llm(message: Message):
#     # print(message)
#     # return message
#     agentReply = await call_agent(message)
#     return {"reply": agentReply}


@app.post("/chat")
async def chat_with_llm(message: Message):
    """
    Stream the agent response back to the frontend
    """
    
    async def generate_response():
        async for chunk in call_agent(message):
            yield f"data: {json.dumps({'content': chunk, 'resources': []})}\n\n"
            # yield f"data: {json.dumps({'content': chunk})}\n\n"
        
        
        yield f"data: {json.dumps({'content': '[DONE]'})}\n\n"
    
    return StreamingResponse(
        generate_response(),
        media_type="text/plain",
        headers={
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
            "Content-Type": "text/event-stream",
        }
    )