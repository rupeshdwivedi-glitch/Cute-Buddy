from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.cart_item import CartItem


def list_for_user(db: Session, user_id: int) -> list[CartItem]:
    stmt = select(CartItem).where(CartItem.user_id == user_id).order_by(CartItem.id)
    return list(db.scalars(stmt))


def get_item(db: Session, user_id: int, product_id: int) -> CartItem | None:
    stmt = select(CartItem).where(
        CartItem.user_id == user_id, CartItem.product_id == product_id
    )
    return db.scalar(stmt)


def add_or_increment(db: Session, user_id: int, product_id: int, quantity: int) -> CartItem:
    item = get_item(db, user_id, product_id)
    if item is not None:
        item.quantity += quantity
    else:
        item = CartItem(user_id=user_id, product_id=product_id, quantity=quantity)
        db.add(item)
    db.commit()
    db.refresh(item)
    return item


def set_quantity(db: Session, item: CartItem, quantity: int) -> CartItem:
    item.quantity = quantity
    db.commit()
    db.refresh(item)
    return item


def remove(db: Session, item: CartItem) -> None:
    db.delete(item)
    db.commit()


def clear(db: Session, user_id: int) -> None:
    for item in list_for_user(db, user_id):
        db.delete(item)
    db.commit()
