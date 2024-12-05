from datetime import datetime
from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import firebase_admin
from firebase_admin import credentials, firestore

# Firebase setup
if not firebase_admin._apps:
    cred = credentials.Certificate(r"C:\Users\Windows 10\Desktop\cs308-project\cs308-storewebsite-firebase-adminsdk-aswhm-5546b8efa9.json")
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


class ReviewBase(BaseModel):
    user: str
    date: str  # Changed to str to match the Firestore format
    rating: float
    comment: str
    visible: str

class UserBase(BaseModel):
    username: str
    fullname: str
    email: str
    password: str
    rank: int
    taxId: str
    address: str

    class Config:
        from_attributes = True

# Pydantic model for Orders
class OrderBase(BaseModel):
    OrderID: str
    Customer: str
    Content: str
    Date: str
    Status: str
    Total: float
    productId: int

    class Config:
        from_attributes = True

# Mock current user (replace with real authentication logic)
def get_current_user():
    return {"username": "giris_yapan_kullanici"}


@app.get("/")
async def root():
    return {"message": "Hello, FastAPI and Firestore are connected with CORS enabled!"}

# 12. Get all users
@app.get("/users/", response_model=list[UserBase])
def get_users():
    try:
        users_ref = db.collection("users")
        docs = users_ref.stream()

        users = []
        for doc in docs:
            user = doc.to_dict()
            users.append(user)

        # If no users are found, return an empty list
        if not users:
            raise HTTPException(status_code=404, detail="No users found")

        return users
    except Exception as e:
        print(f"Error fetching users: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal Server Error")


@app.post("/users/", response_model=UserBase)
def create_or_update_user(user: UserBase):
    try:
        user_ref = db.collection("users").document(user.username)  # Use username as document ID
        user_ref.set(user.dict())
        return user.dict()
    except Exception as e:
        print(f"Error creating or updating user: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal Server Error")


def get_user_document(user_id: str):
    """Helper function to fetch a user's document."""
    user_ref = db.collection("users").document(user_id)
    user = user_ref.get()
    if not user.exists:
        raise HTTPException(status_code=404, detail=f"User {user_id} not found")
    return user.to_dict()


@app.get("/users/{user_id}/rank")
def get_user_rank(user_id: str):
    user = get_user_document(user_id)
    return {"rank": user.get("rank")}


@app.get("/users/{user_id}/password")
def get_user_password(user_id: str):
    user = get_user_document(user_id)
    return {"password": user.get("password")}


@app.get("/users/{user_id}/username")
def get_user_username(user_id: str):
    user = get_user_document(user_id)
    return {"username": user.get("username")}


@app.get("/users/{user_id}/address")
def get_user_address(user_id: str):
    user = get_user_document(user_id)
    return {"address": user.get("address")}


@app.get("/users/{user_id}/email")
def get_user_email(user_id: str):
    user = get_user_document(user_id)
    return {"email": user.get("email")}


@app.get("/users/{user_id}/fullname")
def get_user_fullname(user_id: str):
    user = get_user_document(user_id)
    return {"fullname": user.get("fullname")}


@app.get("/users/{user_id}/taxid")
def get_user_tax_id(user_id: str):
    user = get_user_document(user_id)
    return {"taxId": user.get("taxId")}

@app.delete("/users/{username}")
def delete_user(username: str):
    try:
        user_ref = db.collection("users").document(username)
        user = user_ref.get()
        if not user.exists:
            raise HTTPException(status_code=404, detail=f"User with username '{username}' not found")
        user_ref.delete()
        return {"message": f"User '{username}' deleted successfully"}
    except Exception as e:
        print(f"Error deleting user: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal Server Error")


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
    try:
        product_ref = db.collection("products").document(f"product{objectId}")
        product = product_ref.get()
        if not product.exists:
            raise HTTPException(status_code=404, detail="Product not found")
        return product.to_dict()
    except Exception as e:
        print(f"Error fetching product: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal Server Error")

@app.get("/products/{product_id}/photo")
def get_product_photo(product_id: str):
    try:
        # Get the document reference for the given product ID
        product_ref = db.collection("products").document(product_id)
        product = product_ref.get()
        
        if not product.exists:
            raise HTTPException(status_code=404, detail=f"Product with ID {product_id} not found")
        
        # Get the Photo field from the product document
        product_data = product.to_dict()
        photo_url = product_data.get("Photo")

        if not photo_url:
            raise HTTPException(status_code=404, detail="Photo not found for this product")

        return {"productId": product_id, "photo": photo_url}

    except Exception as e:
        print(f"Error fetching product photo: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal Server Error")

@app.get("/products/{objectId}/stock", response_model=dict)
def get_product_stock(objectId: str):
    try:
        # Adjust the document reference to include the "product" prefix
        document_id = f"product{objectId}"
        product_ref = db.collection("products").document(document_id)
        product = product_ref.get()

        # Check if the product exists
        if not product.exists:
            raise HTTPException(status_code=404, detail=f"Product with ID {document_id} not found")

        # Get the Stock field from the product document
        product_data = product.to_dict()
        stock = product_data.get("Stock")

        if stock is None:
            raise HTTPException(status_code=404, detail="Stock not found for this product")

        return {"productId": document_id, "stock": stock}

    except Exception as e:
        print(f"Error fetching product stock: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal Server Error")




# 3. Get distinct makes
@app.get("/makes/")
def get_makes():
    try:
        products_ref = db.collection("products")
        docs = products_ref.stream()
        makes = set(doc.to_dict().get("Make") for doc in docs if "Make" in doc.to_dict())
        return {"makes": list(makes)}
    except Exception as e:
        print(f"Error fetching makes: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal Server Error")


# 4. Get products by make
@app.get("/makes/{make}/products", response_model=list[ProductBase])
def get_products_by_make(make: str):
    try:
        products_ref = db.collection("products").where("Make", "==", make)
        docs = products_ref.stream()
        products = [doc.to_dict() for doc in docs]
        if not products:
            raise HTTPException(status_code=404, detail=f"No products found for make {make}")
        return products
    except Exception as e:
        print(f"Error fetching products by make: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal Server Error")


# 5. Create a new product
@app.post("/products/", response_model=ProductBase)
def create_product(product: ProductBase):
    try:
        product_ref = db.collection("products").document(f"product{product.objectId}")
        product_ref.set(product.dict())
        return product.dict()
    except Exception as e:
        print(f"Error creating product: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal Server Error")
def add_review(
    objectId: str,
    review: ReviewBase,
    current_user: dict = Depends(get_current_user)
):
    try:
        # Ürüne ait yorum koleksiyonu
        review_collection = db.collection(f"product{objectId}-review")
        
        # Yorum verisini oluştur
        review_data = {
            "user": current_user["username"],  # Giriş yapan kullanıcı adı
            "date": datetime.now().isoformat(),  # Şu anki tarih ve saat
            "rating": review.rating,  # Kullanıcının verdiği puan
            "comment": review.comment  # Kullanıcının yorumu
        }
        review_collection.add(review_data)  # Firestore'a kaydet
        
        return {"message": "Yorum başarıyla eklendi", "review": review_data}
    except Exception as e:
        print(f"Error adding review: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal Server Error")


# 6. Delete a product
@app.delete("/products/{objectId}")
def delete_product(objectId: str):
    try:
        product_ref = db.collection("products").document(f"product{objectId}")
        product = product_ref.get()
        if not product.exists:
            raise HTTPException(status_code=404, detail="Product not found")
        product_ref.delete()
        return {"message": f"Product {objectId} deleted successfully"}
    except Exception as e:
        print(f"Error deleting product: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal Server Error")


# 7. Update stock for a product
@app.put("/products/{objectId}/stock", response_model=dict)
def update_stock(objectId: str, stock: int):
    try:
        # Adjust the document reference to include the "product" prefix
        document_id = f"product{objectId}"
        product_ref = db.collection("products").document(document_id)
        product = product_ref.get()

        # Check if the product exists
        if not product.exists:  # Corrected from product.exists() to product.exists
            raise HTTPException(status_code=404, detail=f"Product {document_id} not found")

        # Update the stock
        product_ref.update({"Stock": stock})
        updated_product = product_ref.get().to_dict()

        return {
            "message": f"Product {document_id} stock updated to {stock}",
            "product": updated_product
        }
    except Exception as e:
        print(f"Error updating stock: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal Server Error")




# 8. Update price for a product
@app.put("/products/{objectId}/price", response_model=ProductBase)
def update_price(objectId: str, price: float):
    try:
        product_ref = db.collection("products").document(f"product{objectId}")
        product = product_ref.get()
        if not product.exists:
            raise HTTPException(status_code=404, detail="Product not found")
        product_ref.update({"Prices": price})
        updated_product = product_ref.get().to_dict()
        return updated_product
    except Exception as e:
        print(f"Error updating price: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal Server Error")


# 9. Get categories
@app.get("/categories/")
def get_categories():
    try:
        products_ref = db.collection("products")
        docs = products_ref.stream()
        categories = set(doc.to_dict().get("Category") for doc in docs if "Category" in doc.to_dict())
        return {"categories": list(categories)}
    except Exception as e:
        print(f"Error fetching categories: {str(e)}")

        raise HTTPException(status_code=500, detail="Internal Server Error")


# 10. Add a review to a product
from typing import List

# 11. Get reviews for a specific product
from typing import List


# Endpoint to get all orders
@app.get("/orders/", response_model=list[OrderBase])
def get_orders():
    try:
        orders_ref = db.collection("orders")
        docs = orders_ref.stream()

        orders = []
        for doc in docs:
            order = doc.to_dict()
            orders.append(order)

        if not orders:
            raise HTTPException(status_code=404, detail="No orders found")

        return orders
    except Exception as e:
        print(f"Error fetching orders: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal Server Error")



@app.get("/orders/{order_id}", response_model=OrderBase)
def get_order(order_id: str):
    try:
        order_ref = db.collection("orders").document(order_id)
        order = order_ref.get()
        if not order.exists:
            raise HTTPException(status_code=404, detail=f"Order {order_id} not found")
        return order.to_dict()
    except Exception as e:
        print(f"Error fetching order: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal Server Error")



# Endpoint to create a new order
@app.post("/orders/", response_model=OrderBase)
def create_order(order: OrderBase):
    try:
        order_ref = db.collection("orders").document(f"order{order.OrderID}")
        order_ref.set(order.dict())
        return order.dict()
    except Exception as e:
        print(f"Error creating order: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal Server Error")



from pydantic import BaseModel

class StatusUpdate(BaseModel):
    status: str

@app.put("/orders/{order_id}/status")
def update_order_status(order_id: str, status_update: StatusUpdate):
    try:
        # Adjust the document reference to include "order" prefix
        document_id = f"order{order_id}"
        order_ref = db.collection("orders").document(document_id)
        order = order_ref.get()

        if not order.exists:
            raise HTTPException(status_code=404, detail=f"Order {document_id} not found")

        # Update the status
        order_ref.update({"Status": status_update.status})
        return {"message": f"Order {document_id} status updated to {status_update.status}"}
    except Exception as e:
        print(f"Error updating order status: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal Server Error")




# Endpoint to get orders made by the current user@app.get("/orders/{username}", response_model=List[OrderBase])
@app.get("/orders/{username}", response_model=List[OrderBase])
def get_orders_by_user(username: str):
    try:
        # Fetch all documents in the 'orders' collection
        orders_ref = db.collection("orders")
        docs = orders_ref.stream()
        user_orders = []

        # Filter orders that contain the username in the OrderID
        for doc in docs:
            order = doc.to_dict()
            order_id = order.get("OrderID", "")
            if order_id.startswith(f"{username}-"):
                user_orders.append(order)

        # If no matching orders are found, return 404
        if not user_orders:
            raise HTTPException(status_code=404, detail=f"No orders found for user '{username}'")

        return user_orders
    except Exception as e:
        print(f"Error fetching orders for user {username}: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal Server Error")


@app.post("/products/{product_id}/reviews")
def add_review(product_id: str, review: ReviewBase):
    try:
        # Firestore koleksiyonuna erişim
        reviews_collection = db.collection("reviews")

        # Belge için benzersiz bir ID oluşturma (ör. review-yax-11)
        document_id = f"review-{review.user}-{product_id}"

        # Yorum verisini hazırlama
        review_data = {
            "user": review.user,
            "productId": int(product_id),  # product_id int'e çevrilerek kaydedilir
            "rating": review.rating,
            "comment": review.comment,
            "date": review.date or datetime.now().strftime("%d-%m-%y"),  # Format: Gün-Ay-Yıl,
            "visible": review.visible
        }

        # Firestore'a belgeyi kaydetme
        reviews_collection.document(document_id).set(review_data)

        return {
            "message": f"Review added successfully for product {product_id}.",
            "review": review_data
        }
    except Exception as e:
        print(f"Error storing review: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal Server Error")

@app.get("/reviews")
def get_all_reviews():
    try:
        # Query the reviews collection for all reviews
        reviews_ref = db.collection("reviews").stream()

        reviews = []
        for review in reviews_ref:
            review_data = review.to_dict()
            review_data["id"] = review.id  # Include the document ID
            reviews.append(review_data)

        if not reviews:
            return {"message": "No reviews found", "reviews": []}

        return {"reviews": reviews}

    except Exception as e:
        print(f"Error fetching all reviews: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal Server Error")


@app.get("/reviews/{product_id}")
def get_reviews_by_product_id(product_id: str):
    try:
        # Query the reviews collection for reviews matching the productId
        reviews_ref = db.collection("reviews")
        query = reviews_ref.where("productId", "==", int(product_id)).stream()

        reviews = []
        for review in query:
            review_data = review.to_dict()
            review_data["id"] = review.id  # Include the document ID
            reviews.append(review_data)

        if not reviews:
            return {"message": f"No reviews found for product ID {product_id}", "reviews": []}

        return {"productId": product_id, "reviews": reviews}

    except Exception as e:
        print(f"Error fetching reviews for product ID {product_id}: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal Server Error")

class VisibleUpdate(BaseModel):
    visible: str

@app.put("/reviews/{review_id}/status")
def update_review_visible_status(review_id: str, visible_update: VisibleUpdate):
    try:
        # Adjust the document reference to include the review ID
        document_id = f"{review_id}"
        review_ref = db.collection("reviews").document(document_id)
        review = review_ref.get()

        if not review.exists:
            raise HTTPException(status_code=404, detail=f"Review {document_id} not found")

        # Update the "visible" field
        review_ref.update({"visible": visible_update.visible})
        return {"message": f"Review {document_id} visible status updated to {visible_update.visible}"}
    except Exception as e:
        print(f"Error updating review visible status: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal Server Error")





# Run the app
# Run the app
if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)
