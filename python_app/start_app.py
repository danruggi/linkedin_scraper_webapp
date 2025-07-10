#!/usr/bin/env python3
"""
Start the Streamlit frontend
"""
import subprocess
import sys
import os

def main():
    print("🚀 Starting Streamlit frontend on http://localhost:8501")
    
    # Change to the python_app directory
    os.chdir(os.path.dirname(os.path.abspath(__file__)))
    
    # Run streamlit
    cmd = [
        sys.executable, 
        "-m", "streamlit", 
        "run", 
        "app.py",
        "--server.port=8501",
        "--server.address=0.0.0.0",
        "--server.headless=true"
    ]
    
    subprocess.run(cmd)

if __name__ == "__main__":
    main()