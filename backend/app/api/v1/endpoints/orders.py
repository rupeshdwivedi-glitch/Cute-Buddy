from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.db import get_db
from app.models.user import User
from app.schemas.order import CheckoutRequest, OrderOut, OrderStatusUpdate
from app.services import order as order_service
from app.services.auth import get_current_user, require_admin

router = APIRouter(prefix="/orders", tags=["orders"])


@router.post("/checkout", response_model=OrderOut, status_code=201)
def checkout(
    data: CheckoutRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return order_service.checkout(db, current_user, data)


@router.get("", response_model=list[OrderOut])
def list_my_orders(
    db: Session = Depends(get_db), current_user: User = Depends(get_current_user)
):
    return order_service.list_my_orders(db, current_user.id)


@router.get(
    "/admin/all",
    response_model=list[OrderOut],
    dependencies=[Depends(require_admin)],
)
def list_all_orders(skip: int = 0, limit: int = 50, db: Session = Depends(get_db)):
    return order_service.list_all_orders(db, skip=skip, limit=limit)


@router.get("/{order_id}", response_model=OrderOut)
def get_order(
    order_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return order_service.get_order_or_404(db, order_id, current_user)


@router.patch(
    "/{order_id}/status",
    response_model=OrderOut,
    dependencies=[Depends(require_admin)],
)
def update_order_status(
    order_id: int, data: OrderStatusUpdate, db: Session = Depends(get_db)
):
    return order_service.update_order_status(db, order_id, data.status)
