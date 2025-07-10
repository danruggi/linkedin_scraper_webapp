import sqlite3
from typing import List, Optional, Dict, Any
from models import CombinedLead, LeadsFilters, LeadStats, LeadSource

class SQLiteDatabase:
    def __init__(self, db_path: str):
        self.db_path = db_path
    
    def get_connection(self):
        return sqlite3.connect(self.db_path)
    
    def get_leads(self, filters: Optional[LeadsFilters] = None) -> List[CombinedLead]:
        conn = self.get_connection()
        conn.row_factory = sqlite3.Row
        
        try:
            # Get all leads from both tables
            schools_query = "SELECT *, 'schools' as source_table FROM leads_schools"
            salesnav_query = "SELECT *, 'salesnav' as source_table FROM leads_salesnav"
            
            schools_leads = conn.execute(schools_query).fetchall()
            salesnav_leads = conn.execute(salesnav_query).fetchall()
            
            # Combine leads by UID
            unique_leads = {}
            
            # Process schools leads
            for row in schools_leads:
                lead_data = {
                    'uid': row['uid'],
                    'user_name': row['user_name'],
                    'title': row['title'],
                    'linkedin_profile_url': row['linkedin_profile_url'],
                    'linkedin_image_url': row['linkedin_image_url'],
                    'location': row['location'],
                    'req_school': row['req_school'],
                    'req_country': row['req_country'],
                    'timestamp': row['timestamp'],
                    'about': None,
                    'headline': None,
                    'skills': None,
                    'experience': None,
                    'source': LeadSource.SCHOOLS,
                    'slug': row['slug']
                }
                unique_leads[row['uid']] = lead_data
            
            # Process salesnav leads
            for row in salesnav_leads:
                if row['uid'] in unique_leads:
                    # Lead exists in both sources
                    existing = unique_leads[row['uid']]
                    existing.update({
                        'about': row['about'],
                        'headline': row['headline'],
                        'skills': row['skills'],
                        'experience': row['experience'],
                        'source': LeadSource.BOTH
                    })
                else:
                    # Lead only in salesnav
                    lead_data = {
                        'uid': row['uid'],
                        'user_name': row['user_name'],
                        'title': row['title'],
                        'linkedin_profile_url': row['linkedin_profile_url'],
                        'linkedin_image_url': row['linkedin_image_url'],
                        'location': row['location'],
                        'req_school': row['req_school'],
                        'req_country': row['req_country'],
                        'timestamp': row['timestamp'],
                        'about': row['about'],
                        'headline': row['headline'],
                        'skills': row['skills'],
                        'experience': row['experience'],
                        'source': LeadSource.SALESNAV,
                        'slug': row['slug']
                    }
                    unique_leads[row['uid']] = lead_data
            
            # Convert to CombinedLead objects
            leads = [CombinedLead(**lead_data) for lead_data in unique_leads.values()]
            
            # Apply filters
            if filters:
                leads = self._apply_filters(leads, filters)
            
            return leads
            
        finally:
            conn.close()
    
    def _apply_filters(self, leads: List[CombinedLead], filters: LeadsFilters) -> List[CombinedLead]:
        filtered_leads = leads
        
        # Search filter
        if filters.search:
            search_lower = filters.search.lower()
            filtered_leads = [
                lead for lead in filtered_leads
                if (lead.user_name and search_lower in lead.user_name.lower()) or
                   (lead.title and search_lower in lead.title.lower()) or
                   (lead.location and search_lower in lead.location.lower()) or
                   (lead.req_school and search_lower in lead.req_school.lower())
            ]
        
        # School filter
        if filters.school:
            filtered_leads = [
                lead for lead in filtered_leads
                if lead.req_school and filters.school.lower() in lead.req_school.lower()
            ]
        
        # Country filter
        if filters.country:
            filtered_leads = [
                lead for lead in filtered_leads
                if lead.req_country and filters.country.lower() in lead.req_country.lower()
            ]
        
        # Source filter
        if filters.source:
            filtered_leads = [
                lead for lead in filtered_leads
                if lead.source == filters.source
            ]
        
        # Sorting
        if filters.sortBy:
            reverse = filters.sortOrder == 'desc'
            if filters.sortBy == 'name':
                filtered_leads.sort(key=lambda x: x.user_name or '', reverse=reverse)
            elif filters.sortBy == 'title':
                filtered_leads.sort(key=lambda x: x.title or '', reverse=reverse)
            elif filters.sortBy == 'location':
                filtered_leads.sort(key=lambda x: x.location or '', reverse=reverse)
            elif filters.sortBy == 'timestamp':
                filtered_leads.sort(key=lambda x: x.timestamp or '', reverse=reverse)
        
        return filtered_leads
    
    def get_lead_by_uid(self, uid: str) -> Optional[CombinedLead]:
        leads = self.get_leads()
        return next((lead for lead in leads if lead.uid == uid), None)
    
    def get_lead_stats(self) -> LeadStats:
        leads = self.get_leads()
        schools_only = sum(1 for lead in leads if lead.source == LeadSource.SCHOOLS)
        salesnav_only = sum(1 for lead in leads if lead.source == LeadSource.SALESNAV)
        both = sum(1 for lead in leads if lead.source == LeadSource.BOTH)
        
        return LeadStats(
            totalLeads=len(leads),
            schoolsOnly=schools_only,
            salesnavOnly=salesnav_only,
            both=both
        )
    
    def get_unique_schools(self) -> List[str]:
        conn = self.get_connection()
        try:
            query = """
                SELECT DISTINCT req_school FROM leads_schools 
                WHERE req_school IS NOT NULL AND req_school != ''
                UNION
                SELECT DISTINCT req_school FROM leads_salesnav 
                WHERE req_school IS NOT NULL AND req_school != ''
                ORDER BY req_school
            """
            schools = conn.execute(query).fetchall()
            return [school[0] for school in schools]
        finally:
            conn.close()
    
    def get_unique_countries(self) -> List[str]:
        conn = self.get_connection()
        try:
            query = """
                SELECT DISTINCT req_country FROM leads_schools 
                WHERE req_country IS NOT NULL AND req_country != ''
                UNION
                SELECT DISTINCT req_country FROM leads_salesnav 
                WHERE req_country IS NOT NULL AND req_country != ''
                ORDER BY req_country
            """
            countries = conn.execute(query).fetchall()
            return [country[0] for country in countries]
        finally:
            conn.close()