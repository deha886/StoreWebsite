import firebase_admin
from firebase_admin import credentials, firestore

# Path to the uploaded credentials file
CREDENTIALS_FILE = "credentials.json"

# Initialize Firebase Admin SDK only if not already initialized
if not firebase_admin._apps:
    cred = credentials.Certificate(CREDENTIALS_FILE)
    firebase_admin.initialize_app(cred)

# Firestore client
db = firestore.client()

def add_user(user_id, user_data):
    """Add a user document to Firestore."""
    doc_ref = db.collection("users").document(user_id)
    doc_ref.set(user_data)
    print(f"User {user_id} added successfully!")

def get_user(user_id):
    """Retrieve a user document from Firestore."""
    doc_ref = db.collection("users").document(user_id)
    doc = doc_ref.get()
    if doc.exists:
        return doc.to_dict()
    else:
        return None

def update_user(user_id, user_data):
    """Update a user document in Firestore."""
    if not user_data:
        raise ValueError("No data provided for update")
    doc_ref = db.collection("users").document(user_id)
    doc_ref.update(user_data)
    print(f"User {user_id} updated successfully!")

def delete_user(user_id):
    """Delete a user document from Firestore."""
    doc_ref = db.collection("users").document(user_id)
    doc_ref.delete()
    print(f"User {user_id} deleted successfully!")
