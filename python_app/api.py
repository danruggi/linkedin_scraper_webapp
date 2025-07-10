from fastapi import FastAPI, HTTPException, Query
from fastapi.responses import JSONResponse
from typing import Optional, List
from models import CombinedLead, LeadsFilters, LeadStats, LeadSource, SortBy, SortOrder
from database import SQLiteDatabase

app = FastAPI(title="Lead Management API", version="1.0.0")

# Initialize database
db = SQLiteDatabase("../data/leads.db")

@app.get("/api/leads", response_model=List[CombinedLead])
async def get_leads(
    search: Optional[str] = Query(None),
    school: Optional[str] = Query(None),
    country: Optional[str] = Query(None),
    source: Optional[LeadSource] = Query(None),
    sortBy: Optional[SortBy] = Query(None),
    sortOrder: Optional[SortOrder] = Query(None)
):
    """Get all leads with optional filters"""
    try:
        filters = LeadsFilters(
            search=search,
            school=school,
            country=country,
            source=source,
            sortBy=sortBy,
            sortOrder=sortOrder
        )
        leads = db.get_leads(filters)
        return leads
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/leads/{uid}", response_model=CombinedLead)
async def get_lead_by_uid(uid: str):
    """Get a specific lead by UID"""
    try:
        lead = db.get_lead_by_uid(uid)
        if not lead:
            raise HTTPException(status_code=404, detail="Lead not found")
        return lead
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/stats", response_model=LeadStats)
async def get_lead_stats():
    """Get lead statistics"""
    try:
        stats = db.get_lead_stats()
        return stats
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/schools", response_model=List[str])
async def get_unique_schools():
    """Get unique schools"""
    try:
        schools = db.get_unique_schools()
        return schools
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/countries", response_model=List[str])
async def get_unique_countries():
    """Get unique countries"""
    try:
        countries = db.get_unique_countries()
        return countries
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)