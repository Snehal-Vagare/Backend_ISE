# AI Business Analytics (Full Stack Project)

A simple full-stack web app that shows business sales analytics with **AI-based forecasting and insights**,
protected by **login (authentication)** and **role-based access (authorization)**.

## Tech Stack
| Part | Technology |
|------|-----------|
| Frontend | React (Vite), React Router, Recharts |
| Backend | Node.js, Express |
| Auth | JWT (JSON Web Token) + bcrypt password hashing |
| Storage | JSON files (no database setup needed) |
| AI | Linear regression + z-score anomaly detection + rule-based insights (plain JavaScript) |

## How to Run (you need Node.js 18+)

**Terminal 1 – Backend**
```
cd backend
npm install
npm start          # runs on http://localhost:5000
```

**Terminal 2 – Frontend**
```
cd frontend
npm install
npm run dev        # runs on http://localhost:5173
```
Open http://localhost:5173

## Demo Accounts
| Role | Email | Password |
|------|-------|----------|
| Admin | admin@demo.com | admin123 |
| User  | user@demo.com  | user123 |

You can also register a new account (always gets the `user` role).

## Features
- Register / Login / Logout
- Dashboard: KPI cards, revenue trend + 3-month AI forecast, profit chart, AI insights
- Admin panel (admin only): add monthly sales data, view all users
- Normal users cannot open `/admin` (frontend) or call admin APIs (backend returns 403)

## Project Structure
```
backend/
  server.js              – starts Express, connects routes
  db.js                  – reads/writes JSON files, seeds demo data
  middleware/auth.js     – authenticate (JWT check) + authorize (role check)
  routes/auth.js         – register, login, me
  routes/analytics.js    – summary (all users), add sales (admin)
  routes/users.js        – list users (admin)
  utils/ai.js            – the AI logic
frontend/src/
  main.jsx, App.jsx      – entry + routes
  AuthContext.jsx        – stores logged-in user, login(), logout()
  api.js                 – fetch helper that adds the JWT token
  components/            – Navbar, ProtectedRoute
  pages/                 – Login, Register, Dashboard, Admin
```

## API Endpoints
| Method | URL | Access |
|--------|-----|--------|
| POST | /api/auth/register | Public |
| POST | /api/auth/login | Public |
| GET | /api/auth/me | Logged in |
| GET | /api/analytics/summary | Logged in |
| POST | /api/analytics/sales | Admin only |
| GET | /api/users | Admin only |

## How to Explain It (key points)

**1. Authentication (who are you?)**
- User logs in with email + password. Passwords are stored hashed with bcrypt, never as plain text.
- On success the server creates a JWT token (valid 2 hours) containing id, name, role.
- The frontend saves the token in localStorage and sends it in the `Authorization: Bearer <token>` header on every request (`api.js`).
- `authenticate` middleware verifies the token; invalid/missing token -> 401.

**2. Authorization (what are you allowed to do?)**
- Each user has a role: `admin` or `user`.
- Backend: `authorize("admin")` middleware returns 403 if the role is wrong. This is the real security.
- Frontend: `ProtectedRoute` redirects to login (not logged in) or dashboard (wrong role), and the Navbar hides the Admin link. This is for user experience only.

**3. The AI part**
- **Forecasting – Linear Regression:** fits a straight line through past monthly revenue (y = slope·x + intercept) and extends it 3 months ahead.
- **Anomaly detection – z-score:** a month whose revenue is more than 1.5 standard deviations from the mean is flagged as unusual.
- **Insights:** rules turn numbers into sentences (growth %, trend direction, profit margin, best month).
- It is explainable AI: no black box and no paid API.

**4. Data flow**
React page -> `api()` adds token -> Express route -> `authenticate` -> `authorize` -> logic (`ai.js`) -> JSON response -> Recharts renders charts.

**5. Business value**
Helps owners see performance, predict revenue, spot unusual months and make decisions faster.

## Possible Future Improvements
Use MongoDB/PostgreSQL, upload CSV data, use advanced ML models or an LLM API, refresh tokens, product/region analytics.
