from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import create_engine, MetaData, Table
from sqlalchemy.orm import sessionmaker, declarative_base, Session
from sqlalchemy.exc import NoResultFound
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

# Add CORS middleware to allow frontend connections
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://127.0.0.1:3000", "http://localhost:3000"],  # Add frontend origins
    allow_credentials=True,
    allow_methods=["*"],  # Allow all HTTP methods
    allow_headers=["*"],  # Allow all headers
)

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
    return {"message": "Hello, FastAPI and MySQL are connected with CORS enabled!"}

# CRUD Endpoints

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

# PUT method to update stock
@app.put("/products/{objectId}/update_stock", response_model=ProductBase)
def update_stock(objectId: str, stock: int, db: Session = Depends(get_db)):
    product = db.query(Product).filter(Product.objectId == objectId).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    product.Stock = stock
    db.commit()
    db.refresh(product)
    return product

# PUT method to update price
@app.put("/products/{objectId}/update_price", response_model=ProductBase)
def update_price(objectId: str, price: float, db: Session = Depends(get_db)):
    product = db.query(Product).filter(Product.objectId == objectId).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    product.Prices = price
    db.commit()
    db.refresh(product)
    return product

# PUT method to update product details
@app.put("/products/{objectId}/update", response_model=ProductBase)
def update_product(objectId: str, product_data: ProductBase, db: Session = Depends(get_db)):
    product = db.query(Product).filter(Product.objectId == objectId).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    product.Make = product_data.Make
    product.Year = product_data.Year
    product.Model = product_data.Model
    product.Category = product_data.Category
    product.Prices = product_data.Prices
    product.Stock = product_data.Stock
    db.commit()
    db.refresh(product)
    return product

# DELETE method to delete a product
@app.delete("/products/{objectId}", response_model=dict)
def delete_product(objectId: str, db: Session = Depends(get_db)):
    product = db.query(Product).filter(Product.objectId == objectId).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    db.delete(product)
    db.commit()
    return {"message": f"Product with objectId {objectId} has been deleted"}

# GET method to retrieve all makes (distinct Makes)
@app.get("/makes/")
def get_makes(db: Session = Depends(get_db)):
    makes = db.query(Product.Make).distinct().all()
    return {"makes": [make[0] for make in makes]}

# GET method to retrieve products for a specific make
@app.get("/makes/{make}/products", response_model=list[ProductBase])
def get_products_by_make(make: str, db: Session = Depends(get_db)):
    products = db.query(Product).filter(Product.Make == make).all()
    if not products:
        raise HTTPException(status_code=404, detail=f"No products found for make {make}")
    return products

import uvicorn

if __name__ == "__main__":
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)
