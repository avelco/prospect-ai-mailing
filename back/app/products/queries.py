


from sqlalchemy.orm import Session
from app.models import Product
from app.schemas import ProductCreate


def store_product(db: Session, product: ProductCreate):
    product = Product(**product.model_dump())
    db.add(product)
    db.commit()
    return product
    
def get_products(db: Session):
    return db.query(Product).all()

def delete_product(db: Session, product_id: int):
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        return None
    db.delete(product)
    db.commit()
    return product