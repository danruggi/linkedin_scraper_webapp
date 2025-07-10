import streamlit as st
import pandas as pd
import plotly.express as px
import plotly.graph_objects as go
from plotly.subplots import make_subplots
import requests
from typing import Optional, List, Dict, Any
import json
from datetime import datetime
import base64
import io

# Set page config
st.set_page_config(
    page_title="Lead Management System",
    page_icon="👥",
    layout="wide",
    initial_sidebar_state="expanded"
)

# Custom CSS for styling
st.markdown("""
<style>
    .main-header {
        background: linear-gradient(90deg, #2563eb, #1e40af);
        color: white;
        padding: 1rem;
        border-radius: 10px;
        margin-bottom: 2rem;
    }
    
    .stat-card {
        background: white;
        padding: 1.5rem;
        border-radius: 10px;
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        border-left: 4px solid #2563eb;
    }
    
    .schools-card {
        border-left-color: #10b981;
    }
    
    .salesnav-card {
        border-left-color: #f59e0b;
    }
    
    .both-card {
        border-left-color: #8b5cf6;
    }
    
    .lead-card {
        background: white;
        padding: 1rem;
        border-radius: 8px;
        box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        margin-bottom: 1rem;
    }
    
    .badge-schools {
        background-color: #dcfce7;
        color: #166534;
        padding: 0.25rem 0.75rem;
        border-radius: 9999px;
        font-size: 0.875rem;
        font-weight: 500;
    }
    
    .badge-salesnav {
        background-color: #fef3c7;
        color: #92400e;
        padding: 0.25rem 0.75rem;
        border-radius: 9999px;
        font-size: 0.875rem;
        font-weight: 500;
    }
    
    .badge-both {
        background-color: #e9d5ff;
        color: #6b21a8;
        padding: 0.25rem 0.75rem;
        border-radius: 9999px;
        font-size: 0.875rem;
        font-weight: 500;
    }
</style>
""", unsafe_allow_html=True)

# API Base URL
API_BASE_URL = "http://localhost:8000"

class LeadManagementApp:
    def __init__(self):
        self.api_base_url = API_BASE_URL
        
    def make_request(self, endpoint: str, params: Optional[Dict] = None) -> Dict[str, Any]:
        """Make API request with error handling"""
        try:
            response = requests.get(f"{self.api_base_url}{endpoint}", params=params)
            response.raise_for_status()
            return response.json()
        except requests.exceptions.RequestException as e:
            st.error(f"API Error: {str(e)}")
            return {}
    
    def get_leads(self, filters: Optional[Dict] = None) -> List[Dict]:
        """Get leads with filters"""
        params = {}
        if filters:
            for key, value in filters.items():
                if value and value != "All":
                    params[key] = value
        
        data = self.make_request("/api/leads", params)
        return data if isinstance(data, list) else []
    
    def get_lead_stats(self) -> Dict:
        """Get lead statistics"""
        return self.make_request("/api/stats")
    
    def get_unique_schools(self) -> List[str]:
        """Get unique schools"""
        data = self.make_request("/api/schools")
        return data if isinstance(data, list) else []
    
    def get_unique_countries(self) -> List[str]:
        """Get unique countries"""
        data = self.make_request("/api/countries")
        return data if isinstance(data, list) else []
    
    def get_lead_by_uid(self, uid: str) -> Dict:
        """Get specific lead by UID"""
        return self.make_request(f"/api/leads/{uid}")
    
    def render_header(self):
        """Render the main header"""
        st.markdown("""
        <div class="main-header">
            <h1>👥 Lead Management System</h1>
            <p>Manage and analyze your LinkedIn leads from multiple sources</p>
        </div>
        """, unsafe_allow_html=True)
    
    def render_stats_cards(self, stats: Dict):
        """Render statistics cards"""
        if not stats:
            return
            
        col1, col2, col3, col4 = st.columns(4)
        
        with col1:
            st.markdown(f"""
            <div class="stat-card">
                <h3>📊 Total Leads</h3>
                <h2>{stats.get('totalLeads', 0)}</h2>
            </div>
            """, unsafe_allow_html=True)
        
        with col2:
            st.markdown(f"""
            <div class="stat-card schools-card">
                <h3>🎓 Schools Only</h3>
                <h2>{stats.get('schoolsOnly', 0)}</h2>
            </div>
            """, unsafe_allow_html=True)
        
        with col3:
            st.markdown(f"""
            <div class="stat-card salesnav-card">
                <h3>📈 Sales Navigator</h3>
                <h2>{stats.get('salesnavOnly', 0)}</h2>
            </div>
            """, unsafe_allow_html=True)
        
        with col4:
            st.markdown(f"""
            <div class="stat-card both-card">
                <h3>🔄 Both Sources</h3>
                <h2>{stats.get('both', 0)}</h2>
            </div>
            """, unsafe_allow_html=True)
    
    def render_stats_chart(self, stats: Dict):
        """Render statistics chart"""
        if not stats:
            return
            
        # Create pie chart
        labels = ['Schools Only', 'Sales Navigator', 'Both Sources']
        values = [stats.get('schoolsOnly', 0), stats.get('salesnavOnly', 0), stats.get('both', 0)]
        colors = ['#10b981', '#f59e0b', '#8b5cf6']
        
        fig = go.Figure(data=[go.Pie(
            labels=labels,
            values=values,
            marker_colors=colors,
            hole=0.3
        )])
        
        fig.update_traces(
            textposition='inside',
            textinfo='percent+label',
            textfont_size=12
        )
        
        fig.update_layout(
            title="Lead Distribution by Source",
            font=dict(size=14),
            showlegend=True,
            height=400
        )
        
        st.plotly_chart(fig, use_container_width=True)
    
    def render_filters(self, schools: List[str], countries: List[str]) -> Dict:
        """Render filter controls"""
        st.subheader("🔍 Filter Leads")
        
        col1, col2, col3, col4 = st.columns(4)
        
        with col1:
            search = st.text_input("Search", placeholder="Search leads...")
        
        with col2:
            school_options = ["All"] + schools
            school = st.selectbox("School", school_options)
        
        with col3:
            country_options = ["All"] + countries
            country = st.selectbox("Country", country_options)
        
        with col4:
            source_options = ["All", "schools", "salesnav", "both"]
            source = st.selectbox("Source", source_options)
        
        # Sorting options
        col5, col6 = st.columns(2)
        with col5:
            sort_by = st.selectbox("Sort by", ["name", "title", "location", "timestamp"])
        
        with col6:
            sort_order = st.selectbox("Order", ["asc", "desc"])
        
        return {
            "search": search if search else None,
            "school": school if school != "All" else None,
            "country": country if country != "All" else None,
            "source": source if source != "All" else None,
            "sortBy": sort_by,
            "sortOrder": sort_order
        }
    
    def get_source_badge(self, source: str) -> str:
        """Get HTML badge for source"""
        if source == "schools":
            return '<span class="badge-schools">🎓 Schools</span>'
        elif source == "salesnav":
            return '<span class="badge-salesnav">📈 Sales Nav</span>'
        elif source == "both":
            return '<span class="badge-both">🔄 Both</span>'
        return '<span class="badge-schools">Unknown</span>'
    
    def render_lead_card(self, lead: Dict):
        """Render individual lead card"""
        name = lead.get('user_name', 'Unknown')
        title = lead.get('title', 'N/A')
        location = lead.get('location', 'N/A')
        school = lead.get('req_school', 'N/A')
        country = lead.get('req_country', 'N/A')
        linkedin_url = lead.get('linkedin_profile_url', '')
        image_url = lead.get('linkedin_image_url', '')
        source = lead.get('source', 'unknown')
        
        # Create columns for lead card
        col1, col2, col3 = st.columns([1, 3, 1])
        
        with col1:
            if image_url:
                st.image(image_url, width=60)
            else:
                st.write("👤")
        
        with col2:
            st.markdown(f"**{name}**")
            st.write(f"📋 {title}")
            st.write(f"📍 {location}")
            st.write(f"🎓 {school}")
            st.write(f"🌍 {country}")
            if linkedin_url:
                st.markdown(f"[🔗 LinkedIn Profile]({linkedin_url})")
        
        with col3:
            st.markdown(self.get_source_badge(source), unsafe_allow_html=True)
            if st.button("View Details", key=f"view_{lead['uid']}"):
                self.show_lead_details(lead)
    
    def show_lead_details(self, lead: Dict):
        """Show detailed lead information in modal"""
        st.subheader(f"Lead Details: {lead.get('user_name', 'Unknown')}")
        
        col1, col2 = st.columns([1, 2])
        
        with col1:
            # Profile image
            if lead.get('linkedin_image_url'):
                st.image(lead['linkedin_image_url'], width=150)
            else:
                st.write("👤 No Image")
            
            # Basic info
            st.write("**Basic Information**")
            st.write(f"**Name:** {lead.get('user_name', 'N/A')}")
            st.write(f"**Title:** {lead.get('title', 'N/A')}")
            st.write(f"**Location:** {lead.get('location', 'N/A')}")
            st.write(f"**School:** {lead.get('req_school', 'N/A')}")
            st.write(f"**Country:** {lead.get('req_country', 'N/A')}")
            
            if lead.get('linkedin_profile_url'):
                st.markdown(f"[🔗 View LinkedIn Profile]({lead['linkedin_profile_url']})")
        
        with col2:
            # Extended information
            if lead.get('about'):
                st.write("**About**")
                st.write(lead['about'])
            
            if lead.get('headline'):
                st.write("**Headline**")
                st.write(lead['headline'])
            
            if lead.get('skills'):
                st.write("**Skills**")
                skills = lead['skills'].split(',')
                for skill in skills:
                    st.markdown(f"• {skill.strip()}")
            
            if lead.get('experience'):
                st.write("**Experience**")
                experiences = lead['experience'].split(',')
                for exp in experiences:
                    st.markdown(f"• {exp.strip()}")
            
            # Source information
            st.write("**Data Source**")
            st.markdown(self.get_source_badge(lead.get('source', 'unknown')), unsafe_allow_html=True)
    
    def export_to_csv(self, leads: List[Dict]) -> str:
        """Export leads to CSV"""
        if not leads:
            return ""
        
        df = pd.DataFrame(leads)
        
        # Select relevant columns
        export_columns = [
            'user_name', 'title', 'location', 'req_school', 'req_country', 
            'source', 'linkedin_profile_url', 'about', 'headline', 'skills', 'experience'
        ]
        
        export_df = df[export_columns].copy()
        export_df.columns = [
            'Name', 'Title', 'Location', 'School', 'Country', 
            'Source', 'LinkedIn URL', 'About', 'Headline', 'Skills', 'Experience'
        ]
        
        return export_df.to_csv(index=False)
    
    def render_leads_table(self, leads: List[Dict]):
        """Render leads table with pagination"""
        if not leads:
            st.warning("No leads found matching your criteria.")
            return
        
        # Export button
        if st.button("📥 Export to CSV"):
            csv_data = self.export_to_csv(leads)
            if csv_data:
                st.download_button(
                    label="Download CSV",
                    data=csv_data,
                    file_name=f"leads_export_{datetime.now().strftime('%Y%m%d_%H%M%S')}.csv",
                    mime="text/csv"
                )
        
        # Pagination
        leads_per_page = 10
        total_pages = (len(leads) + leads_per_page - 1) // leads_per_page
        
        if total_pages > 1:
            page = st.number_input("Page", min_value=1, max_value=total_pages, value=1)
            start_idx = (page - 1) * leads_per_page
            end_idx = start_idx + leads_per_page
            page_leads = leads[start_idx:end_idx]
            
            st.write(f"Showing {start_idx + 1}-{min(end_idx, len(leads))} of {len(leads)} leads")
        else:
            page_leads = leads
            st.write(f"Showing {len(leads)} leads")
        
        # Render leads
        for lead in page_leads:
            with st.container():
                self.render_lead_card(lead)
                st.markdown("---")
    
    def run(self):
        """Main application runner"""
        self.render_header()
        
        # Get data
        stats = self.get_lead_stats()
        schools = self.get_unique_schools()
        countries = self.get_unique_countries()
        
        # Render stats
        if stats:
            self.render_stats_cards(stats)
            
            # Chart section
            st.subheader("📊 Lead Distribution")
            col1, col2 = st.columns([2, 1])
            
            with col1:
                self.render_stats_chart(stats)
            
            with col2:
                st.write("**Summary**")
                st.write(f"Total Leads: {stats.get('totalLeads', 0)}")
                st.write(f"Schools Only: {stats.get('schoolsOnly', 0)}")
                st.write(f"Sales Navigator: {stats.get('salesnavOnly', 0)}")
                st.write(f"Both Sources: {stats.get('both', 0)}")
        
        # Filters
        filters = self.render_filters(schools, countries)
        
        # Get filtered leads
        leads = self.get_leads(filters)
        
        # Render leads table
        st.subheader("📋 Leads")
        self.render_leads_table(leads)

# Initialize and run app
if __name__ == "__main__":
    app = LeadManagementApp()
    app.run()