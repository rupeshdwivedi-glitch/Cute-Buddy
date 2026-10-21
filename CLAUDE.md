# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository layout

This repo contains two projects that are now wired together:

- `backend/` — a FastAPI + SQLAlchemy 2.0 + Alembic REST API backed by Microsoft SQL Server (layered architecture, see below). Resources so far: `Product`, `User`/auth (customer/admin roles), `Cart`, `Order` (demo/no-gateway checkout), `Wishlist`.
- `frontend/` — a Create React App + TypeScript e-commerce storefront ("CuteBuddy"), with its own `frontend/CLAUDE.md`. **That file still describes the original Sanity-CMS-based architecture and is now partly stale** — the product catalog, cart persistence, wishlist persistence, auth, and checkout described there have all been replaced by calls to this repo's FastAPI backend (see the Frontend section below for what's current). Its notes on styling conventions, the Context+reducer pattern for cart/filters, and react-router v5 usage are still accurate.
  - `frontend/cutebuddy/` is a separate nested Sanity Studio project, now unused by the storefront (products come from the FastAPI backend instead) but left in place.

**Product data now comes from the FastAPI backend** (`GET /products`), not Sanity — `frontend/src/context/products_context.tsx` calls the backend directly. Age/height "bucket" filtering was dropped when this happened (the backend `Product` model doesn't have those fields); only category/search/price filtering remains. Checkout no longer uses Stripe — see "Checkout (demo, no payment gateway)" below.

## Backend (`backend/`)

### Commands

```
pip install -r requirements.txt                      # install dependencies
uvicorn app.main:app --reload --reload-dir app        # run dev server (preferred — see note below)
fastapi dev app/main.py                               # alternative dev server command
```

- Entry point is `app/main.py`, **not** a root-level `main.py` (an earlier skeleton version had `main.py` directly under `backend/`; it was moved into the `app/` package and removed).
- **Always activate the venv first**: `backend\.venv\Scripts\activate` (Windows) before running any of the above, or call the venv's binaries directly (`./.venv/Scripts/uvicorn.exe`, `./.venv/Scripts/alembic.exe`, etc.) from `backend/`.
- Prefer `--reload-dir app` over plain `--reload` / `fastapi dev`: without it, the reloader also watches `.venv/`, which floods logs with spurious reload events on every dependency install.
- No automated tests exist yet (`tests/` is an empty scaffold); no lint config or CI.

### Database (SQL Server + SQLAlchemy 2.0 + Alembic)

- Connection string lives in `backend/.env` as `DATABASE_URL` (gitignored — never commit it). Format: `mssql+pyodbc://<user>:<url-encoded-password>@<server>/<database>?driver=ODBC+Driver+17+for+SQL+Server&TrustServerCertificate=yes`.
- Requires the **Microsoft ODBC Driver 17 or 18 for SQL Server** installed at the OS level (not a pip package) — check via `odbcad32.exe` → Drivers tab if connections fail.
- Migrations: `alembic revision --autogenerate -m "..."` then `alembic upgrade head`, run from `backend/`.
- **Known gotcha**: SQL Server auto-creates a `sysdiagrams` table when SSMS's "Database Diagrams" feature is used. Alembic's autogenerate doesn't know about it and will try to `DROP TABLE sysdiagrams` on the next migration. `alembic/env.py` has an `include_object` filter (`IGNORED_TABLES`) that excludes it — don't remove that filter, and don't let autogenerate drop tables that aren't deliberate.
- **Known gotcha**: SQL Server requires an `ORDER BY` whenever a query uses `OFFSET`/`LIMIT` (pagination) — SQLAlchemy raises `CompileError: MSSQL requires an order_by...` otherwise. Every paginated `list_all`-style repository query must include `.order_by(...)`.
- **Known gotcha**: a model with a `relationship(lazy="joined")` to a **collection** (e.g. `Order.items`) produces duplicate parent rows at the SQL level; any `select()` query against that model must call `.unique()` on the result before iterating (`db.scalars(stmt).unique()`), or SQLAlchemy raises `InvalidRequestError: The unique() method must be invoked...`. See `app/repositories/order.py`.
- `app/core/db.py` defines the SQLAlchemy `engine`, `SessionLocal`, declarative `Base`, and the `get_db` FastAPI dependency.

### Auth

- JWT-based auth lives in `app/core/security.py` (bcrypt password hashing + JWT encode/decode) and `app/services/auth.py` (signup/login/`get_current_user` dependency).
- **Do not reintroduce `passlib`** for password hashing — `passlib`'s bcrypt backend is incompatible with `bcrypt>=4.1` (it crashes with `ValueError: password cannot be longer than 72 bytes` / `AttributeError: module 'bcrypt' has no attribute '__about__'`). Hash/verify directly against the `bcrypt` package instead (see `app/core/security.py`).
- `JWT_SECRET_KEY`, `JWT_ALGORITHM`, `JWT_ACCESS_TOKEN_EXPIRE_MINUTES` are read from `.env` via `app/core/config.py`'s `Settings`. Never hardcode the secret in code.
- Protected endpoints depend on `app.services.auth.get_current_user`, which validates the bearer token and loads the `User` from the DB.
- `User.role` is `"customer"` (default) or `"admin"`. Public `/auth/signup` **always** creates `"customer"` — `UserCreate` deliberately has no `role` field, so nobody can self-escalate to admin via the API.
- Admin-only endpoints are protected with `dependencies=[Depends(require_admin)]` on the route (see `app/api/v1/endpoints/products.py`'s create/update/delete). Read endpoints (list/get) stay open to any authenticated-or-not caller unless a resource specifically needs otherwise.
- The first admin user must be created out-of-band via `scripts/create_admin.py` (not through any API endpoint): `PYTHONPATH=. python scripts/create_admin.py <email> <password> [full_name]`.

### Architecture — layered, per-resource

Each resource (`Product`, `User`/auth so far) follows the same five-layer pattern; use it as the template for new resources:

```
app/models/<resource>.py        SQLAlchemy ORM model (table definition)
app/schemas/<resource>.py       Pydantic request/response schemas (Create/Update/Out)
app/repositories/<resource>.py  Raw DB queries (no business logic)
app/services/<resource>.py      Business logic, not-found handling, orchestration
app/api/v1/endpoints/<resource>.py  FastAPI router (thin — delegates to services)
```

- New models must be imported in `app/models/__init__.py` so Alembic's autogenerate (via `Base.metadata`) picks them up.
- New routers must be registered in `app/api/v1/api.py`.
- `app/utils/` exists as scaffolding but is currently empty.
- `scripts/` holds one-off/maintenance scripts, e.g. `create_admin.py`. Run these with `PYTHONPATH=.` set (from `backend/`) so the `app` package resolves — they're not inside the `app` package themselves.
- CORS is configured in `app/middleware/cors.py`, wired into `app/main.py` via `setup_cors(app)`. Allowed origins come from `CORS_ORIGINS` in `.env` (comma-separated), default `http://localhost:3000` (CRA's dev server port).

### Checkout (demo, no payment gateway)

- `POST /orders/checkout` requires a JSON body (`CheckoutRequest`: `full_name`, `email`, `phone`, `address`) — it is **not** a no-arg call. It builds the order from the caller's current backend cart, computes the total server-side, and clears the cart.
- No real payment gateway (Stripe/Razorpay/etc) is wired up. Every order is created with `payment_method="demo"`, `payment_status="paid"`, and an initial `status="processing"` — these are hardcoded in `app/services/order.py`'s `checkout()`. Swapping in a real gateway later means changing only that function (set `payment_status` based on the gateway's actual result) — nothing else in the order flow needs to change.
- `Order` also stores the shipping/contact snapshot (`full_name`, `email`, `phone`, `address`) captured at checkout time, separate from the `User` account.

## Frontend (`frontend/`)

```
npm install          # install dependencies
npm start            # dev server (react-scripts)
npm run build         # production build
npm test              # Jest + RTL, watch mode
npx tsc --noEmit      # typecheck without running the dev server/build
```

- Run a single test file: `npm test -- src/path/to/File.test.tsx`
- No separate lint script; ESLint runs via `react-scripts` (`react-app`/`react-app/jest` config in `package.json`).
- `frontend/.env` sets `REACT_APP_API_BASE_URL` (default `http://127.0.0.1:8000`) — the backend must be running for almost anything in the app to work (products, auth, cart, wishlist, orders all hit it).
- The old Netlify serverless function (`frontend/functions/create-payment-intent.ts`, Stripe PaymentIntent creation) and the Stripe UI components (`StripeCheckout.tsx`, `CheckoutForm.tsx`, `BillingDetailsFields.tsx`) are **no longer wired into any route** — checkout is the demo flow described below. They're left in place, unused, in case a real payment gateway is integrated later.
- See `frontend/CLAUDE.md` for things that are still accurate: styling conventions (styled-components + CSS custom properties in `index.css`, no theme object), the Context+reducer pattern (`cart_context.tsx`), react-router v5 usage, and barrel-export conventions (`pages/index.ts`, `components/index.ts`).

### API integration layer

- `src/utils/apiClient.ts` — the one axios instance everything uses (`baseURL` from `REACT_APP_API_BASE_URL`). A request interceptor attaches `Authorization: Bearer <token>` from `localStorage` (`cutebuddy_token`) automatically; a response interceptor clears the token on `401`. Use `getApiErrorMessage(error)` to extract a backend error's `detail` for display.
- `src/store/authSlice.ts` — Redux Toolkit slice for auth (`login`, `signup`, `fetchCurrentUser` thunks, `logout`/`clearAuthError` actions). Token persisted to `localStorage`; rehydrated on app load via `fetchCurrentUser()` in `App.tsx`.
- `src/hooks/useWishlistActions.ts` — wraps the existing local `wishlistSlice` (unchanged, still used as-is for guests) with backend sync for logged-in users (`toggle`/`remove`/`clear`/`syncFromBackend`). Use this hook instead of dispatching `wishlistSlice` actions directly anywhere a user-facing wishlist action happens.
- **Cart stays client-side-only** (`cart_context.tsx`/`cart_reducer.tsx`, untouched) until checkout — the backend cart (`/cart/items`) is populated right before calling `/orders/checkout` in `CheckoutPage.tsx`, not on every add/remove. This was a deliberate scope call to avoid rewriting the whole cart UI component tree; if that changes, every cart mutation (`CartItem.tsx`, `AmountButtons.tsx`, `CartContent.tsx`) would need to start calling the backend directly instead.
- `productDataType` (`src/utils/productData.ts`) was trimmed to match the backend's `Product` shape (dropped `forWhom`/`age`/`height`/`clothingCategories`/`featured`; kept `categories`/`itemDescription`/`images` field *names* even though they now map 1:1 from the backend's `category`/`description`/`image_url` — this was a deliberate minimal-diff choice so `CategoryFilters.tsx`, `ListView.tsx`, `SingleProductContent.tsx` etc. needed no changes). `images` is always a 1-element array (or a placeholder `PLACEHOLDER_IMAGE` from `utils/constants.tsx`) since the backend only has one `image_url` per product, not a gallery.
- Product `slug` is `String(product.id)` (the backend has no slug field) — routes/components that reference `slug` still work unchanged, they're just keyed by id now.

### Checkout / Orders flow (demo, no payment gateway)

- `CheckoutPage.tsx` requires login, then renders `components/Checkout/CheckoutDetailsForm.tsx` (name/email/phone/address, client-side validated) + `components/Checkout/OrderSummary.tsx` (reads the local cart). On submit: pushes the local cart to the backend cart, calls `POST /orders/checkout`, clears the local cart, and navigates to `/order-success` with the created order in router state.
- `OrderSuccessPage.tsx` reads the order from `location.state` (react-router v5) — if opened directly (e.g. a refresh) with no state, it shows a fallback pointing to `/orders` instead of crashing.
- `/orders` (`OrdersPage.tsx` + `components/Orders/OrdersList.tsx`/`OrderCard.tsx`) and `/orders/:id` (`OrderDetailPage.tsx`, reuses `OrderCard` with `detailed`) both require login and call the real `GET /orders` / `GET /orders/{id}` endpoints — no mock data.
- Every order from this flow is a backend "demo" payment (see the backend section above) — the UI labels this explicitly (`CheckoutDetailsForm`'s demo-note banner, the "demo" tag on `OrderCard`'s detailed view, `OrderSuccessPage`'s demo-note).

## Sanity Studio (`frontend/cutebuddy/`)

Separate project with its own `package.json`/`yarn.lock`. **No longer consumed by the storefront** (products now come from the FastAPI backend) — kept in the repo but orphaned unless someone decides to reconnect it.
