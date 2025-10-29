# CRM + Accounting Management System

A comprehensive business management application with role-based access control, built with React, TypeScript, Express, and in-memory storage.

## Overview

This application manages leads, clients, quotations, invoices, and service tickets with six different user roles and permissions.

## Tech Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS, Shadcn UI, Wouter (routing), TanStack Query, Chart.js
- **Backend**: Express.js, Node.js
- **Storage**: In-memory JavaScript (MemStorage)
- **Charts**: Chart.js with react-chartjs-2

## User Roles & Credentials

| Role | Username | Password | Access Level |
|------|----------|----------|--------------|
| Admin | admin | admin123 | Full system access |
| Sales Manager | manager | manager123 | Leads, Clients, Quotations |
| Sales Executive | exec | exec123 | Assigned Leads, Quotations |
| Accountant | accountant | acc123 | Quotations, Invoices |
| Engineer | engineer | eng123 | Tickets |
| Client | client | client123 | Own Quotations, Invoices, Tickets |

## Features

### Authentication
- Session-based login with role-based access control
- Protected routes based on user permissions
- Persistent login state in localStorage

### Dashboard
- Role-specific metrics and charts
- Summary cards (Leads, Clients, Quotations, Revenue, Pending Payments)
- Chart.js visualizations:
  - Pie chart: Lead status distribution
  - Bar chart: Quotation status breakdown
  - Line chart: Monthly revenue trend
- Recent activities feed (last 10 activities)

### Lead Management
- Full CRUD operations
- Lead status workflow: New → In Progress → Converted/Lost
- Follow-up notes with timeline
- Convert lead to client functionality
- Assignment to sales executives
- Search and filter capabilities

### Client Management
- Client list with search
- Client detail pages with:
  - Contact information
  - Transaction history (quotations & invoices)
  - Service tickets
  - Total revenue calculation
- Quick actions to create quotations and tickets

### Quotation Management
- Dynamic line item creation with auto-calculations
- 18% tax rate (configurable)
- Status workflow: Draft → Pending → Approved/Rejected
- Role-based approval system (Manager/Admin can approve)
- Professional quotation detail view
- Generate invoice from approved quotation

### Invoice Management
- Auto-generation from approved quotations
- Invoice number format: INV-YYYY-###
- Status tracking: Generated, Sent, Paid, Overdue, Partially Paid
- Payment recording with multiple payment methods
- Professional invoice layout

### Service Ticket System
- Ticket creation with priority levels (Low, Medium, High, Critical)
- Status workflow: Open → In Progress → Resolved → Closed
- Assignment to engineers
- Activity timeline with notes
- Filter by status and priority

## Architecture

### Frontend Structure
- `/client/src/pages` - Page components
- `/client/src/components` - Reusable UI components
- `/client/src/lib` - Utilities and contexts
- `/shared` - Shared types and schemas

### Backend Structure
- `/server/routes.ts` - API routes
- `/server/storage.ts` - In-memory storage implementation
- `/shared/schema.ts` - Zod schemas and TypeScript types

### Data Model
All entities use Zod schemas for validation:
- Users (with roles)
- Leads (with notes and conversion tracking)
- Clients (with revenue aggregation)
- Quotations (with line items and approval workflow)
- Invoices (with payment tracking)
- Tickets (with priority and timeline)
- Activities (audit log)

## Running the Application

The workflow "Start application" runs `npm run dev` which:
1. Starts Express backend on the configured port
2. Starts Vite dev server for frontend
3. Serves everything on the same port

## Sample Data

Pre-populated data includes:
- 10 Leads (various statuses and assignments)
- 5 Clients (converted from leads)
- 8 Quotations (Draft, Pending, Approved, Rejected)
- 5 Invoices (Generated, Sent, Paid)
- 6 Tickets (Open, In Progress, Resolved, Closed)
- Activity logs for all entities

## Recent Changes

- 2025-10-29: Initial application setup with complete frontend components and schema definitions
- Role-based navigation and permissions implemented
- Chart.js integration for dashboard analytics
- Professional quotation and invoice layouts
- Complete CRUD operations for all entities
