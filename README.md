# CampusConnect — Smart Campus Portal

> A modern, full-stack campus management platform connecting students, faculty, and administration for issue reporting, lost & found items, event registration, and announcements.

---

## 🌟 Highlights & Tech Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React 18, Vite, Tailwind CSS, React Router v6, Recharts, React Hook Form, Axios, Lucide Icons |
| **Backend** | Node.js, Express.js, MongoDB / Mongoose ODM (with auto-fallback to local store), JWT, bcryptjs, Helmet, CORS |
| **Tooling** | PostCSS, Autoprefixer, Nodemon, Morgan |

---

## 📁 Project Architecture

```text
campusconnect/
├── server/                     # Express.js REST API Backend
│   ├── src/
│   │   ├── app.js              # Express app setup & middleware
│   │   ├── config/             # DB connection & seed data
│   │   ├── controllers/        # Business logic for all endpoints
│   │   ├── middleware/         # JWT auth & error handling
│   │   ├── models/             # Mongoose schemas (User, Complaint, Event, etc.)
│   │   ├── routes/             # RESTful API route definitions
│   │   └── utils/              # Token generation & data persistence layer
│   ├── server.js               # Backend entry point
│   ├── test-api.js             # Automated API integration tests
│   ├── .env.example
│   └── package.json
├── src/                        # React Frontend
│   ├── components/             # Layout, Navigation, UI Kit (Modal, Badge, etc.)
│   ├── context/                # Global React Context & Toast notifications
│   ├── data/                   # Initial mock data and categories
│   ├── pages/                  # Landing, Login, Student Portal, Admin Dashboard
│   ├── services/               # Axios API client & service wrappers
│   ├── App.jsx                 # Route definitions & navigation guards
│   └── main.jsx
├── index.html
├── vite.config.js
├── tailwind.config.js
├── package.json
└── README.md
```

---

## ⚡ Quick Start

### Prerequisites
- **Node.js** (v18 or higher recommended)
- **npm** (comes with Node.js)
- *(Optional)* **MongoDB** (Local or MongoDB Atlas). If MongoDB is offline, the backend seamlessly runs using an embedded persistent local store.

---

### Step 1: Backend Setup
```bash
# Navigate to the backend directory
cd server

# Install dependencies
npm install

# Seed initial database
npm run seed

# Run automated API tests
npm test

# Start the backend server
npm run dev
# Running on http://localhost:5000
```

---

### Step 2: Frontend Setup
In a new terminal window:
```bash
# In the root project directory:
npm install

# Create environment file
cp .env.example .env

# Start frontend development server
npm run dev
# Running on http://localhost:5173
```

---

## 🔑 Demo Credentials

| Role | Email | Password | Access Area |
|---|---|---|---|
| **Admin** | `admin@college.edu` | `admin123` | Full Admin Dashboard (`/admin`) |
| **Student** | `aarav@college.edu` | `student123` | Student Portal (`/app`) |
| **Student** | `sana@college.edu` | `student123` | Student Portal (`/app`) |

*New students can also register via the `/register` page.*

---

## 📡 Backend API Endpoints

| Method | Endpoint | Description | Access |
|---|---|---|---|
| `GET` | `/api/health` | Service health & database status | Public |
| `POST` | `/api/auth/register` | Register new student | Public |
| `POST` | `/api/auth/login` | Login user & issue JWT | Public |
| `POST` | `/api/auth/logout` | Logout & clear session | Public |
| `GET` | `/api/students/me` | Fetch authenticated profile | Protected |
| `PUT` | `/api/students/me` | Update student profile | Protected |
| `GET` | `/api/complaints` | Filter & search complaints | Public / Student |
| `POST` | `/api/complaints` | Submit a new complaint | Protected |
| `PATCH` | `/api/complaints/:id/status` | Update issue status (`In Progress`, etc.) | Admin |
| `GET` | `/api/lost-found` | List lost and found items | Public |
| `POST` | `/api/lost-found` | Report a lost or found item | Protected |
| `GET` | `/api/events` | Browse campus events | Public |
| `POST` | `/api/events/:id/register` | Register student for event | Protected |
| `DELETE` | `/api/events/:id/register` | Cancel event registration | Protected |
| `GET` | `/api/announcements` | List notices (pinned first) | Public |
| `POST` | `/api/announcements` | Publish notice | Admin |
| `GET` | `/api/admin/students` | List all students | Admin |
| `GET` | `/api/admin/stats` | Dashboard statistics & analytics | Admin |

---

## 🚀 How to Push to GitHub

Follow these steps to push this complete fullstack project to your GitHub repository:

### 1. Install Git (if not already installed)
If Git is not installed on your system, install it in PowerShell:
```powershell
winget install --id Git.Git -e --source winget
```
*(Restart your terminal after installation so `git` is added to your PATH).*

### 2. Initialize Git and Commit
From the root `campusconnect` directory:
```bash
# Initialize git repository
git init

# Add all files (properly filtered by .gitignore)
git add .

# Create your initial commit
git commit -m "feat: complete CampusConnect fullstack application with Express backend"
```

### 3. Create a GitHub Repository and Push
1. Open [GitHub](https://github.com/new) and create a new repository (e.g., `campusconnect`).
2. Run the following commands in your terminal:
```bash
# Rename branch to main
git branch -M main

# Link your local repo to GitHub (replace with your repo URL)
git remote add origin https://github.com/<your-username>/campusconnect.git

# Push to GitHub
git push -u origin main
```

---

## 📄 License
MIT License. Built for educational and campus management purposes.
