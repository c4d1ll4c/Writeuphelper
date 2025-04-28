# Writeuphelper - Task List Generator for Production Artists

## Project Overview
WriteupHelper is a web application designed to help production artists and project managers create organized task lists for file processing. It allows users to input file details and generates structured, shareable checklists to streamline production workflows.

## User Requirements
### Inputs
- File names
- File locations (paths or URLs)
- Descriptions or notes (optional)
- Job or project identifiers
- Printing materials or specifications (if relevant)

### Outputs
- Itemized task lists with clear organization
- Exportable checklists (PDF or CSV)
- Shareable URLs
- Direct integration options (email, Slack, Adobe Workfront, etc.)

## Core Features
### User Interface
- Simple form with dynamic fields for multiple file inputs
- Add/remove items functionality
- Real-time preview of generated task list

### Task List Management
- Clear, structured summaries
- Editable after initial submission
- Version tracking and revision control

### Integration/Exports
- PDF export
- Spreadsheet export (CSV/Excel)
- Direct sharing via generated links
- Optional integrations with third-party tools

### Authentication (optional)
- Basic user authentication
- Role-based permissions

## Tech Stack
### Frontend
- Next.js 15 (React framework)
- Tailwind CSS for styling
- shadcn/ui for UI components
- React Hook Form for form handling
- Zod for validation

### Backend
- Node.js with Express API routes
- Server Components for data fetching
- Axios for API requests

### Database
- SQLite (development) / PostgreSQL (production)
- Prisma ORM for database operations

### Deployment
- Vercel (frontend and serverless functions)
- Railway or Render (if separate backend needed)

## Database Schema

### User
```prisma
model User {
  id            String    @id @default(cuid())
  name          String?
  email         String    @unique
  password      String?
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  projects      Project[]
}
```

### Project
```prisma
model Project {
  id            String    @id @default(cuid())
  name          String
  description   String?
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  userId        String
  user          User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  taskLists     TaskList[]

  @@index([userId])
}
```

### TaskList
```prisma
model TaskList {
  id            String    @id @default(cuid())
  title         String
  description   String?
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  projectId     String
  project       Project   @relation(fields: [projectId], references: [id], onDelete: Cascade)
  tasks         Task[]
  shareableUrl  String?   @unique
  version       Int       @default(1)

  @@index([projectId])
}
```

### Task
```prisma
model Task {
  id            String    @id @default(cuid())
  fileName      String
  fileLocation  String
  description   String?
  specifications String?
  completed     Boolean   @default(false)
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  taskListId    String
  taskList      TaskList  @relation(fields: [taskListId], references: [id], onDelete: Cascade)
  
  @@index([taskListId])
}
```

## Migrations
Initial migration will create the above schema.

## User Workflow
1. User registers/logs in (if auth enabled)
2. User creates a new project or selects an existing one
3. User creates a new task list within the project
4. User adds files and details through the dynamic form
5. System generates a structured checklist
6. User can edit, export, or share the checklist

## Implementation Phases
### Phase 1: Core Functionality
- Project setup with Next.js, Tailwind, shadcn/ui
- Database setup with Prisma
- Basic CRUD operations for projects and task lists
- Simple form for input collection

### Phase 2: Enhanced Features
- PDF and CSV export functionality
- Shareable URL generation
- Task list versioning
- UI/UX improvements

### Phase 3: Advanced Features (optional)
- Authentication and permissions
- Third-party integrations
- Analytics and reporting

## Deployment Optimization
The application has been optimized for web hosting following these best practices:

### Build Optimization
- Static HTML export with `next export` for hosting on standard web servers
- CSS minification with cssnano
- JavaScript minification with SWC
- Console log removal in production builds
- Bundle size analysis for identifying large dependencies

### Asset Optimization
- Image optimization with custom loader and WebP conversion
- Font optimization with proper caching headers
- SVG optimization
- CSS optimization with PostCSS

### Performance Optimization
- Browser caching with appropriate cache headers
- GZIP compression for text-based assets
- Keep-Alive connections enabled
- HTML minification
- HTTP/2 support where available

### Security Enhancements
- Content Security Policy implementation
- XSS protection headers
- MIME type sniffing protection
- HTTP to HTTPS redirection
- Image hotlinking prevention

### Deployment Process
1. Run `npm run build` to create optimized production build
2. Run `npm run siteground-deploy` to prepare files for SiteGround hosting
3. Upload the contents of the `siteground` directory to the web host
4. Ensure `.htaccess` file is properly uploaded for Apache configuration

This optimization process ensures the application loads quickly, consumes minimal bandwidth, and provides a secure browsing experience.
