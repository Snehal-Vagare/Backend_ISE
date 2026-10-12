# AI Business Analytics — Full Stack Project

A full-stack web application that displays business sales analytics, AI-based forecasting, and insights. It includes login authentication and role-based authorization.

## Tech Stack

| Component | Technology |
|---|---|
| Frontend | React, Vite, React Router, Recharts |
| Backend | Node.js, Express |
| Authentication | JWT and bcrypt password hashing |
| Storage | JSON files |
| AI | Linear regression, z-score anomaly detection, rule-based insights |

## Prerequisites

- Node.js 18 or later
- npm

## How to Run

### 1. Start the Backend

Open a terminal in the project root and run:

```bash
cd backend
npm install
npm start
```

Backend URL: `http://localhost:5000`

### 2. Start the Frontend

Open a second terminal in the project root and run:

```bash
cd frontend
npm install
npm run dev
```

Open the frontend URL shown in the terminal, usually `http://localhost:5173`.

## Demo Accounts

| Role | Email | Password |
|---|---|---|
| Admin | admin@demo.com | admin123 |
| User | user@demo.com | user123 |

These credentials apply only if the demo accounts are configured in your backend. Change demo passwords before deploying the application publicly.

Newly registered accounts receive the user role, if configured that way in the backend.

## Features

- User registration, login, and logout
- Dashboard with KPI cards and sales analytics
- Revenue trends and three-month forecasting
- Profit charts and AI-generated insights
- Admin functionality for managing sales data and viewing users
- Role-based access control for protected routes and APIs

## Project Structure

```text
Backend_ISE/
├── backend/
│   ├── server.js
│   ├── db.js
│   ├── middleware/
│   │   └── auth.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── analytics.js
│   │   └── users.js
│   └── utils/
│       └── ai.js
├── frontend/
│   └── src/
│       ├── main.jsx
│       ├── App.jsx
│       ├── AuthContext.jsx
│       ├── api.js
│       ├── components/
│       └── pages/
├── .gitignore
└── README.md
```

The structure above describes the expected organization; actual files may vary.

## Authentication and Authorization

### Authentication

Authentication verifies a user's identity during login. The backend checks credentials and, when configured, issues a JWT token. Protected requests include the token in the `Authorization` header.

### Authorization

Authorization determines which resources a user can access. For example, an admin may have permission to manage sales data, while a regular user has read-only access.

The backend must enforce these permissions. Frontend route protection alone is not sufficient.

## AI Analytics

### Revenue Forecasting

Linear regression estimates a trend from historical revenue data and projects future revenue.

### Anomaly Detection

Z-score analysis identifies revenue values that differ significantly from the historical average.

### Business Insights

Rule-based logic can summarize revenue growth, trends, profit margins, and high-performing months.

These techniques provide explainable analytics. Forecasts and anomaly flags should be evaluated against real data before being used for business decisions.

## Data Flow

React frontend → API request → Express backend → Authentication and authorization middleware, where required → Business logic and data storage → JSON response → Dashboard and charts.

## API Endpoints

The exact endpoints depend on the backend implementation. Common examples include:

| Method | Example endpoint | Purpose |
|---|---|---|
| POST | `/api/auth/register` | Register a user |
| POST | `/api/auth/login` | Log in |
| GET | `/api/analytics/summary` | Retrieve analytics |
| POST | `/api/analytics/sales` | Add sales data |
| GET | `/api/users` | Retrieve user records |

Verify these routes in the backend before relying on this table.

## Future Improvements

- PostgreSQL or MongoDB integration
- CSV data import
- More advanced forecasting models
- Product and regional analytics
- Improved token management and deployment security

## Project Goal

The application helps businesses understand sales performance, estimate future revenue, detect unusual trends, and make more informed decisions.
