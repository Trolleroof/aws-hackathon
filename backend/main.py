from fastapi import FastAPI, HTTPException, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime
from openai import OpenAI
import logging
import os
import tempfile

import assemblyai as aai

from functions import tech_node, framing_node, target_user, problem_node, solution_node_2, restructure_json

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize AssemblyAI
# Get API key from environment variable or use a default (you should set this in your environment)
ASSEMBLYAI_API_KEY = "ad8c01f6fe4248b9bae4f2221415d160"
if ASSEMBLYAI_API_KEY:
    aai.settings.api_key = ASSEMBLYAI_API_KEY
else:
    logger.warning("ASSEMBLYAI_API_KEY not set. Transcription will not work.")

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

@app.post("/api/transcribe")
async def transcribe_audio(audio: UploadFile = File(...)):
    """
    Transcribe audio file using AssemblyAI.
    Accepts audio files in various formats (wav, mp3, m4a, etc.)
    """
    if not ASSEMBLYAI_API_KEY:
        raise HTTPException(status_code=500, detail="AssemblyAI API key not configured")
    
    try:
        logger.info(f"Received audio file: {audio.filename}, content_type: {audio.content_type}")
        
        # Read audio file content
        audio_content = await audio.read()
        
        # Create a temporary file to store the audio
        with tempfile.NamedTemporaryFile(delete=False, suffix=f".{audio.filename.split('.')[-1] if '.' in audio.filename else 'wav'}") as temp_file:
            temp_file.write(audio_content)
            temp_file_path = temp_file.name
        
        try:
            # Initialize transcriber
            transcriber = aai.Transcriber()
            
            # Transcribe the audio file
            logger.info("Starting transcription...")
            transcript = transcriber.transcribe(temp_file_path)
            
            # Check if transcription was successful
            if transcript.status == aai.TranscriptStatus.error:
                error_msg = transcript.error if hasattr(transcript, 'error') else "Unknown error"
                logger.error(f"Transcription failed: {error_msg}")
                raise HTTPException(status_code=500, detail=f"Transcription failed: {error_msg}")
            
            # Get the transcript text
            transcript_text = transcript.text if transcript.text else ""
            
            logger.info(f"Transcription successful. Length: {len(transcript_text)} characters")
            
            return {
                "transcript": transcript_text,
                "status": "success",
                "confidence": getattr(transcript, 'confidence', None)
            }
            
        finally:
            # Clean up temporary file
            try:
                os.unlink(temp_file_path)
            except Exception as e:
                logger.warning(f"Failed to delete temp file: {e}")
                
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error transcribing audio: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Transcription error: {str(e)}")

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