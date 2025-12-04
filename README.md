# Payroll Management System (Full Stack)

## Overview
This project contains a FastAPI backend and a React + Tailwind frontend for a simple payroll management system.
It implements:
- Signup / Login (JWT)
- Admin: create/update salary slips, view pending expenses
- Employee: submit expenses, view salary slips and expense history
- PDF export for salary slips (ReportLab)
- Simple email notification stub (console)

## Quick Start

### Backend
1. Create virtual env:
   ```bash
   cd backend
   python -m venv .venv
   source .venv/bin/activate   # Windows: .venv\Scripts\activate
   pip install -r requirements.txt
   ```
2. Set env vars in `.env` (SECRET_KEY, DATABASE_URL)
3. Start server:
   ```bash
   uvicorn app.main:app --reload --port 8000
   ```
4. API docs: http://127.0.0.1:8000/docs

### Frontend
1. Install dependencies and run:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```
2. Open the Vite dev URL (usually http://localhost:5173)

## Notes
- This is a starter implementation. For production, switch to PostgreSQL, secure SECRET_KEY, enable CORS restrictions, add email provider, and strengthen validation.