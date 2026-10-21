from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.models.order import Order, OrderItem
from app.models.user import User
from app.repositories import cart as cart_repo
from app.repositories import order as order_repo
from app.schemas.order import CheckoutRequest


def checkout(db: Session, user: User, data: CheckoutRequest) -> Order:
    cart_items = cart_repo.list_for_user(db, user.id)
    if not cart_items:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cart is empty",
        )

    order_items = [
        OrderItem(
            product_id=cart_item.product.id,
            product_name=cart_item.product.name,
            unit_price=cart_item.product.price,
            quantity=cart_item.quantity,
        )
        for cart_item in cart_items
    ]
    total_amount = sum(item.unit_price * item.quantity for item in order_items)

    # No real payment gateway is integrated yet, so every checkout is
    # recorded as an already-paid "demo" payment. Swap payment_method/
    # payment_status here for a real gateway result once one is wired up.
    order = order_repo.create(
        db,
        user.id,
        order_items,
        total_amount,
        status="processing",
        full_name=data.full_name,
        email=data.email,
        phone=data.phone,
        address=data.address,
        payment_method="demo",
        payment_status="paid",
    )
    cart_repo.clear(db, user.id)
    return order


def get_order_or_404(db: Session, order_id: int, user: User) -> Order:
    order = order_repo.get(db, order_id)
    if order is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Order {order_id} not found",
        )
    if order.user_id != user.id and user.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You do not have access to this order",
        )
    return order


def list_my_orders(db: Session, user_id: int) -> list[Order]:
    return order_repo.list_for_user(db, user_id)


def list_all_orders(db: Session, skip: int = 0, limit: int = 50) -> list[Order]:
    return order_repo.list_all(db, skip=skip, limit=limit)


def update_order_status(db: Session, order_id: int, status_value: str) -> Order:
    order = order_repo.get(db, order_id)
    if order is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Order {order_id} not found",
        )
    return order_repo.update_status(db, order, status_value)
