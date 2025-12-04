from datetime import datetime
from typing import Optional, List
from sqlmodel import SQLModel, Field, Relationship
from uuid import uuid4

def gen_id():
    return str(uuid4())

class User(SQLModel, table=True):
    id: str = Field(default_factory=gen_id, primary_key=True)
    email: str = Field(index=True, nullable=False)
    full_name: Optional[str] = None
    hashed_password: str = Field(nullable=False)
    role: str = Field(default="employee")
    created_at: datetime = Field(default_factory=datetime.utcnow)

    salary_slips: List["SalarySlip"] = Relationship(back_populates="employee")
    expenses: List["Expense"] = Relationship(back_populates="employee")

class SalarySlip(SQLModel, table=True):
    id: str = Field(default_factory=gen_id, primary_key=True)
    employee_id: str = Field(foreign_key="user.id")
    month: str
    basic: float = 0.0
    allowances: float = 0.0
    deductions: float = 0.0
    net_pay: float = 0.0
    notes: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)

    employee: Optional[User] = Relationship(back_populates="salary_slips")

class Expense(SQLModel, table=True):
    id: str = Field(default_factory=gen_id, primary_key=True)
    employee_id: str = Field(foreign_key="user.id")
    date: datetime = Field(default_factory=datetime.utcnow)
    category: str
    amount: float
    description: Optional[str] = None
    status: str = Field(default="pending")
    admin_comment: Optional[str] = None

    employee: Optional[User] = Relationship(back_populates="expenses")