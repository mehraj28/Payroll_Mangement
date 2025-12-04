from sqlmodel import Session, select
from app import models, auth
from datetime import datetime

def create_user(session: Session, user_in):
    stmt = select(models.User).where(models.User.email == user_in.email)
    user = session.exec(stmt).first()
    if user:
        raise ValueError("Email already registered")
    user = models.User(
        email=user_in.email,
        full_name=user_in.full_name,
        hashed_password=auth.get_password_hash(user_in.password),
        role=user_in.role or "employee"
    )
    session.add(user)
    session.commit()
    session.refresh(user)
    return user

def authenticate_user(session: Session, email: str, password: str):
    stmt = select(models.User).where(models.User.email == email)
    user = session.exec(stmt).first()
    if not user:
        return None
    if not auth.verify_password(password, user.hashed_password):
        return None
    return user

def create_salary_slip(session: Session, slip_in):
    net = slip_in.basic + slip_in.allowances - slip_in.deductions
    slip = models.SalarySlip(
        employee_id=slip_in.employee_id,
        month=slip_in.month,
        basic=slip_in.basic,
        allowances=slip_in.allowances,
        deductions=slip_in.deductions,
        net_pay=net,
        notes=slip_in.notes
    )
    session.add(slip)
    session.commit()
    session.refresh(slip)
    return slip

def update_salary_slip(session: Session, slip_id: str, data: dict):
    slip = session.get(models.SalarySlip, slip_id)
    if not slip:
        return None
    for k, v in data.items():
        setattr(slip, k, v)
    slip.net_pay = slip.basic + slip.allowances - slip.deductions
    session.add(slip)
    session.commit()
    session.refresh(slip)
    return slip

def get_salary_slips_for_user(session: Session, user_id: str):
    stmt = select(models.SalarySlip).where(models.SalarySlip.employee_id == user_id).order_by(models.SalarySlip.created_at.desc())
    return session.exec(stmt).all()

def create_expense(session: Session, employee_id: str, exp_in):
    exp = models.Expense(
        employee_id=employee_id,
        category=exp_in.category,
        amount=exp_in.amount,
        description=exp_in.description
    )
    session.add(exp)
    session.commit()
    session.refresh(exp)
    return exp

def get_expenses_for_user(session: Session, user_id: str):
    stmt = select(models.Expense).where(models.Expense.employee_id == user_id).order_by(models.Expense.date.desc())
    return session.exec(stmt).all()

def get_all_pending_expenses(session: Session):
    stmt = select(models.Expense).where(models.Expense.status == "pending").order_by(models.Expense.date.desc())
    return session.exec(stmt).all()

def update_expense_status(session: Session, expense_id: str, status: str, admin_comment: str | None = None):
    exp = session.get(models.Expense, expense_id)
    if not exp:
        return None
    exp.status = status
    if admin_comment:
        exp.admin_comment = admin_comment
    session.add(exp)
    session.commit()
    session.refresh(exp)
    return exp