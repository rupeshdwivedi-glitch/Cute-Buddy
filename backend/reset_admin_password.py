from app.core.db import SessionLocal
from app.core.security import hash_password
from app.repositories import user as user_repo

EMAIL = "admin@test.com"
NEW_PASSWORD = "Admin@1234"

db = SessionLocal()

try:
    user = user_repo.get_by_email(db, EMAIL)

    if user is None:
        print("Admin user was not found.")
    else:
        if hasattr(user, "hashed_password"):
            user.hashed_password = hash_password(NEW_PASSWORD)
        elif hasattr(user, "password_hash"):
            user.password_hash = hash_password(NEW_PASSWORD)
        else:
            print("Could not find the password field on the user model.")
            raise SystemExit(1)

        db.commit()
        print("Password reset successfully.")
finally:
    db.close()
