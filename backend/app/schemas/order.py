from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field


class OrderItemOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    product_id: int | None
    product_name: str
    unit_price: float
    quantity: int


class OrderOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    status: str
    total_amount: float
    full_name: str | None
    email: str | None
    phone: str | None
    address: str | None
    payment_method: str
    payment_status: str
    created_at: datetime
    items: list[OrderItemOut]


class OrderStatusUpdate(BaseModel):
    status: str = Field(
        pattern="^(pending|processing|paid|shipped|delivered|cancelled)$"
    )


class CheckoutRequest(BaseModel):
    full_name: str
    email: str
    phone: str
    address: str
