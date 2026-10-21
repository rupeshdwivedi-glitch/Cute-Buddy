from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.models.wishlist_item import WishlistItem
from app.repositories import wishlist as wishlist_repo
from app.services.product import get_product_or_404


def list_wishlist(db: Session, user_id: int) -> list[WishlistItem]:
    return wishlist_repo.list_for_user(db, user_id)


def add_item(db: Session, user_id: int, product_id: int) -> WishlistItem:
    get_product_or_404(db, product_id)  # 404s if the product doesn't exist
    return wishlist_repo.add(db, user_id, product_id)


def remove_item(db: Session, user_id: int, product_id: int) -> None:
    item = wishlist_repo.get_item(db, user_id, product_id)
    if item is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Product {product_id} is not in the wishlist",
        )
    wishlist_repo.remove(db, item)


def clear_wishlist(db: Session, user_id: int) -> None:
    wishlist_repo.clear(db, user_id)
