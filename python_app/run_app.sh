#!/bin/bash

# Start the Python Lead Management Application

echo "🚀 Starting Python Lead Management Application"
echo "========================================"

# Check if database exists
if [ ! -f "../data/leads.db" ]; then
    echo "❌ Database file not found at ../data/leads.db"
    echo "Please make sure your leads.db file is in the data/ directory"
    exit 1
fi

echo "✅ Database found"

# Start FastAPI backend in background
echo "🔧 Starting FastAPI backend..."
cd "$(dirname "$0")"
python3 start_api.py &
API_PID=$!

# Wait for API to start
sleep 3

# Check if API is running
if curl -s http://localhost:8000/api/stats > /dev/null; then
    echo "✅ FastAPI backend started successfully"
else
    echo "❌ Failed to start FastAPI backend"
    kill $API_PID 2>/dev/null
    exit 1
fi

# Start Streamlit frontend
echo "🎨 Starting Streamlit frontend..."
python3 start_app.py

# Cleanup: kill background processes when script exits
trap "kill $API_PID 2>/dev/null" EXIT