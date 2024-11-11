from fastapi import FastAPI, HTTPException, Depends
from sqlalchemy import create_engine, MetaData, Table
from sqlalchemy.orm import sessionmaker, declarative_base, Session
from pydantic import BaseModel

# Database URL
DATABASE_URL = "mysql+mysqlconnector://root:yaxx@localhost/store"

# SQLAlchemy setup
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# Reflect the existing products table from the database
metadata = MetaData()
products_table = Table('Products', metadata, autoload_with=engine)

# Define FastAPI app
app = FastAPI()

# Reflect Product model based on the existing table
class Product(Base):
    __table__ = products_table

# Pydantic model for Product (response model)
class ProductBase(BaseModel):
    objectId: str
    Make: str
    Year: int | None = None
    Model: str | None = None
    Category: str | None = None
    Prices: float
    Stock: int

    class Config:
        orm_mode = True

# Dependency to get a database session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Sample route to test the setup
@app.get("/")
async def root():
    return {"message": "Hello, FastAPI and MySQL are connected!"}

# GET method to retrieve all products
@app.get("/products/", response_model=list[ProductBase])
def get_products(db: Session = Depends(get_db)):
    products = db.query(Product).all()
    return products

# GET method to retrieve a product by objectId
@app.get("/products/{objectId}", response_model=ProductBase)
def get_product(objectId: str, db: Session = Depends(get_db)):
    product = db.query(Product).filter(Product.objectId == objectId).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    return product

# POST method to create a new product
@app.post("/products/", response_model=ProductBase)
def create_product(product: ProductBase, db: Session = Depends(get_db)):
    db_product = Product(
        objectId=product.objectId,
        Make=product.Make,
        Year=product.Year,
        Model=product.Model,
        Category=product.Category,
        Prices=product.Prices,
        Stock=product.Stock
    )
    db.add(db_product)
    db.commit()
    db.refresh(db_product)
    return db_product

import uvicorn

if __name__ == "__main__":
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)
