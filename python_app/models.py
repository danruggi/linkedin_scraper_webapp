from pydantic import BaseModel
from typing import Optional, List, Literal
from enum import Enum

class LeadSource(str, Enum):
    SCHOOLS = "schools"
    SALESNAV = "salesnav"
    BOTH = "both"

class SortBy(str, Enum):
    NAME = "name"
    TITLE = "title"
    LOCATION = "location"
    TIMESTAMP = "timestamp"

class SortOrder(str, Enum):
    ASC = "asc"
    DESC = "desc"

class CombinedLead(BaseModel):
    uid: str
    user_name: Optional[str] = None
    title: Optional[str] = None
    linkedin_profile_url: Optional[str] = None
    linkedin_image_url: Optional[str] = None
    location: Optional[str] = None
    req_school: Optional[str] = None
    req_country: Optional[str] = None
    timestamp: Optional[str] = None
    about: Optional[str] = None
    headline: Optional[str] = None
    skills: Optional[str] = None
    experience: Optional[str] = None
    source: LeadSource
    slug: Optional[str] = None

class LeadsFilters(BaseModel):
    search: Optional[str] = None
    school: Optional[str] = None
    country: Optional[str] = None
    source: Optional[LeadSource] = None
    sortBy: Optional[SortBy] = None
    sortOrder: Optional[SortOrder] = None

class LeadStats(BaseModel):
    totalLeads: int
    schoolsOnly: int
    salesnavOnly: int
    both: int