#!/usr/bin/env python3
"""
Start the FastAPI backend server
"""
import uvicorn
from api import app

if __name__ == "__main__":
    print("🚀 Starting FastAPI backend on http://localhost:8000")
    uvicorn.run(
        app, 
        host="0.0.0.0", 
        port=8000,
        reload=True,
        log_level="info"
    )