from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.models.cart_item import CartItem
from app.repositories import cart as cart_repo
from app.services.product import get_product_or_404


def list_cart(db: Session, user_id: int) -> list[CartItem]:
    return cart_repo.list_for_user(db, user_id)


def add_item(db: Session, user_id: int, product_id: int, quantity: int) -> CartItem:
    get_product_or_404(db, product_id)  # 404s if the product doesn't exist
    return cart_repo.add_or_increment(db, user_id, product_id, quantity)


def get_item_or_404(db: Session, user_id: int, product_id: int) -> CartItem:
    item = cart_repo.get_item(db, user_id, product_id)
    if item is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Product {product_id} is not in the cart",
        )
    return item


def update_quantity(db: Session, user_id: int, product_id: int, quantity: int) -> CartItem:
    item = get_item_or_404(db, user_id, product_id)
    return cart_repo.set_quantity(db, item, quantity)


def remove_item(db: Session, user_id: int, product_id: int) -> None:
    item = get_item_or_404(db, user_id, product_id)
    cart_repo.remove(db, item)


def clear_cart(db: Session, user_id: int) -> None:
    cart_repo.clear(db, user_id)
