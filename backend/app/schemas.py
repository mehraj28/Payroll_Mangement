from typing import Optional, List
from pydantic import BaseModel, EmailStr
from datetime import datetime

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"

class TokenPayload(BaseModel):
    sub: Optional[str] = None
    role: Optional[str] = None

class UserCreate(BaseModel):
    email: EmailStr
    password: str
    full_name: Optional[str] = None
    role: Optional[str] = "employee"

class UserRead(BaseModel):
    id: str
    email: EmailStr
    full_name: Optional[str]
    role: str

    class Config:
        orm_mode = True

class SalarySlipCreate(BaseModel):
    employee_id: str
    month: str
    basic: float
    allowances: float = 0.0
    deductions: float = 0.0
    notes: Optional[str] = None

class SalarySlipRead(SalarySlipCreate):
    id: str
    net_pay: float
    created_at: datetime

    class Config:
        orm_mode = True

class ExpenseCreate(BaseModel):
    category: str
    amount: float
    description: Optional[str] = None

class ExpenseRead(ExpenseCreate):
    id: str
    date: datetime
    status: str
    admin_comment: Optional[str]

    class Config:
        orm_mode = True