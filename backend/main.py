from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime
from openai import OpenAI

app = FastAPI(title="Mock API", version="1.0.0")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mock data models
class Item(BaseModel):
    id: int
    name: str
    description: Optional[str] = None
    price: float
    created_at: datetime = datetime.now()

class User(BaseModel):
    id: int
    username: str
    email: str

# Mock data storage
mock_items = [
    Item(id=1, name="Laptop", description="High-performance laptop", price=999.99),
    Item(id=2, name="Mouse", description="Wireless mouse", price=29.99),
    Item(id=3, name="Keyboard", description="Mechanical keyboard", price=79.99),
]

mock_users = [
    User(id=1, username="john_doe", email="john@example.com"),
    User(id=2, username="jane_smith", email="jane@example.com"),
]

# Routes
@app.get("/")
def read_root():
    return {"message": "Welcome to the Mock API", "version": "1.0.0"}

@app.get("/health")
def health_check():
    return {"status": "healthy", "timestamp": datetime.now()}

# Items endpoints
@app.get("/items", response_model=List[Item])
def get_items():
    return mock_items

@app.get("/items/{item_id}", response_model=Item)
def get_item(item_id: int):
    item = next((item for item in mock_items if item.id == item_id), None)
    if not item:
        raise HTTPException(status_code=404, detail="Item not found")
    return item

@app.post("/items", response_model=Item)
def create_item(item: Item):
    mock_items.append(item)
    return item

@app.post("/api/tool")
def generate_tech_node(Body: dict):
    client = OpenAI(
        base_url="https://api.nova.amazon.com/v1",
        api_key="4acc1f5c-e79b-4dc2-a8c6-3c0636263b54",
    )
    response = client.chat.completions.create(
        model="AGENT-5d8a50798ac64bf9aaad1a8ffbe62a74",
        messages=[
            {"role": "user", "content": f"Here's the user's idea: {Body.get('idea', 'No idea provided')}"}
        ],
    )
    return {"tech_node": response.choices[0].message.content}


'''
Insert all functions below here
'''