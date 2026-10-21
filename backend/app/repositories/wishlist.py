from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.wishlist_item import WishlistItem


def list_for_user(db: Session, user_id: int) -> list[WishlistItem]:
    stmt = (
        select(WishlistItem)
        .where(WishlistItem.user_id == user_id)
        .order_by(WishlistItem.id)
    )
    return list(db.scalars(stmt))


def get_item(db: Session, user_id: int, product_id: int) -> WishlistItem | None:
    stmt = select(WishlistItem).where(
        WishlistItem.user_id == user_id, WishlistItem.product_id == product_id
    )
    return db.scalar(stmt)


def add(db: Session, user_id: int, product_id: int) -> WishlistItem:
    item = get_item(db, user_id, product_id)
    if item is not None:
        return item
    item = WishlistItem(user_id=user_id, product_id=product_id)
    db.add(item)
    db.commit()
    db.refresh(item)
    return item


def remove(db: Session, item: WishlistItem) -> None:
    db.delete(item)
    db.commit()


def clear(db: Session, user_id: int) -> None:
    for item in list_for_user(db, user_id):
        db.delete(item)
    db.commit()
