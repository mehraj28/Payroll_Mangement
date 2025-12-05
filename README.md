# 📘 Payroll Management System

A full-stack payroll and employee expense management platform built with **FastAPI**, **SQLModel**, **React**, and **TailwindCSS**.  
Supports **Admin & Employee** roles, salary slip management, expense tracking, and PDF export.

---

## 🌐 Live Demo

- **Frontend (Netlify):** https://payrolltask1.netlify.app  
- **Backend (Render):** https://payroll-mangement.onrender.com  
- **API Docs:** https://payroll-mangement.onrender.com/docs  

---

## 🔐 Demo Credentials

A seeded administrator user is automatically created during backend startup.

| Role | Email | Password |
|------|--------|-----------|
| **Admin (Seeded)** | hire-me@anshumat.org | HireMe@2025! |
| **Admin (Test)** | admin@example.com | admin123 |

You may also sign up as Employee or Admin using the frontend.

---

## 📌 Features

### 🔑 Authentication & User Access
- JWT-based Login/Signup  
- Role-based routing (Admin & Employee)  
- `/auth/me` for session persistence  

---

## 🧑‍💼 Admin Features

- Create salary slips  
- Update existing salary slips  
- View all employees  
- View pending employee expenses  
- Approve/Reject employee expenses  
- Export salary slips as PDF  

### **Admin API Endpoints**

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/admin/salary-slip` | Create salary slip |
| PUT | `/admin/salary-slip/{slip_id}` | Update salary slip |
| GET | `/admin/expenses/pending` | List pending expenses |
| POST | `/admin/expenses/{expense_id}/action` | Approve/Reject expense |
| GET | `/admin/salary-slip/{slip_id}/pdf` | Download salary slip PDF |
| GET | `/admin/employees` | List employees |

---

## 👨‍💻 Employee Features

- Submit monthly expenses  
- View salary slips  
- View personal expense history  
- Download salary slip PDF  

### **Employee API Endpoints**

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/employee/salary-slip` | View salary slips |
| POST | `/employee/expense` | Submit expense |
| GET | `/employee/expense` | View expense history |
| GET | `/employee/salary-slip/{slip_id}/pdf` | Download salary slip PDF |

---

## ⭐ Optional Features Implemented

- Data visualization (salary & expense charts)  
- Expense approval workflow  
- PDF export functionality  
- Clean dashboards for both Admin & Employees  

---

## 🏗️ Tech Stack

### **Frontend**
- React (Vite)  
- TailwindCSS  
- React Router  
- Axios  

### **Backend**
- FastAPI  
- SQLModel + SQLite  
- JWT Authentication  
- OAuth2PasswordRequestForm  
- CORS Enabled  

### **Deployment**
- Frontend → **Netlify**  
- Backend → **Render**  
- Database → **SQLite** (auto-generated in backend)

---

## 🔌 API Documentation

FastAPI Swagger UI:  
👉 https://payroll-mangement.onrender.com/docs  

---

## 🚀 Running Locally

### **Backend**
```bash
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload
```

### **Frontend**
```bash
cd frontend
npm install
npm run dev
```
