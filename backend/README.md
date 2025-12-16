# FastAPI Mock Backend

A simple FastAPI backend with mock endpoints for testing and development.

## Setup

1. Install dependencies:
```bash
pip install -r requirements.txt
```

## Run

Start the server:
```bash
uvicorn main:app --reload
```

Or run directly:
```bash
python main.py
```

The API will be available at `http://localhost:8000`

## API Documentation

Once running, visit:
- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

## Endpoints

### General
- `GET /` - Welcome message
- `GET /health` - Health check

### Items
- `GET /items` - Get all items
- `GET /items/{item_id}` - Get specific item
- `POST /items` - Create new item
- `DELETE /items/{item_id}` - Delete item

### Users
- `GET /users` - Get all users
- `GET /users/{user_id}` - Get specific user
- `POST /users` - Create new user
