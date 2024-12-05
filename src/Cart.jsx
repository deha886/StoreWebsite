import React, { useEffect, useState } from "react";
import "./Cart.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [currentUser, setCurrentUser] = useState(null);
  const [showPayment, setShowPayment] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("currentUser"));
    setCurrentUser(user);

    const savedCart = JSON.parse(localStorage.getItem("cart") || "[]");
    setCartItems(savedCart);

    const totalPrice = savedCart.reduce((acc, item) => {
      const price = parseFloat(item?.Prices || 0);
      const quantity = parseInt(item?.quantity || 0, 10);
      return acc + price * quantity;
    }, 0);

    setTotal(totalPrice.toFixed(2));
  }, []);

  const updateStock = async (productId, newStock) => {
    try {
      const response = await axios.put(
        `http://127.0.0.1:8000/products/${productId}/stock`,
        null,
        {
          params: { stock: newStock },
        }
      );
      console.log(`Stock updated for product ${productId}:`, response.data);
    } catch (error) {
      console.error(
        `Error updating stock for product ${productId}:`,
        error.response?.data || error.message
      );
    }
  };

  const handleProceedToCheckout = () => {
    if (!currentUser || currentUser.rank === 0) {
      alert("You must be logged in to proceed to checkout.");
      navigate("/login");
    } else {
      setShowPayment(true);
    }
  };

  const handleConfirmPayment = async (e) => {
    e.preventDefault();

    try {
      const orders = [];
      for (const item of cartItems) {
        // Fetch the current stock for the product
        const stockResponse = await axios.get(
          `http://127.0.0.1:8000/products/${item.objectId}/stock`
        );
        const currentStock = stockResponse.data.stock;

        // Calculate the new stock for this specific product
        const quantity = item.quantity || 1; // Default to 1 if quantity is not set
        const newStock = currentStock - quantity;

        if (newStock < 0) {
          // If stock is insufficient, alert the user and stop the process
          alert(
            `Insufficient stock for ${item.Make} ${item.Model}. Available stock: ${currentStock}`
          );
          return; // Exit the function without proceeding
        }

        // Update the stock for the specific product
        await updateStock(item.objectId, newStock);

        // Create the order for this item
        const orderId = `${currentUser.username}-${item.objectId}-${Date.now()}`;
        const orderData = {
          OrderID: orderId,
          Customer: currentUser.username,
          Content: `${item.Make} ${item.Model}`,
          Date: new Date().toISOString().split("T")[0],
          Status: "Processing",
          Total: parseFloat(item.Prices) * quantity, // Calculate total price per product
          productId: item.objectId,
        };

        await axios.post("http://127.0.0.1:8000/orders/", orderData);
        orders.push({ ...orderData, quantity });
      }

      // Save the orders to localStorage for use on the InvoicePage
      localStorage.setItem("currentOrders", JSON.stringify(orders));

      // Clear the cart and redirect to the invoice page after successful payment
      localStorage.removeItem("cart");
      alert("Payment successful! Redirecting to the invoice...");
      navigate("/invoice");
    } catch (error) {
      console.error("Error during payment process:", error);
      alert("Payment failed. Please try again.");
    }
  };

  const handleRemoveItem = (itemId) => {
    const updatedCart = cartItems.filter((item) => item.objectId !== itemId);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    setCartItems(updatedCart);

    const totalPrice = updatedCart.reduce((acc, item) => {
      const price = parseFloat(item?.Prices || 0);
      const quantity = parseInt(item?.quantity || 0, 10);
      return acc + price * quantity;
    }, 0);

    setTotal(totalPrice.toFixed(2));
  };

  return (
    <div className="cart-container">
      <h1 className="cart-title">Shopping Cart</h1>

      {cartItems.length === 0 ? (
        <p className="cart-empty">Your cart is empty. Start shopping!</p>
      ) : (
        <div className="cart-items">
          {cartItems.map((item) => (
            <div key={item.objectId} className="cart-item">
              <div className="cart-item-image">
                <img
                  src={item?.Photo || "/placeholder.png"}
                  alt={item?.Model || "Product"}
                />
              </div>
              <div className="cart-item-details">
                <h3 className="cart-item-title">
                  {item?.Make || "Unknown"} {item?.Model || ""}
                </h3>
                <p className="cart-item-category">
                  {item?.Category || "Unknown Category"}
                </p>
                <p className="cart-item-price">
                  Price: ${parseFloat(item?.Prices || 0).toFixed(2)}
                </p>
                <p className="cart-item-quantity">
                  Quantity: {item?.quantity || 1}
                </p>
                <p className="cart-item-total">
                  Total: $
                  {(
                    (parseFloat(item?.Prices || 0) || 0) *
                    (parseInt(item?.quantity || 0, 10) || 1)
                  ).toFixed(2)}
                </p>
                <button
                  onClick={() => handleRemoveItem(item.objectId)}
                  className="remove-item-btn"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="cart-summary">
        <h2 className="cart-summary-title">Cart Summary</h2>
        <p className="cart-summary-total">Total: ${total}</p>
        {cartItems.length > 0 && !showPayment && (
          <button
            onClick={handleProceedToCheckout}
            className="checkout-btn"
          >
            Proceed to Checkout
          </button>
        )}
        {cartItems.length > 0 && showPayment && (
          <div className="payment-section">
            <h2>Payment Details</h2>
            <form onSubmit={handleConfirmPayment}>
              <div className="form-group">
                <label htmlFor="card-number">Card Number</label>
                <input
                  type="text"
                  id="card-number"
                  placeholder="XXXX-XXXX-XXXX-XXXX"
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="expiry-date">Expiry Date</label>
                <input
                  type="text"
                  id="expiry-date"
                  placeholder="MM/YY"
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="cvv">CVV</label>
                <input
                  type="text"
                  id="cvv"
                  placeholder="XXX"
                  required
                />
              </div>
              <button type="submit" className="confirm-payment-btn">
                Confirm Payment
              </button>
            </form>
          </div>
        )}
        <button
          onClick={() => navigate("/main")}
          className="back-to-store-btn"
        >
          Back to Store
        </button>
      </div>
    </div>
  );
};

export default Cart;
