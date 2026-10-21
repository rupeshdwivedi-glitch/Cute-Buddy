# CuteBuddy Backend

FastAPI backend for the CuteBuddy clothing ecommerce project. Currently a minimal skeleton; SQL Server + SQLAlchemy 2.0 + Alembic integration is planned (see project root `CLAUDE.md` / audit notes for the migration plan).

## Setup

```
python -m venv .venv
.venv\Scripts\activate        # Windows
source .venv/bin/activate     # macOS/Linux

pip install -r requirements.txt
```

## Run

```
fastapi dev main.py
```

Equivalent to `uvicorn main:app --reload`.

## Tests

None yet — pytest is not configured.
