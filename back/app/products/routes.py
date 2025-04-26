from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.products.services import delete_product_service, get_products_service, store_product_service
from app.schemas import ProductCreate
from ..dependencies import get_db

products = APIRouter()

@products.post("")
async def store_product(product: ProductCreate, db: Session = Depends(get_db)):
    return store_product_service(db, product)

@products.get("")
async def get_products(db: Session = Depends(get_db)):
    return get_products_service(db)

@products.delete("/{product_id}")
async def delete_product(product_id: int, db: Session = Depends(get_db)):
    return delete_product_service(db, product_id)
