from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.core.db import get_db
from app.models.user import User
from app.schemas.wishlist import WishlistItemAdd, WishlistItemOut
from app.services import wishlist as wishlist_service
from app.services.auth import get_current_user

router = APIRouter(prefix="/wishlist", tags=["wishlist"])


@router.get("", response_model=list[WishlistItemOut])
def get_wishlist(
    db: Session = Depends(get_db), current_user: User = Depends(get_current_user)
):
    return wishlist_service.list_wishlist(db, current_user.id)


@router.post("/items", response_model=WishlistItemOut, status_code=status.HTTP_201_CREATED)
def add_to_wishlist(
    data: WishlistItemAdd,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return wishlist_service.add_item(db, current_user.id, data.product_id)


@router.delete("/items/{product_id}", status_code=status.HTTP_204_NO_CONTENT)
def remove_from_wishlist(
    product_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    wishlist_service.remove_item(db, current_user.id, product_id)


@router.delete("", status_code=status.HTTP_204_NO_CONTENT)
def clear_wishlist(
    db: Session = Depends(get_db), current_user: User = Depends(get_current_user)
):
    wishlist_service.clear_wishlist(db, current_user.id)
