from fastapi import APIRouter, Depends
from sqlmodel import Session
from typing import List
from app import database, auth, crud, schemas, utils
from app import models


router = APIRouter(prefix="/employee", tags=["employee"])

@router.get("/salary-slip", response_model=List[schemas.SalarySlipRead])
def view_salary_slips(session: Session = Depends(database.get_session), user = Depends(auth.get_current_user)):
    slips = crud.get_salary_slips_for_user(session, user.id)
    return slips

@router.post("/expense", response_model=schemas.ExpenseRead)
def submit_expense(exp_in: schemas.ExpenseCreate, session: Session = Depends(database.get_session), user = Depends(auth.get_current_user)):
    exp = crud.create_expense(session, user.id, exp_in)
    utils.send_notification_email("admin@example.com", "New Expense Submitted", f"{user.email} submitted expense {exp.id} of ₹{exp.amount:.2f}")
    return exp

@router.get("/expense", response_model=List[schemas.ExpenseRead])
def view_expenses(session: Session = Depends(database.get_session), user = Depends(auth.get_current_user)):
    return crud.get_expenses_for_user(session, user.id)

@router.get("/salary-slip/{slip_id}/pdf")
def download_salary_pdf(slip_id: str, session: Session = Depends(database.get_session), user = Depends(auth.get_current_user)):
    slip = session.get(models.SalarySlip, slip_id)
    if not slip or slip.employee_id != user.id:
        return {"error": "not found or unauthorized"}
    pdf_buffer = utils.generate_salary_pdf(slip, user)
    from fastapi.responses import StreamingResponse
    return StreamingResponse(pdf_buffer, media_type="application/pdf", headers={"Content-Disposition": f"attachment; filename=salary_{slip.month}.pdf"})