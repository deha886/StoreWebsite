import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Admin.css';

const Admin = () => {
  const [activeTab, setActiveTab] = useState('orders');
  const [orders, setOrders] = useState([]);
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    // LocalStorage'dan yorumları al
    const storedReviews = JSON.parse(localStorage.getItem('reviews')) || [];
    setReviews(storedReviews);
  }, []);


  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/orders/');
        const sortedOrders = response.data.sort((a, b) => new Date(b.Date) - new Date(a.Date));
        setOrders(sortedOrders);
      } catch (error) {
        console.error('Error fetching orders:', error);
      }
    };

    fetchOrders();
  }, []);

  const handleOrderStatusChange = async (orderId, newStatus) => {
    try {
      await axios.put(`http://127.0.0.1:8000/orders/${orderId}/status`, { status: newStatus });
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.OrderID === orderId ? { ...order, Status: newStatus } : order
        )
      );
    } catch (error) {
      console.error('Error updating order status:', error);
    }
  };




  return (
    <div className="admin-container">
      <nav className="admin-nav">
        <div className="nav-tabs">
          <button
            className={`nav-tab ${activeTab === 'orders' ? 'active' : ''}`}
            onClick={() => setActiveTab('orders')}
          >
            Orders
          </button>
          <button
            className={`nav-tab ${activeTab === 'reviews' ? 'active' : ''}`}
            onClick={() => setActiveTab('reviews')}
          >
            Reviews
          </button>
        </div>
      </nav>

      <main className="admin-content">
        {activeTab === 'orders' && (
          <div className="orders-section">
            <h2>Order Management</h2>
            <div className="orders-list">
              {orders.map((order) => (
                <div key={order.OrderID} className="order-card">
                  <div className="order-header">
                    <h3>Order #{order.OrderID}</h3>
                    <select
                      value={order.Status}
                      onChange={(e) => handleOrderStatusChange(order.OrderID, e.target.value)}
                      className={`status-select ${order.Status.toLowerCase().replace(' ', '-')}`}
                    >
                      <option value="processing">Processing</option>
                      <option value="in-transit">In Transit</option>
                      <option value="delivered">Delivered</option>
                    </select>
                  </div>
                  <div className="order-details">
                    <p><strong>Customer:</strong> {order.Customer}</p>
                    <p><strong>Date:</strong> {order.Date}</p>
                    <p><strong>Total:</strong> ${order.Total.toFixed(2)}</p>
                    <div className="order-items">
                      <h4>Items:</h4>
                      <div className="order-item">
                        <img
                          src={`http://127.0.0.1:8000/products/${order.productId}/photo`}
                          alt={order.Content}
                          className="item-image"
                        />
                        <div className="item-details">
                          <span><strong>Product:</strong> {order.Content}</span>
                          <span><strong>Price:</strong> ${order.Total}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'reviews' && (
          <div className="reviews-section">
            <h2>Review Management</h2>
            <div className="reviews-status-tabs">
              <button
                className="status-tab active"
                onClick={() => console.log('Pending Reviews Tab')}
              >
                Pending Reviews
              </button>
              <button
                className="status-tab"
                onClick={() => console.log('Approved Reviews Tab')}
              >
                Approved Reviews
              </button>
              <button
                className="status-tab"
                onClick={() => console.log('Rejected Reviews Tab')}
              >
                Rejected Reviews
              </button>
            </div>
            <div className="reviews-list">
              <h2>Reviews</h2>
              <ul>
                {reviews.map((review, index) => (
                  <li key={index}>
                    <strong>Rating:</strong> {review.rating} <br />
                    <strong>Comment:</strong> {review.comment} <br />
                    <strong>Status:</strong> {review.status}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Admin;
