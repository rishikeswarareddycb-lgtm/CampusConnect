# CampusConnect — Backend API

RESTful API backend for **CampusConnect — Smart Campus Portal**, built with **Node.js**, **Express**, **MongoDB / Mongoose**, and **JWT**.

---

## 🚀 Features

- **Authentication & Authorization**:
  - Secure JWT authentication supporting both **HTTP-only cookies** and **Bearer headers**.
  - Passwords hashed using **bcryptjs** (salt rounds = 10).
  - Role-Based Access Control (`student` and `admin`).
- **Campus Complaints**:
  - Full CRUD operations with filtering by category, status, date range, and search keyword.
  - Status updates (`Submitted` → `In Progress` → `Resolved` / `Rejected`).
- **Lost & Found System**:
  - Filter lost or found items, claim management, security verification badges.
- **Events & Registration**:
  - Seat capacity tracking, seat booking, registration and cancellation.
- **Announcements**:
  - Pinned announcement prioritizing and category filtering.
- **Admin Management & Analytics**:
  - Student directory search, complaint category breakdown, and monthly trend analytics.
- **Resilient Database Layer**:
  - Seamlessly connects to MongoDB when available.
  - Automatically falls back to an embedded persistent local store (`server/data/campusconnect.db.json`) if MongoDB is not running locally — ensuring zero setup friction.

---

## 🛠️ Tech Stack

- **Runtime**: Node.js (ES Modules)
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM (with local JSON fallback)
- **Security**: Helmet, CORS, bcryptjs, JSON Web Tokens (JWT)
- **Utilities**: Morgan, Cookie-Parser, Dotenv

---

## 📁 Directory Structure

```text
server/
├── data/
│   └── campusconnect.db.json   # Local persistent database file (fallback)
├── src/
│   ├── app.js                  # Express application setup & middleware
│   ├── seeder.js               # Standalone database seeder
│   ├── config/
│   │   ├── db.js               # Database connection logic
│   │   └── defaultData.js      # Seed data mirroring portal mock data
│   ├── controllers/            # Route business logic
│   │   ├── adminController.js
│   │   ├── announcementController.js
│   │   ├── authController.js
│   │   ├── complaintController.js
│   │   ├── eventController.js
│   │   ├── lostFoundController.js
│   │   └── studentController.js
│   ├── middleware/
│   │   ├── authMiddleware.js   # JWT protect & adminOnly guards
│   │   └── errorMiddleware.js  # Centralized error & 404 handlers
│   ├── models/                 # Mongoose data schemas
│   │   ├── Announcement.js
│   │   ├── Complaint.js
│   │   ├── Event.js
│   │   ├── LostFound.js
│   │   └── User.js
│   ├── routes/                 # Express route definitions
│   │   ├── adminRoutes.js
│   │   ├── announcementRoutes.js
│   │   ├── authRoutes.js
│   │   ├── complaintRoutes.js
│   │   ├── eventRoutes.js
│   │   ├── lostFoundRoutes.js
│   │   └── studentRoutes.js
│   └── utils/
│       ├── generateToken.js    # JWT token generator
│       └── storage.js          # Unified DB/local storage adapter
├── .env.example
├── .gitignore
├── package.json
├── server.js                   # Server entry point
└── test-api.js                 # Automated API integration tests
```

---

## ⚙️ Environment Variables

Create a `.env` file in the `server` directory (or copy from `.env.example`):

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/campusconnect
JWT_SECRET=your_jwt_secret_key_here
CLIENT_URL=http://localhost:5173
```

---

## 🏃 Getting Started

### 1. Install dependencies
```bash
cd server
npm install
```

### 2. Seed default data
```bash
npm run seed
```

### 3. Run automated tests
```bash
npm test
```

### 4. Start the server
```bash
# Development (with nodemon auto-reload)
npm run dev

# Production
npm start
```
The server will be accessible at: `http://localhost:5000`

---

## 🔑 Default Accounts (Pre-seeded)

| Role | Email | Password |
|---|---|---|
| **Admin** | `admin@college.edu` | `admin123` |
| **Student** | `aarav@college.edu` | `student123` |
| **Student** | `sana@college.edu` | `student123` |

---

## 📖 API Documentation

### Health Check
- `GET /api/health` — Returns system status and database connection info.

### Authentication (`/api/auth`)
- `POST /api/auth/register` — Register student (`{ name, email, password, sid, dept, year }`).
- `POST /api/auth/login` — Log in (`{ email, password, remember }`).
- `POST /api/auth/logout` — Clear auth cookie.

### Students (`/api/students`)
- `GET /api/students/me` — Get current logged-in profile (Protected).
- `PUT /api/students/me` — Update profile or password (Protected).

### Complaints (`/api/complaints`)
- `GET /api/complaints` — List complaints (Filters: `q`, `category`, `status`, `range`, `student`).
- `POST /api/complaints` — Submit complaint (`{ title, category, priority, location, description, image }`).
- `GET /api/complaints/:id` — Get single complaint.
- `PATCH /api/complaints/:id/status` — Update complaint status (`{ status }`).
- `DELETE /api/complaints/:id` — Delete complaint (Admin).

### Lost & Found (`/api/lost-found`)
- `GET /api/lost-found` — List items (Filters: `type`, `category`, `status`, `q`).
- `POST /api/lost-found` — Report item (`{ type, name, category, date, location, description, contact, image }`).
- `GET /api/lost-found/:id` — Get single item.
- `PUT /api/lost-found/:id` — Update item details / claim status.
- `DELETE /api/lost-found/:id` — Delete item.

### Events (`/api/events`)
- `GET /api/events` — List all campus events.
- `POST /api/events` — Create event (Admin).
- `PUT /api/events/:id` — Update event (Admin).
- `DELETE /api/events/:id` — Delete event (Admin).
- `POST /api/events/:id/register` — Register student for an event (Protected).
- `DELETE /api/events/:id/register` — Cancel event registration (Protected).

### Announcements (`/api/announcements`)
- `GET /api/announcements` — List announcements (sorted: pinned first, newest date).
- `POST /api/announcements` — Create announcement (Admin).
- `PUT /api/announcements/:id` — Update announcement (Admin).
- `DELETE /api/announcements/:id` — Delete announcement (Admin).

### Admin (`/api/admin`)
- `GET /api/admin/students` — List all registered students (Admin).
- `GET /api/admin/stats` — Retrieve summary statistics and trend metrics (Admin).
