from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.core.db import get_db
from app.models.user import User
from app.schemas.cart import CartItemAdd, CartItemOut, CartItemUpdate
from app.services import cart as cart_service
from app.services.auth import get_current_user

router = APIRouter(prefix="/cart", tags=["cart"])


@router.get("", response_model=list[CartItemOut])
def get_cart(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return cart_service.list_cart(db, current_user.id)


@router.post("/items", response_model=CartItemOut, status_code=status.HTTP_201_CREATED)
def add_to_cart(
    data: CartItemAdd,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return cart_service.add_item(db, current_user.id, data.product_id, data.quantity)


@router.put("/items/{product_id}", response_model=CartItemOut)
def update_cart_item(
    product_id: int,
    data: CartItemUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return cart_service.update_quantity(db, current_user.id, product_id, data.quantity)


@router.delete("/items/{product_id}", status_code=status.HTTP_204_NO_CONTENT)
def remove_cart_item(
    product_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    cart_service.remove_item(db, current_user.id, product_id)


@router.delete("", status_code=status.HTTP_204_NO_CONTENT)
def clear_cart(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    cart_service.clear_cart(db, current_user.id)
