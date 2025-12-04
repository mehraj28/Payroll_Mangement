from fastapi import APIRouter, Depends, Response
from fastapi.responses import StreamingResponse
from sqlmodel import Session, select
from app import database, auth, crud, schemas, models, utils

router = APIRouter(prefix="/admin", tags=["admin"])


# -------------------------------
# CREATE SALARY SLIP (WITH EMAIL)
# -------------------------------
@router.post("/salary-slip", response_model=schemas.SalarySlipRead)
def create_salary_slip(
    slip_in: schemas.SalarySlipCreate,
    session: Session = Depends(database.get_session),
    admin=Depends(auth.require_admin)
):
    slip = crud.create_salary_slip(session, slip_in)
    employee = session.get(models.User, slip.employee_id)

    utils.send_notification_email(
        employee.email,
        "New Salary Slip Created",
        f"A salary slip for {slip.month} has been created."
    )

    return slip


# -------------------------------
# UPDATE SALARY SLIP
# -------------------------------
@router.put("/salary-slip/{slip_id}", response_model=schemas.SalarySlipRead)
def update_salary_slip(
    slip_id: str,
    slip_in: schemas.SalarySlipCreate,
    session: Session = Depends(database.get_session),
    admin=Depends(auth.require_admin)
):
    updated = crud.update_salary_slip(session, slip_id, slip_in.dict())
    if not updated:
        return Response(status_code=404)
    return updated


# -------------------------------
# LIST ALL PENDING EXPENSES
# -------------------------------
@router.get("/expenses/pending")
def list_pending_expenses(
    session: Session = Depends(database.get_session),
    admin=Depends(auth.require_admin)
):
    return crud.get_all_pending_expenses(session)


# -------------------------------
# APPROVE / REJECT AN EXPENSE
# -------------------------------
@router.post("/expenses/{expense_id}/action")
def approve_reject_expense(
    expense_id: str,
    action: str,
    comment: str | None = None,
    session: Session = Depends(database.get_session),
    admin=Depends(auth.require_admin)
):
    if action not in ("approve", "reject"):
        return {"error": "action must be 'approve' or 'reject'"}

    status = "approved" if action == "approve" else "rejected"

    exp = crud.update_expense_status(session, expense_id, status, admin_comment=comment)
    if not exp:
        return {"error": "not found"}

    user = session.get(models.User, exp.employee_id)

    utils.send_notification_email(
        user.email,
        f"Expense {status}",
        f"Your expense {exp.id} has been {status}. Comment: {comment or ''}"
    )

    return exp


# -------------------------------
# GENERATE SLIP PDF
# -------------------------------
@router.get("/salary-slip/{slip_id}/pdf")
def get_salary_pdf(
    slip_id: str,
    session: Session = Depends(database.get_session),
    admin=Depends(auth.require_admin)
):
    slip = session.get(models.SalarySlip, slip_id)
    if not slip:
        return {"error": "not found"}

    employee = session.get(models.User, slip.employee_id)

    pdf_buffer = utils.generate_salary_pdf(slip, employee)

    return StreamingResponse(
        pdf_buffer,
        media_type="application/pdf",
        headers={"Content-Disposition": f"attachment; filename=salary_{slip.month}.pdf"}
    )


# -------------------------------
# LIST ALL EMPLOYEES
# -------------------------------
@router.get("/employees")
def list_employees(
    session: Session = Depends(database.get_session),
    admin=Depends(auth.require_admin)
):
    return session.exec(select(models.User)).all()
