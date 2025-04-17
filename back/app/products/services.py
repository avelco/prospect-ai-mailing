from sqlalchemy.orm import Session
from app.products.queries import delete_product, get_products, store_product
from app.schemas import ProductCreate


def store_product_service(db: Session, product: ProductCreate):
    return store_product(db, product)


def get_products_service(db: Session):
    return get_products(db)
    
def delete_product_service(db: Session, product_id: int):
    return delete_product(db, product_id)
    