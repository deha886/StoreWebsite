from fastapi import FastAPI, HTTPException, Depends
from sqlalchemy import create_engine, Column, Integer, String, Float, Boolean, Text
from sqlalchemy.orm import sessionmaker, declarative_base, Session
from pydantic import BaseModel
import enum

# Define an Enum for User Roles (Optional, not changed)
class UserRole(enum.Enum):
    customer = "customer"
    sales_manager = "sales_manager"
    product_manager = "product_manager"

# Database URL
DATABASE_URL = "mysql+mysqlconnector://root:yaxx@localhost/store"

# SQLAlchemy setup
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# Define FastAPI app
app = FastAPI()

# Define a Product model for the database with updated column names
class Product(Base):
    __tablename__ = "Products"
    
    product_id = Column(Integer, primary_key=True, index=True)
    firm = Column(String(100), nullable=False)  # Changed from 'name'
    year = Column(String(50))  # New column for 'year'
    model = Column(String(50))  # Same column name as before
    category = Column(String(100))  # New column for 'category'
    stock_q = Column(Integer, default=0)  # Changed from 'quantity_in_stock'
    price = Column(Float, nullable=False)  # Same column name as before
    warranty_status = Column(Boolean, default=False)
    distributor_info = Column(String(100))  # Same column name as before

# Create tables in the database with the updated column names
Base.metadata.create_all(bind=engine)

# Pydantic model for the Product (response model)
class ProductBase(BaseModel):
    firm: str
    year: str | None = None
    model: str | None = None
    category: str | None = None
    stock_q: int
    price: float
    warranty_status: bool | None = None
    distributor_info: str | None = None

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

# GET method to retrieve a product by ID
@app.get("/products/{product_id}", response_model=ProductBase)
def get_product(product_id: int, db: Session = Depends(get_db)):
    product = db.query(Product).filter(Product.product_id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    return product

# POST method to create a new product
@app.post("/products/", response_model=ProductBase)
def create_product(product: ProductBase, db: Session = Depends(get_db)):
    db_product = Product(
        firm=product.firm,
        year=product.year,
        model=product.model,
        category=product.category,
        stock_q=product.stock_q,
        price=product.price,
        warranty_status=product.warranty_status,
        distributor_info=product.distributor_info
    )
    db.add(db_product)
    db.commit()
    db.refresh(db_product)
    return db_product
