# Lead Management System

## Overview

This is a full-stack lead management system available in two versions:

### TypeScript Version (Original)
- Built with React, Express.js, and SQLite
- Located in the root directory
- Full-featured web application with modern UI

### Python Version (Current)
- Built with FastAPI backend and Streamlit frontend
- Located in the `python_app/` directory
- Same functionality as TypeScript version but in Python
- Uses SQLite database from `data/leads.db`

The application allows users to view, filter, and manage leads from two sources: schools and Sales Navigator. It features a modern dashboard with statistics, filtering capabilities, and detailed lead information.

## User Preferences

Preferred communication style: Simple, everyday language.
User requested Python version due to TypeScript complexity.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite for fast development and optimized builds
- **UI Library**: Radix UI components with shadcn/ui design system
- **Styling**: Tailwind CSS with custom CSS variables for theming
- **State Management**: TanStack Query (React Query) for server state management
- **Routing**: Wouter for lightweight client-side routing
- **Forms**: React Hook Form with Zod validation

### Backend Architecture
- **Runtime**: Node.js with Express.js
- **Language**: TypeScript with ES modules
- **Database ORM**: Drizzle ORM with PostgreSQL
- **Database Provider**: Neon Database (serverless PostgreSQL)
- **API Design**: RESTful API with JSON responses
- **Development**: tsx for TypeScript execution in development

### Database Schema
- **leads_schools**: Stores leads from educational institutions
- **leads_salesnav**: Stores leads from LinkedIn Sales Navigator
- Both tables share common fields (uid, user_name, linkedin_profile_url, etc.)
- The application combines data from both sources for a unified view

## Key Components

### Data Storage
- **Storage Interface**: Abstract IStorage interface for flexible data access
- **Memory Storage**: In-memory storage with sample data for development
- **Database Integration**: Drizzle ORM configured for PostgreSQL with migrations
- **Dual Source Design**: Separate tables for schools and Sales Navigator leads

### Frontend Components
- **Dashboard**: Main application view with statistics and lead table
- **Lead Table**: Sortable, filterable table with pagination support
- **Lead Modal**: Detailed view of individual leads with all available information
- **Lead Filters**: Search and filter controls for schools and countries
- **Lead Stats**: Visual statistics showing lead distribution across sources

### API Endpoints
- `GET /api/leads` - Retrieve leads with optional filtering
- `GET /api/leads/:uid` - Get specific lead by unique identifier
- `GET /api/leads/stats` - Get lead statistics and counts
- `GET /api/schools` - Get unique school names for filtering
- `GET /api/countries` - Get unique countries for filtering

## Data Flow

1. **Data Ingestion**: Leads are stored in two separate PostgreSQL tables
2. **API Layer**: Express.js routes combine and filter data from both sources
3. **Client Requests**: React components use TanStack Query for data fetching
4. **State Management**: Server state cached and managed by React Query
5. **UI Updates**: Components reactively update when data changes

## External Dependencies

### Core Dependencies
- **Database**: Neon Database (serverless PostgreSQL)
- **UI Components**: Radix UI primitives for accessible components
- **Icons**: Lucide React for consistent iconography
- **Charts**: Recharts for data visualization
- **Date Handling**: date-fns for date manipulation

### Development Tools
- **TypeScript**: Full type safety across frontend and backend
- **ESLint/Prettier**: Code quality and formatting (implied by project structure)
- **Drizzle Kit**: Database schema management and migrations

## Deployment Strategy

### Build Process
- **Frontend**: Vite builds React app to `dist/public`
- **Backend**: esbuild bundles server code to `dist/index.js`
- **Database**: Drizzle migrations handle schema changes

### Environment Configuration
- **Development**: Uses tsx for TypeScript execution with hot reloading
- **Production**: Compiled JavaScript with optimized builds
- **Database**: Requires `DATABASE_URL` environment variable

### Hosting Considerations
- **Static Assets**: Frontend builds to static files for CDN deployment
- **API Server**: Node.js server can be deployed to any platform supporting ES modules
- **Database**: Configured for Neon serverless PostgreSQL with connection pooling

The application follows a clean separation of concerns with shared TypeScript types between frontend and backend, ensuring type safety across the entire stack. The architecture supports easy extension for additional lead sources and provides a solid foundation for scaling.