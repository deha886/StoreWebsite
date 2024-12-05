import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Admin.css';

const Admin = () => {
  const [activeTab, setActiveTab] = useState('orders');
  const [orders, setOrders] = useState([]);
  const [imageURLs, setImageURLs] = useState({});
  const [reviews, setReviews] = useState([]);
  const [activeReviewTab, setActiveReviewTab] = useState('pending');

  useEffect(() => {
    // Fetch orders and sort them by date
    const fetchOrders = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/orders/');
        const sortedOrders = response.data.sort(
          (a, b) => new Date(b.Date) - new Date(a.Date)
        );
        setOrders(sortedOrders);
      } catch (error) {
        console.error('Error fetching orders:', error);
      }
    };

    fetchOrders();
  }, []);

  // Fetch reviews from the API
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/reviews/');
        setReviews(response.data.reviews || []);
      } catch (error) {
        console.error('Error fetching reviews:', error);
      }
    };

    fetchReviews();
  }, []);

  // Fetch product images for all orders
  useEffect(() => {
    const fetchImageURLs = async () => {
      const urls = {};
      for (const order of orders) {
        try {
          const response = await axios.get(
            `http://127.0.0.1:8000/products/product${order.productId}/photo`
          );
          urls[order.productId] = response.data.photo;
        } catch (error) {
          console.error(`Error fetching image for product ${order.productId}:`, error);
          urls[order.productId] = '/placeholder-image.png';
        }
      }
      setImageURLs(urls);
    };

    if (orders.length > 0) {
      fetchImageURLs();
    }
  }, [orders]);

  const handleOrderStatusChange = async (orderId, newStatus) => {
    try {
      await axios.put(`http://127.0.0.1:8000/orders/${orderId}/status`, {
        status: newStatus,
      });
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.OrderID === orderId ? { ...order, Status: newStatus } : order
        )
      );
    } catch (error) {
      console.error('Error updating order status:', error);
    }
  };

  const handleApprove = async (reviewId) => {
    try {
      await axios.put(`http://127.0.0.1:8000/reviews/${reviewId}/status`, {
        visible: 'yes',
      });
      setReviews((prevReviews) =>
        prevReviews.map((review) =>
          review.id === reviewId ? { ...review, visible: 'yes' } : review
        )
      );
    } catch (error) {
      console.error('Error approving review:', error);
    }
  };
  
  const handleReject = async (reviewId) => {
    try {
      await axios.put(`http://127.0.0.1:8000/reviews/${reviewId}/status`, {
        visible: 'no',
      });
      setReviews((prevReviews) =>
        prevReviews.map((review) =>
          review.id === reviewId ? { ...review, visible: 'no' } : review
        )
      );
    } catch (error) {
      console.error('Error rejecting review:', error);
    }
  };
  

  const filteredReviews = (tab) => {
    if (tab === 'pending') return reviews.filter((review) => review.visible === 'check');
    if (tab === 'approved') return reviews.filter((review) => review.visible === 'yes');
    if (tab === 'rejected') return reviews.filter((review) => review.visible === 'no');
    return [];
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
                      onChange={(e) =>
                        handleOrderStatusChange(order.OrderID, e.target.value)
                      }
                      className={`status-select ${order.Status.toLowerCase().replace(' ', '-')}`}
                    >
                      <option value="processing">Processing</option>
                      <option value="in-transit">In Transit</option>
                      <option value="delivered">Delivered</option>
                    </select>
                  </div>
                  <div className="order-details">
                    <p>
                      <strong>Customer:</strong> {order.Customer}
                    </p>
                    <p>
                      <strong>Date:</strong> {order.Date}
                    </p>
                    <p>
                      <strong>Total:</strong> ${order.Total.toFixed(2)}
                    </p>
                    <div className="order-items">
                      <h4>Items:</h4>
                      <div className="order-item">
                        <img
                          src={imageURLs[order.productId] || '/placeholder-image.png'}
                          alt={order.Content}
                          className="item-image"
                        />
                        <div className="item-details">
                          <span>
                            <strong>Product:</strong> {order.Content}
                          </span>
                          <span>
                            <strong>Price:</strong> ${order.Total}
                          </span>
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
          <div className="reviews-management">
            <h2>Review Management</h2>
            <div className="status-tabs">
              <button
                className={`status-tab ${activeReviewTab === 'pending' ? 'active' : ''}`}
                onClick={() => setActiveReviewTab('pending')}
              >
                Pending Reviews
              </button>
              <button
                className={`status-tab ${activeReviewTab === 'approved' ? 'active' : ''}`}
                onClick={() => setActiveReviewTab('approved')}
              >
                Approved Reviews
              </button>
              <button
                className={`status-tab ${activeReviewTab === 'rejected' ? 'active' : ''}`}
                onClick={() => setActiveReviewTab('rejected')}
              >
                Rejected Reviews
              </button>
            </div>

            <div className="reviews-list">
              {filteredReviews(activeReviewTab).map((review) => (
                <div key={review.id} className="review-card">
                  <div className="review-info">
                    <div className="review-detail">
                      <span className="label">User:</span>
                      <span className="value">{review.user}</span>
                    </div>
                    <div className="review-detail">
                      <span className="label">Rating:</span>
                      <span className="value">{review.rating}</span>
                    </div>
                    <div className="review-detail">
                      <span className="label">Comment:</span>
                      <span className="value">{review.comment}</span>
                    </div>
                  </div>
                  {review.visible === 'check' && (
                    <div className="review-actions">
                      <button
                        className="approve-btn"
                        onClick={() => handleApprove(review.id)}
                      >
                        Approve
                      </button>
                      <button
                        className="reject-btn"
                        onClick={() => handleReject(review.id)}
                      >
                        Reject
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Admin;
