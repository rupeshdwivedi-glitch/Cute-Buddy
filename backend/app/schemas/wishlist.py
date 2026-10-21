from datetime import datetime

from pydantic import BaseModel, ConfigDict

from app.schemas.product import ProductOut


class WishlistItemAdd(BaseModel):
    product_id: int


class WishlistItemOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    product: ProductOut
    created_at: datetime
