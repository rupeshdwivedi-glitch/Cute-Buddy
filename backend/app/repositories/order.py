from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.order import Order, OrderItem


def create(
    db: Session,
    user_id: int,
    items: list[OrderItem],
    total_amount: float,
    *,
    status: str,
    full_name: str,
    email: str,
    phone: str,
    address: str,
    payment_method: str,
    payment_status: str,
) -> Order:
    order = Order(
        user_id=user_id,
        total_amount=total_amount,
        items=items,
        status=status,
        full_name=full_name,
        email=email,
        phone=phone,
        address=address,
        payment_method=payment_method,
        payment_status=payment_status,
    )
    db.add(order)
    db.commit()
    db.refresh(order)
    return order


def get(db: Session, order_id: int) -> Order | None:
    return db.get(Order, order_id)


def list_for_user(db: Session, user_id: int) -> list[Order]:
    stmt = select(Order).where(Order.user_id == user_id).order_by(Order.id.desc())
    # .unique() is required here because Order.items is a joined-eager-loaded
    # collection — without it SQLAlchemy raises InvalidRequestError on the
    # duplicate parent rows produced by the join.
    return list(db.scalars(stmt).unique())


def list_all(db: Session, skip: int = 0, limit: int = 50) -> list[Order]:
    stmt = select(Order).order_by(Order.id.desc()).offset(skip).limit(limit)
    return list(db.scalars(stmt).unique())


def update_status(db: Session, order: Order, status: str) -> Order:
    order.status = status
    db.commit()
    db.refresh(order)
    return order
