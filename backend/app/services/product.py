from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.models.product import Product
from app.repositories import product as product_repo
from app.schemas.product import ProductCreate, ProductUpdate


def get_product_or_404(db: Session, product_id: int) -> Product:
    product = product_repo.get(db, product_id)
    if product is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Product {product_id} not found",
        )
    return product


def list_products(db: Session, skip: int = 0, limit: int = 50) -> list[Product]:
    return product_repo.list_all(db, skip=skip, limit=limit)


def create_product(db: Session, data: ProductCreate) -> Product:
    return product_repo.create(db, data)


def update_product(db: Session, product_id: int, data: ProductUpdate) -> Product:
    product = get_product_or_404(db, product_id)
    return product_repo.update(db, product, data)


def delete_product(db: Session, product_id: int) -> None:
    product = get_product_or_404(db, product_id)
    product_repo.delete(db, product)
