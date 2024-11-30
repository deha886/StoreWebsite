from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import firebase_admin
from firebase_admin import credentials, firestore

# Firebase setup
if not firebase_admin._apps:
    cred = credentials.Certificate("C:/Users/Windows 10/Desktop/cs308/firestore/cs308-storewebsite-firebase-adminsdk-aswhm-5546b8efa9.json")
    firebase_admin.initialize_app(cred)

db = firestore.client()

# Define FastAPI app
app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://127.0.0.1:3000", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Pydantic models
class ProductBase(BaseModel):
    objectId: int
    Make: str
    Year: int
    Model: str
    Category: str
    Prices: float
    Stock: int
    Photo: str

    class Config:
        from_attributes = True

class Category(BaseModel):
    name: str

# Endpoints
@app.get("/")
async def root():
    return {"message": "Hello, FastAPI and Firestore are connected with CORS enabled!"}

# 1. Get all products
@app.get("/products/", response_model=list[ProductBase])
def get_products():
    try:
        products_ref = db.collection("products")
        docs = products_ref.stream()
        products = []

        for doc in docs:
            product = doc.to_dict()
            if all(key in product for key in ["objectId", "Make", "Year", "Model", "Category", "Prices", "Stock", "Photo"]):
                products.append(product)
            else:
                print(f"Skipping invalid document: {doc.id}")

        return products
    except Exception as e:
        print(f"Error fetching products: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal Server Error")

# 2. Get a product by objectId
@app.get("/products/{objectId}", response_model=ProductBase)
def get_product(objectId: str):
    product_ref = db.collection("products").document(f"product{objectId}")
    product = product_ref.get()
    if not product.exists:
        raise HTTPException(status_code=404, detail="Product not found")
    return product.to_dict()

# 3. Get distinct makes
@app.get("/makes/")
def get_makes():
    products_ref = db.collection("products")
    docs = products_ref.stream()
    makes = set(doc.to_dict().get("Make") for doc in docs if "Make" in doc.to_dict())
    return {"makes": list(makes)}

# 4. Get products by make
@app.get("/makes/{make}/products", response_model=list[ProductBase])
def get_products_by_make(make: str):
    products_ref = db.collection("products").where("Make", "==", make)
    docs = products_ref.stream()
    products = [doc.to_dict() for doc in docs]
    if not products:
        raise HTTPException(status_code=404, detail=f"No products found for make {make}")
    return products

# 5. Create a new product
@app.post("/products/", response_model=ProductBase)
def create_product(product: ProductBase):
    product_ref = db.collection("products").document(f"product{product.objectId}")
    product_ref.set(product.dict())
    return product.dict()

# 6. Delete a product
@app.delete("/products/{objectId}")
def delete_product(objectId: str):
    product_ref = db.collection("products").document(f"product{objectId}")
    product = product_ref.get()
    if not product.exists:
        raise HTTPException(status_code=404, detail="Product not found")
    product_ref.delete()
    return {"message": f"Product {objectId} deleted successfully"}

# 7. Update stock for a product
@app.put("/products/{objectId}/stock", response_model=ProductBase)
def update_stock(objectId: str, stock: int):
    product_ref = db.collection("products").document(f"product{objectId}")
    product = product_ref.get()
    if not product.exists:
        raise HTTPException(status_code=404, detail="Product not found")
    product_ref.update({"Stock": stock})
    updated_product = product_ref.get().to_dict()
    return updated_product

# 8. Update price for a product
@app.put("/products/{objectId}/price", response_model=ProductBase)
def update_price(objectId: str, price: float):
    product_ref = db.collection("products").document(f"product{objectId}")
    product = product_ref.get()
    if not product.exists:
        raise HTTPException(status_code=404, detail="Product not found")
    product_ref.update({"Prices": price})
    updated_product = product_ref.get().to_dict()
    return updated_product

# 9. Get categories
@app.get("/categories/")
def get_categories():
    products_ref = db.collection("products")
    docs = products_ref.stream()
    categories = set(doc.to_dict().get("Category") for doc in docs if "Category" in doc.to_dict())
    return {"categories": list(categories)}

# 10. Get photo of a product
@app.get("/products/{objectId}/photo")
def get_photo(objectId: str):
    product_ref = db.collection("products").document(f"product{objectId}")
    product = product_ref.get()
    if not product.exists:
        raise HTTPException(status_code=404, detail="Product not found")
    photo = product.to_dict().get("Photo")
    if not photo:
        raise HTTPException(status_code=404, detail="Photo not available")
    return {"photo": photo}

# 11. Create a category
@app.post("/categories/")
def create_category(category: Category):
    category_ref = db.collection("categories").document(category.name)
    category_ref.set({"name": category.name})
    return {"message": f"Category {category.name} added successfully"}

import uvicorn

if __name__ == "__main__":
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)
