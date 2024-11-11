### Car Products API with FastAPI and SQLAlchemy

This `main.py` file provides a FastAPI application setup that connects to a MySQL database to manage car products. The application allows CRUD operations on car product data, which includes fields such as `objectId`, `Make`, `Year`, `Model`, `Category`, `Prices`, and `Stock`.

#### Key Components

1. **Database Configuration**:
   - Uses SQLAlchemy to connect to a MySQL database.
   - Reflects the `Products` table from the database, allowing interaction with an existing schema.

2. **Product Model**:
   - SQLAlchemy’s `Table` reflection method is used to create a model for the `Products` table, enabling operations on the database without redefining the schema in code.

3. **Pydantic Model**:
   - `ProductBase`: A Pydantic model defining the structure of data for API requests and responses, ensuring data validation.

4. **API Endpoints**:
   - **Root** (`/`): A test route to confirm the API is connected to MySQL.
   - **Get All Products** (`/products/`): Retrieves a list of all car products.
   - **Get Product by objectId** (`/products/{objectId}`): Fetches details of a specific product by its `objectId`.
   - **Create Product** (`/products/`): Adds a new car product to the database.

5. **Running the Application**:
   - To run the FastAPI application, use `uvicorn` with the command:
     ```bash
     uvicorn main:app --host 127.0.0.1 --port 8000 --reload
     ```
   - The application will be accessible at `http://127.0.0.1:8000/`.

#### Usage

This API serves as a backend service for managing car product data, suitable for inventory management systems or car sales platforms. The setup allows easy database access, data validation, and a RESTful interface to integrate with frontend applications.
