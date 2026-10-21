"""Create an admin user directly in the database.

Usage (from backend/, with the venv activated — PYTHONPATH must include
backend/ so the `app` package resolves):
    PYTHONPATH=. python scripts/create_admin.py <email> <password> [full_name]
    (Windows PowerShell: $env:PYTHONPATH="."; python scripts/create_admin.py ...)
"""

import sys

from app.core.db import SessionLocal
from app.core.security import hash_password
from app.models.user import User
from app.repositories import user as user_repo


def main() -> None:
    if len(sys.argv) < 3:
        print("Usage: python scripts/create_admin.py <email> <password> [full_name]")
        sys.exit(1)

    email, password = sys.argv[1], sys.argv[2]
    full_name = sys.argv[3] if len(sys.argv) > 3 else None

    db = SessionLocal()
    try:
        if user_repo.get_by_email(db, email) is not None:
            print(f"A user with email {email} already exists.")
            sys.exit(1)

        user = User(
            email=email,
            hashed_password=hash_password(password),
            full_name=full_name,
            role="admin",
        )
        db.add(user)
        db.commit()
        db.refresh(user)
        print(f"Admin user created: id={user.id} email={user.email}")
    finally:
        db.close()


if __name__ == "__main__":
    main()
