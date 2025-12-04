import os
from io import BytesIO
from reportlab.lib.pagesizes import A4
from reportlab.lib import colors
from reportlab.pdfgen import canvas
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

# Load from environment
SMTP_HOST = os.getenv("SMTP_HOST", "smtp.gmail.com")
SMTP_PORT = int(os.getenv("SMTP_PORT", 587))
SMTP_USER = os.getenv("SMTP_USER")
SMTP_PASS = os.getenv("SMTP_PASS")
FROM_EMAIL = os.getenv("FROM_EMAIL", SMTP_USER)

def generate_salary_pdf(slip, user):
    """
    Generate a professional salary slip PDF with:
    - Logo
    - Company details
    - Salary table
    - HR & Employee signature areas
    """
    buffer = BytesIO()
    c = canvas.Canvas(buffer, pagesize=A4)
    width, height = A4

    # ---------------------------
    # COLORS
    # ---------------------------
    blue = colors.HexColor("#004c97")
    light_blue = colors.HexColor("#e5f0ff")

    # ---------------------------
    # HEADER BACKGROUND
    # ---------------------------
    c.setFillColor(blue)
    c.rect(0, height - 90, width, 90, fill=1, stroke=0)

    # ---------------------------
    # LOGO
    # ---------------------------
    try:
        # logo stored at backend/app/static/logo.png
        base_dir = os.path.dirname(__file__)
        logo_path = os.path.join(base_dir, "static", "logo.png")
        if os.path.exists(logo_path):
            # y position inside header
            c.drawImage(
                logo_path,
                30,
                height - 80,
                width=130,
                preserveAspectRatio=True,
                mask="auto",
            )
    except Exception:
        # if logo fails, just skip
        pass

    # ---------------------------
    # COMPANY NAME & DETAILS
    # ---------------------------
    c.setFillColor(colors.white)
    c.setFont("Helvetica-Bold", 18)
    c.drawRightString(width - 30, height - 40, "Anshumat Solutions")

    c.setFont("Helvetica", 9)
    c.drawRightString(width - 30, height - 58, "+01 (977) 2599 12")
    c.drawRightString(width - 30, height - 70, "contact@anshumat.org")
    c.drawRightString(width - 30, height - 82, "Durgapur, West Bengal 713363, India")

    # ---------------------------
    # TITLE
    # ---------------------------
    c.setFillColor(blue)
    c.setFont("Helvetica-Bold", 20)
    c.drawString(30, height - 120, "Salary Slip")

    # thin line
    c.setStrokeColor(blue)
    c.setLineWidth(1)
    c.line(30, height - 130, width - 30, height - 130)

    # ---------------------------
    # EMPLOYEE INFO
    # ---------------------------
    c.setFont("Helvetica-Bold", 11)
    c.setFillColor(colors.black)
    c.drawString(30, height - 155, "Employee Details")

    c.setFont("Helvetica", 10)
    c.drawString(40, height - 175, f"Name: {user.full_name or user.email}")
    c.drawString(40, height - 190, f"Email: {user.email}")
    c.drawString(40, height - 205, f"Month: {slip.month}")

    # ---------------------------
    # SALARY TABLE
    # ---------------------------
    c.setFont("Helvetica-Bold", 11)
    c.drawString(30, height - 235, "Salary Breakdown")

    table_top = height - 255
    left_x = 30
    right_x = width - 30
    row_height = 24

    rows = [
        ("Basic Salary", slip.basic),
        ("Allowances", slip.allowances),
        ("Deductions", slip.deductions),
        ("Net Pay", slip.net_pay),
    ]

    # table header background
    c.setFillColor(light_blue)
    c.rect(left_x, table_top - row_height, right_x - left_x, row_height, fill=1, stroke=0)
    c.setFillColor(blue)
    c.setFont("Helvetica-Bold", 10)
    c.drawString(left_x + 8, table_top - row_height + 7, "Component")
    c.drawRightString(right_x - 8, table_top - row_height + 7, "Amount (₹)")

    # table rows
    c.setFont("Helvetica", 10)
    y = table_top - row_height * 2
    for label, value in rows:
        if label == "Net Pay":
            c.setFillColor(colors.black)
            c.setFont("Helvetica-Bold", 11)
        else:
            c.setFillColor(colors.black)
            c.setFont("Helvetica", 10)

        c.drawString(left_x + 8, y + 6, label)
        c.drawRightString(right_x - 8, y + 6, f"{value:,.2f}")
        y -= row_height

    # outer border for table
    table_bottom = y + row_height
    c.setStrokeColor(blue)
    c.setLineWidth(0.8)
    c.rect(left_x, table_bottom, right_x - left_x, (table_top - row_height) - table_bottom)

    # ---------------------------
    # NOTES
    # ---------------------------
    notes_y = table_bottom - 40
    c.setFont("Helvetica-Bold", 11)
    c.setFillColor(blue)
    c.drawString(30, notes_y, "Notes:")

    c.setFillColor(colors.black)
    c.setFont("Helvetica", 10)
    notes_text = slip.notes if slip.notes else "-"
    c.drawString(40, notes_y - 18, notes_text)

    # ---------------------------
    # SIGNATURES (HR + EMPLOYEE)
    # ---------------------------
    sig_y = 120

    # HR Signature (left)
    c.setFont("Helvetica", 10)
    c.drawString(40, sig_y + 25, "____________________________")
    c.drawString(40, sig_y + 10, "HR Manager")
    c.drawString(40, sig_y - 5, "Anshumat Solutions")

    # Employee Signature (right)
    c.drawRightString(width - 40, sig_y + 25, "____________________________")
    c.drawRightString(width - 40, sig_y + 10, "Employee Signature")
    c.drawRightString(width - 40, sig_y - 5, user.full_name or user.email)

    # ---------------------------
    # FOOTER
    # ---------------------------
    c.setFillColor(colors.grey)
    c.setFont("Helvetica", 8)
    c.drawString(
        30,
        40,
        "This is a computer-generated document and does not require a physical signature."
    )

    c.showPage()
    c.save()
    buffer.seek(0)
    return buffer


def send_notification_email(to_email: str, subject: str, body: str):
    # For demo: print to console. Replace with real SMTP or external provider later.
    print("---- EMAIL NOTIFICATION ----")
    print(f"To: {to_email}")
    print(f"Subject: {subject}")
    print(body)
    print("---------------------------")
    return True