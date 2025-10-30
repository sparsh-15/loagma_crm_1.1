# CRM & Accounting Management System

A comprehensive CRM and Accounting Management System with role-based access control, built with React, Express, and TypeScript.

---

## 📋 Features

### User Roles
- **Admin**: Full system access, user management
- **Sales Manager**: Lead oversight, team management, approval workflows
- **Sales Executive**: Lead creation, quotation generation
- **Accountant**: Invoice management, financial oversight
- **Engineer**: Service ticket handling, project assignments
- **Client**: View quotations, invoices, and tickets

### Core Modules
- ✅ Lead Management with conversion workflow
- ✅ Quotation Generation with approval system
- ✅ Invoice Management
- ✅ Service Ticket System with engineer assignment
- ✅ Role-specific Dashboards with analytics
- ✅ User Management
- ✅ Authentication & Authorization

### Planned Features (Phase 2)
- 📄 PDF Generation (quotations, invoices)
- 📧 Email Notifications
- 📊 Advanced Reporting
- 💾 PostgreSQL Database Integration
- 📱 Mobile Responsive Design Enhancement

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm 9+

### Installation & Local Development

```bash
# Clone the repository (if downloading from Git)
git clone <your-repository-url>
cd crm-accounting

# Install dependencies
npm install

# Start development server (frontend + backend together)
npm run dev
```

The application will be available at: `http://localhost:5000`

### Separate Deployment (Production)

**Want to deploy frontend and backend separately?**

See **`QUICK_START.md`** for 5-minute deployment to Vercel (frontend) + Render (backend)!

Or see **`SEPARATE_DEPLOYMENT.md`** for detailed step-by-step guide.

---

## 🎯 Demo Credentials

| Role | Username | Password |
|------|----------|----------|
| Admin | `admin` | `admin123` |
| Sales Manager | `manager` | `manager123` |
| Sales Executive | `sales` | `sales123` |
| Accountant | `accountant` | `acc123` |
| Engineer | `engineer` | `eng123` |
| Client | `client` | `client123` |

---

## 📦 Project Structure

```
crm-accounting/
├── client/                   # Frontend (React + Vite + TypeScript)
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   │   └── ui/         # Shadcn UI components
│   │   ├── pages/          # Page components
│   │   │   ├── login.tsx
│   │   │   ├── dashboard.tsx
│   │   │   ├── leads.tsx
│   │   │   ├── quotations.tsx
│   │   │   ├── invoices.tsx
│   │   │   ├── tickets.tsx
│   │   │   └── users.tsx
│   │   ├── lib/            # Utilities and helpers
│   │   │   ├── auth-context.tsx   # Authentication context
│   │   │   └── queryClient.ts     # React Query setup
│   │   ├── App.tsx         # Main app with routing
│   │   ├── main.tsx        # Entry point
│   │   └── index.css       # Global styles
│   ├── index.html
│   └── package.json
│
├── server/                  # Backend (Express + TypeScript)
│   ├── index.ts            # Server entry point
│   ├── routes.ts           # API routes
│   ├── storage.ts          # Data storage layer (in-memory)
│   ├── auth.ts             # Passport authentication
│   ├── init-data.ts        # Sample data initialization
│   └── vite.ts             # Vite integration
│
├── shared/                  # Shared types between frontend/backend
│   └── schema.ts           # Drizzle schemas and types
│
├── package.json            # Root dependencies
├── tsconfig.json           # TypeScript configuration
├── vite.config.ts          # Vite configuration
├── tailwind.config.ts      # Tailwind CSS configuration
│
├── DEPLOYMENT_GUIDE.md     # Complete deployment instructions
├── ENVIRONMENT_VARIABLES.md # Environment configuration guide
└── README.md               # This file
```

---

## 🛠️ Technology Stack

### Frontend
- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Wouter** - Lightweight routing
- **TanStack Query** - Data fetching and caching
- **Shadcn UI** - Component library
- **Tailwind CSS** - Utility-first styling
- **Lucide React** - Icons
- **React Hook Form** - Form handling
- **Zod** - Schema validation

### Backend
- **Express** - Web framework
- **TypeScript** - Type safety
- **Passport.js** - Authentication
- **Express Session** - Session management
- **bcrypt** - Password hashing
- **Drizzle ORM** - Type-safe ORM (schemas only)

### Development
- **tsx** - TypeScript execution
- **Vite** - Hot module replacement
- **ESBuild** - Fast bundling

---

## 📝 Available Commands

### Development

```bash
# Start full-stack development server (frontend + backend)
npm run dev

# Frontend runs on: http://localhost:5000
# Backend API on: http://localhost:5000/api
# Vite HMR for instant updates
```

### Production Build

```bash
# Build frontend for production
cd client
npm run build

# Output will be in client/dist/
```

### Frontend Only (Separate Development)

```bash
# Navigate to client folder
cd client

# Install dependencies
npm install

# Start frontend dev server only
npm run dev

# Frontend will run on http://localhost:5173
# You'll need backend running separately
```

### Backend Only (Separate Development)

```bash
# From project root
npm run dev

# Or using tsx directly
npx tsx server/index.ts

# Backend will run on http://localhost:5000
```

### Linting & Type Checking

```bash
# Type check
npx tsc --noEmit

# Check for TypeScript errors in frontend
cd client && npx tsc --noEmit

# Check for TypeScript errors in backend
npx tsc --noEmit --project tsconfig.json
```

### Clean Install

```bash
# Remove all node_modules and reinstall
rm -rf node_modules package-lock.json
rm -rf client/node_modules client/package-lock.json
npm install
```

### Database Commands (Future - PostgreSQL)

```bash
# Generate Drizzle migrations
npx drizzle-kit generate

# Run migrations
npx drizzle-kit migrate

# Open Drizzle Studio (database GUI)
npx drizzle-kit studio
```

---

## 🔧 Configuration Files

### package.json (Root)
Main project dependencies and scripts

### client/package.json  
Frontend-specific dependencies

### vite.config.ts
- Frontend build configuration
- Path aliases (`@/`, `@shared/`, `@assets/`)
- Development server settings

### tailwind.config.ts
- UI component styling
- Theme customization
- Color schemes

### tsconfig.json
- TypeScript compiler options
- Path mappings

---

## 🌍 Environment Variables

See `ENVIRONMENT_VARIABLES.md` for complete documentation.

### Backend (.env in project root)

```env
NODE_ENV=development
PORT=5000
SESSION_SECRET=your-super-secret-key-min-32-characters
FRONTEND_URL=http://localhost:5173
```

### Frontend (.env in client/ folder)

```env
VITE_API_URL=http://localhost:5000
```

**Generate SESSION_SECRET:**
```bash
openssl rand -base64 32
```

---

## 📖 API Documentation

### Authentication

#### POST /api/auth/login
Login with username and password

**Request:**
```json
{
  "username": "admin",
  "password": "admin123"
}
```

**Response:**
```json
{
  "id": 1,
  "username": "admin",
  "name": "System Administrator",
  "email": "admin@crm.com",
  "role": "admin"
}
```

#### POST /api/auth/logout
Logout current user

#### GET /api/auth/check
Check if user is authenticated

---

### Leads

#### GET /api/leads
Get all leads (filtered by role)

#### POST /api/leads
Create new lead (Sales Executive, Sales Manager, Admin)

**Request:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "1234567890",
  "company": "Acme Corp",
  "source": "website",
  "notes": "Interested in enterprise plan"
}
```

#### GET /api/leads/:id
Get lead by ID

#### PATCH /api/leads/:id
Update lead

#### DELETE /api/leads/:id
Delete lead (Admin, Sales Manager)

#### POST /api/leads/:id/convert
Convert lead to client (Sales Manager, Admin)

---

### Quotations

#### GET /api/quotations
Get all quotations (filtered by role)

#### POST /api/quotations
Create quotation (Sales Executive, Sales Manager, Admin)

**Request:**
```json
{
  "clientId": 1,
  "items": [
    {
      "description": "Product A",
      "quantity": 2,
      "rate": 1000
    }
  ],
  "validUntil": "2025-12-31",
  "notes": "Special discount applied"
}
```

#### GET /api/quotations/:id
Get quotation by ID

#### PATCH /api/quotations/:id
Update quotation

#### PATCH /api/quotations/:id/approve
Approve quotation (Sales Manager, Admin)

#### PATCH /api/quotations/:id/reject
Reject quotation (Sales Manager, Admin)

---

### Invoices

#### GET /api/invoices
Get all invoices (filtered by role)

#### POST /api/invoices
Create invoice (Accountant, Admin)

#### GET /api/invoices/:id
Get invoice by ID

#### PATCH /api/invoices/:id
Update invoice

#### PATCH /api/invoices/:id/mark-paid
Mark invoice as paid (Accountant, Admin)

---

### Tickets

#### GET /api/tickets
Get all tickets (filtered by role)

#### POST /api/tickets
Create ticket (Client creates tickets)

#### GET /api/tickets/:id
Get ticket by ID

#### PATCH /api/tickets/:id
Update ticket

#### PATCH /api/tickets/:id/assign
Assign engineer to ticket (Admin, Sales Manager)

#### PATCH /api/tickets/:id/status
Update ticket status

---

### Users

#### GET /api/users
Get all users (Admin only)

#### POST /api/users
Create user (Admin only)

#### GET /api/users/:id
Get user by ID

#### PATCH /api/users/:id
Update user (Admin only)

#### DELETE /api/users/:id
Delete user (Admin only)

---

## 🎨 UI Components

The project uses **Shadcn UI** components. Available components:

- `Button` - Interactive buttons
- `Card` - Content containers
- `Input` - Form inputs
- `Label` - Form labels
- `Select` - Dropdown selects
- `Table` - Data tables
- `Dialog` - Modal dialogs
- `DropdownMenu` - Context menus
- `Badge` - Status indicators
- `Avatar` - User avatars
- `Tabs` - Tab navigation
- `Form` - Form handling with React Hook Form
- `Toast` - Notifications

**Adding New Components:**
```bash
npx shadcn-ui@latest add <component-name>
```

---

## 🧪 Testing

### Manual Testing Workflow

1. **Login as Admin**
   - Username: `admin`, Password: `admin123`
   - Verify dashboard loads with all metrics

2. **Test Lead Creation (as Sales Executive)**
   - Login as `sales` / `sales123`
   - Navigate to Leads page
   - Create new lead
   - Verify lead appears in list

3. **Test Lead Conversion (as Sales Manager)**
   - Login as `manager` / `manager123`
   - Convert a lead to client
   - Verify client appears in Clients section

4. **Test Quotation (as Sales Executive)**
   - Create quotation for a client
   - Add line items
   - Submit for approval

5. **Test Approval (as Sales Manager)**
   - Login as manager
   - Navigate to Quotations
   - Approve pending quotation

6. **Test Invoice (as Accountant)**
   - Login as `accountant` / `acc123`
   - Create invoice from approved quotation
   - Mark as paid

7. **Test Tickets (as Client)**
   - Login as `client` / `client123`
   - Create support ticket
   - Verify ticket appears

8. **Test Engineer Assignment (as Admin)**
   - Login as admin
   - Assign engineer to ticket
   - Verify assignment

### Automated Testing (Planned)
- Unit tests with Vitest
- Component tests with React Testing Library
- E2E tests with Playwright

---

## 🔒 Security Features

- ✅ Password hashing with bcrypt (10 rounds)
- ✅ Session-based authentication
- ✅ Role-based access control (RBAC)
- ✅ Protected API endpoints
- ✅ Input validation with Zod schemas
- ✅ CSRF protection (via session)
- ✅ Secure session cookies
- 🔄 Rate limiting (planned)
- 🔄 SQL injection prevention (when using DB)

---

## 📊 Current Limitations

### Data Storage
- **In-memory storage** - Data resets on server restart
- **Not suitable for production** - Use PostgreSQL for production

### Missing Features (Planned)
- PDF generation for quotations/invoices
- Email notifications
- File attachments
- Advanced search and filtering
- Export to CSV/Excel
- Audit logs
- Database persistence

---

## 🚀 Deployment

### Quick Deploy on Replit (Recommended)
1. Click **"Deploy"** button in Replit workspace
2. Choose **"Autoscale Deployment"**
3. Configure machine settings (0.5 vCPU, 512MB recommended)
4. Click **"Deploy"**
5. Your app is live! 🎉

### Deploy Separately
See **`DEPLOYMENT_GUIDE.md`** for complete instructions on:
- Deploying to Vercel (Frontend)
- Deploying to Railway (Backend)
- Deploying to Render
- Deploying to AWS
- Setting up PostgreSQL database
- Environment configuration

---

## 📁 How to Download This Project

### From Replit
1. Click the **three dots** (⋮) in the file tree
2. Click your project root folder
3. Select **"Download as ZIP"**
4. Extract on your local machine

### From Git (if repository is connected)
```bash
git clone <your-repository-url>
cd crm-accounting
npm install
```

---

## 🔧 Troubleshooting

### Server won't start
```bash
# Kill processes on port 5000
lsof -ti:5000 | xargs kill -9

# Or on Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Restart
npm run dev
```

### Dependencies issues
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm cache clean --force
npm install
```

### TypeScript errors
```bash
# Check for errors
npx tsc --noEmit

# Restart VS Code TypeScript server
# Cmd/Ctrl + Shift + P → "TypeScript: Restart TS Server"
```

### Vite HMR not working
```bash
# Restart the dev server
# Press Ctrl+C to stop
npm run dev
```

### Login not working
- Verify demo credentials
- Check browser console for errors
- Ensure backend is running on port 5000
- Clear browser cookies/cache

---

## 🤝 Contributing

### Development Workflow
1. Create feature branch: `git checkout -b feature/your-feature`
2. Make changes
3. Test thoroughly
4. Commit: `git commit -m "Add feature"`
5. Push: `git push origin feature/your-feature`
6. Create Pull Request

### Code Style
- Use TypeScript for type safety
- Follow existing code patterns
- Use meaningful variable names
- Add comments for complex logic
- Format with Prettier (if configured)

---

## 📚 Resources

- [React Documentation](https://react.dev/)
- [Vite Documentation](https://vitejs.dev/)
- [Express Documentation](https://expressjs.com/)
- [TypeScript Documentation](https://www.typescriptlang.org/)
- [Shadcn UI](https://ui.shadcn.com/)
- [TanStack Query](https://tanstack.com/query/latest)
- [Tailwind CSS](https://tailwindcss.com/)

---

## 📜 License

MIT License - feel free to use this project for learning or commercial purposes.

---

## 🆘 Support

For issues or questions:
1. Check `DEPLOYMENT_GUIDE.md`
2. Check `ENVIRONMENT_VARIABLES.md`
3. Review this README
4. Check browser console for errors
5. Check server logs

---

## 🎯 Roadmap

### Phase 1 (Current) ✅
- [x] Core authentication system
- [x] Role-based access control
- [x] Lead management
- [x] Quotation system with approval
- [x] Invoice management
- [x] Service tickets
- [x] User management
- [x] Dashboard analytics

### Phase 2 (Planned) 🔄
- [ ] PostgreSQL database integration
- [ ] PDF generation (quotations, invoices)
- [ ] Email notifications
- [ ] File attachments
- [ ] Advanced search & filters
- [ ] Audit logging
- [ ] Reporting module
- [ ] Export functionality (CSV, Excel)

### Phase 3 (Future) 📋
- [ ] Mobile responsive improvements
- [ ] Real-time notifications
- [ ] Calendar integration
- [ ] Payment gateway integration
- [ ] Multi-language support
- [ ] Dark mode theme
- [ ] API documentation (Swagger)
- [ ] Automated testing suite

---

**Built with ❤️ using React, Express, and TypeScript**

**Last Updated**: October 2025  
**Version**: 1.0.0  
**Status**: Beta - Development
