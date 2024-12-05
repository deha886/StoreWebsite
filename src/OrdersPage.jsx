import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./OrdersPage.css";

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const currentUser = JSON.parse(localStorage.getItem("currentUser"));
        if (!currentUser) {
          alert("You must be logged in to view your orders.");
          navigate("/login");
          return;
        }
        const response = await axios.get(
          `http://127.0.0.1:8000/orders/${currentUser.username}`
        );
        setOrders(response.data);
      } catch (error) {
        console.error("Error fetching orders:", error);
        alert("Failed to fetch orders. Please try again.");
      }
    };

    fetchOrders();
  }, [navigate]);

  const getStatusClass = (status) => {
    switch (status) {
      case "processing":
        return "status-processing";
      case "in-transit":
        return "status-transit";
      case "delivered":
        return "status-delivered";
      default:
        return "";
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await axios.put(`http://127.0.0.1:8000/orders/${orderId}/status`, {
        status: newStatus,
      });
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.OrderID === orderId ? { ...order, Status: newStatus } : order
        )
      );
      alert(`Order ${orderId} status updated to ${newStatus}.`);
    } catch (error) {
      console.error("Error updating order status:", error);
      alert("Failed to update order status. Please try again.");
    }
  };

  return (
    <div className="orders-container">
      <div className="back-link-wrapper">
        <button onClick={() => navigate("/main")} className="back-link">
          ← Back to Store
        </button>
      </div>

      <h1 className="orders-title">My Orders</h1>

      <div className="orders-list">
        {orders.map((order) => (
          <div key={order.OrderID} className="order-card">
            <div className="order-header">
              <h2 className="order-number">ORDER NUMBER #{order.OrderID}</h2>
            </div>

            <div className="order-content">
              <div className="order-items">
                <h3>Ordered Items</h3>
                <div className="order-item">
                  <div className="item-details">
                    <h4>{order.Content}</h4>
                    <p>Product ID: {order.productId}</p>
                    <p>Price: ${order.Total.toFixed(2)}</p>
                  </div>
                </div>
              </div>

              <div className="order-info">
                <div className="info-row">
                  <span className="info-label">Order Date:</span>
                  <span className="info-value">{order.Date}</span>
                </div>
                <div className="info-row">
                  <span className="info-label">Order Total:</span>
                  <span className="info-value">${order.Total.toFixed(2)}</span>
                </div>
                <div className="info-row">
                  <span className="info-label">Status:</span>
                  <select
                    className={`order-status ${getStatusClass(order.Status)}`}
                    value={order.Status}
                    onChange={(e) =>
                      handleStatusChange(order.OrderID, e.target.value)
                    }
                  >
                    <option value="processing">Processing</option>
                    <option value="in-transit">In-Transit</option>
                    <option value="delivered">Delivered</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrdersPage;
