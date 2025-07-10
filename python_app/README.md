# Python Lead Management System

This is a complete Python version of the Lead Management System that works with your SQLite database.

## Features

- **Dashboard with Statistics**: View total leads, breakdown by source, and visual charts
- **Lead Filtering**: Search by name, filter by school, country, and source
- **Sorting**: Sort leads by name, title, location, or timestamp
- **Detailed View**: Click on any lead to see full profile information
- **Export**: Download filtered leads as CSV
- **Real-time Data**: Connects directly to your SQLite database

## Architecture

- **Backend**: FastAPI for REST API endpoints
- **Frontend**: Streamlit for interactive web interface
- **Database**: SQLite with your existing `leads.db` file
- **Data**: Combines leads from both `leads_schools` and `leads_salesnav` tables

## How to Run

### Option 1: Run Everything (Recommended)
```bash
cd python_app
chmod +x run_app.sh
./run_app.sh
```

### Option 2: Run Separately

1. Start the FastAPI backend:
```bash
cd python_app
python3 start_api.py
```

2. In another terminal, start the Streamlit frontend:
```bash
cd python_app
python3 start_app.py
```

### Option 3: Direct Commands

1. Backend (FastAPI):
```bash
cd python_app
uvicorn api:app --host 0.0.0.0 --port 8000 --reload
```

2. Frontend (Streamlit):
```bash
cd python_app
streamlit run app.py --server.port 8501 --server.address 0.0.0.0
```

## URLs

- **Streamlit App**: http://localhost:8501
- **FastAPI Backend**: http://localhost:8000
- **API Documentation**: http://localhost:8000/docs

## Files

- `models.py`: Data models and types
- `database.py`: SQLite database operations
- `api.py`: FastAPI backend with REST endpoints
- `app.py`: Streamlit frontend application
- `start_api.py`: FastAPI startup script
- `start_app.py`: Streamlit startup script
- `run_app.sh`: Complete application startup script

## Database Requirements

The application expects your SQLite database at `../data/leads.db` with these tables:

- `leads_schools`: Leads from educational institutions
- `leads_salesnav`: Leads from LinkedIn Sales Navigator

## API Endpoints

- `GET /api/leads`: Get all leads with optional filters
- `GET /api/leads/{uid}`: Get specific lead by UID
- `GET /api/stats`: Get lead statistics
- `GET /api/schools`: Get unique schools list
- `GET /api/countries`: Get unique countries list

## Features Comparison

This Python version provides the same functionality as the TypeScript version:

✅ Lead statistics dashboard
✅ Interactive filtering and searching
✅ Sortable lead table
✅ Detailed lead profiles
✅ CSV export functionality
✅ Real-time database connection
✅ Source-based color coding
✅ Responsive design