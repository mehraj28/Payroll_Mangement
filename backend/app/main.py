from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

load_dotenv()

from sqlmodel import Session, select
from app.models import User
from app.auth import get_password_hash

from app import database
from app.routes_auth import router as auth_router
from app.routes_admin import router as admin_router
from app.routes_employee import router as employee_router

app = FastAPI(title="Payroll Management API")

@app.get("/")
def home():
    return {"message": "Backend is connected"}


def seed_demo_user():
    with Session(database.engine) as session:
        existing = session.exec(select(User).where(User.email == "hire-me@anshumat.org")).first()
        if existing:
            print("✔ Demo user already exists")
            return
        
        demo = User(
            full_name="Hiring Manager",
            email="hire-me@anshumat.org",
            hashed_password=get_password_hash("HireMe@2025!"),
            role="admin"
        )
        session.add(demo)
        session.commit()
        print("🎉 Demo admin user created successfully!")


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
def on_startup():
    database.init_db()
    seed_demo_user()  # <-- REQUIRED


app.include_router(auth_router)
app.include_router(admin_router)
app.include_router(employee_router)
