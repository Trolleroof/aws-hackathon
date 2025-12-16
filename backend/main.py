from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime
from openai import OpenAI
import logging

from functions import tech_node, framing_node, target_user, problem_node, solution_node_2, restructure_json

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

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
async def generate_tech_node(Body: dict):
    json = []
    content = Body.get("idea", "No idea provided")
    
    try:
        logger.info(f"Starting node chain with idea: {content[:50]}...")
        
        # Call problem_node first with empty context
        logger.info("Calling problem_node...")
        try:
            problem_node_result = problem_node(content, json)
            json.append(problem_node_result)
            content = f"{content}\n\n{problem_node_result}"
            logger.info(f"✅ problem_node completed: {problem_node_result[:50]}...")
        except Exception as e:
            logger.error(f"❌ problem_node failed: {e}", exc_info=True)
            raise HTTPException(status_code=500, detail=f"problem_node failed: {str(e)}")
        
        # Call target_user with accumulated context and updated content
        logger.info("Calling target_user...")
        try:
            target_user_result = target_user(content, json)
            json.append(target_user_result)
            content = f"{content}\n\n{target_user_result}"
            logger.info(f"✅ target_user completed: {target_user_result[:50]}...")
        except Exception as e:
            logger.error(f"❌ target_user failed: {e}", exc_info=True)
            raise HTTPException(status_code=500, detail=f"target_user failed: {str(e)}")
        
        # Call tech_node with accumulated context and updated content
        logger.info("Calling tech_node...")
        try:
            tech_node_result = tech_node(content, json)
            json.append(tech_node_result)
            content = f"{content}\n\n{tech_node_result}"
            logger.info(f"✅ tech_node completed: {tech_node_result[:50]}...")
        except Exception as e:
            logger.error(f"❌ tech_node failed: {e}", exc_info=True)
            raise HTTPException(status_code=500, detail=f"tech_node failed: {str(e)}")
        
        # Call solution_node_2 with accumulated context and updated content
        logger.info("Calling solution_node_2...")
        try:
            solution_node_result = solution_node_2(content, json)
            json.append(solution_node_result)
            content = f"{content}\n\n{solution_node_result}"
            logger.info(f"✅ solution_node_2 completed: {solution_node_result[:50]}...")
        except Exception as e:
            logger.error(f"❌ solution_node_2 failed: {e}", exc_info=True)
            raise HTTPException(status_code=500, detail=f"solution_node_2 failed: {str(e)}")
        
        # Call framing_node last with all accumulated context
        logger.info("Calling framing_node...")
        try:
            framing_node_result = framing_node(content, json)
            json.append(framing_node_result)
            logger.info(f"✅ framing_node completed: {framing_node_result[:50]}...")
        except Exception as e:
            logger.error(f"❌ framing_node failed: {e}", exc_info=True)
            raise HTTPException(status_code=500, detail=f"framing_node failed: {str(e)}")

        # Call final function that restructures the JSON
        logger.info("Calling restructure_json...")
        try:
            result = restructure_json(json)
            logger.info(f"✅ restructure_json completed. Result type: {type(result)}")
            return {"result": result, "status": "success", "nodes_completed": len(json)}
        except Exception as e:
            logger.error(f"❌ restructure_json failed: {e}", exc_info=True)
            raise HTTPException(status_code=500, detail=f"restructure_json failed: {str(e)}")
            
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"❌ Unexpected error in endpoint: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Unexpected error: {str(e)}")




'''
Insert all functions below here
'''