import React, { useState } from 'react';
import './Admin.css';

const Admin = () => {
  const [activeTab, setActiveTab] = useState('products');
  const [reviewFilter, setReviewFilter] = useState('pending');
  
  const [products, setProducts] = useState([
    {
      id: 1,
      name: "Tesla Model S",
      model: "2024",
      serialNumber: "TS-2024-001",
      description: "Electric luxury sedan",
      quantity: 3,
      price: 79999,
      warrantyStatus: "2 Years",
      distributor: "Tesla Motors Inc."
    }
  ]);

  const [orders, setOrders] = useState([
    {
      id: "99952",
      customerName: "John Doe",
      date: "2024-02-15",
      total: 79999,
      status: "processing",
      items: [
        { name: "Tesla Model S", quantity: 1, price: 79999 }
      ]
    }
  ]);

  const [reviews, setReviews] = useState([
    {
      id: 1,
      productId: 1,
      productName: "Tesla Model S",
      customerName: "Jane Smith",
      comment: "Great car, excellent performance!",
      date: "2024-02-15",
      status: "pending"
    },
    {
      id: 2,
      productId: 1,
      productName: "Tesla Model S",
      customerName: "John Doe",
      comment: "Amazing experience with this car!",
      date: "2024-02-14",
      status: "approved"
    }
  ]);

  const [newProduct, setNewProduct] = useState({
    name: '',
    model: '',
    serialNumber: '',
    description: '',
    quantity: 0,
    price: 0,
    warrantyStatus: '',
    distributor: ''
  });

  const handleProductSubmit = (e) => {
    e.preventDefault();
    setProducts([...products, { ...newProduct, id: products.length + 1 }]);
    setNewProduct({
      name: '',
      model: '',
      serialNumber: '',
      description: '',
      quantity: 0,
      price: 0,
      warrantyStatus: '',
      distributor: ''
    });
  };

  const handleOrderStatusChange = (orderId, newStatus) => {
    setOrders(orders.map(order =>
      order.id === orderId ? { ...order, status: newStatus } : order
    ));
  };

  const handleReviewApproval = (reviewId) => {
    setReviews(reviews.map(review =>
      review.id === reviewId ? { ...review, status: 'approved' } : review
    ));
  };

  const handleReviewRejection = (reviewId) => {
    setReviews(reviews.map(review =>
      review.id === reviewId ? { ...review, status: 'rejected' } : review
    ));
  };

  return (
    <div className="admin-container">
      <nav className="admin-nav">
        <div className="nav-tabs">
          <button
            className={`nav-tab ${activeTab === 'products' ? 'active' : ''}`}
            onClick={() => setActiveTab('products')}
          >
            Products
          </button>
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
        {activeTab === 'products' && (
          <div className="products-section">
            <h2>Add New Product</h2>
            <form onSubmit={handleProductSubmit} className="product-form">
              <div className="form-row">
                <div className="form-group">
                  <label>Name</label>
                  <input
                    type="text"
                    value={newProduct.name}
                    onChange={e => setNewProduct({...newProduct, name: e.target.value})}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Model</label>
                  <input
                    type="text"
                    value={newProduct.model}
                    onChange={e => setNewProduct({...newProduct, model: e.target.value})}
                    required
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Serial Number</label>
                  <input
                    type="text"
                    value={newProduct.serialNumber}
                    onChange={e => setNewProduct({...newProduct, serialNumber: e.target.value})}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Price</label>
                  <input
                    type="number"
                    value={newProduct.price}
                    onChange={e => setNewProduct({...newProduct, price: e.target.value})}
                    required
                  />
                </div>
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea
                  value={newProduct.description}
                  onChange={e => setNewProduct({...newProduct, description: e.target.value})}
                  required
                />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Quantity in Stock</label>
                  <input
                    type="number"
                    value={newProduct.quantity}
                    onChange={e => setNewProduct({...newProduct, quantity: e.target.value})}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Warranty Status</label>
                  <input
                    type="text"
                    value={newProduct.warrantyStatus}
                    onChange={e => setNewProduct({...newProduct, warrantyStatus: e.target.value})}
                    required
                  />
                </div>
              </div>
              <div className="form-group">
                <label>Distributor Information</label>
                <input
                  type="text"
                  value={newProduct.distributor}
                  onChange={e => setNewProduct({...newProduct, distributor: e.target.value})}
                  required
                />
              </div>
              <button type="submit" className="submit-btn">Add Product</button>
            </form>

            <h2>Current Products</h2>
            <div className="products-list">
              {products.map(product => (
                <div key={product.id} className="product-card">
                  <h3>{product.name}</h3>
                  <div className="product-details">
                    <p><strong>Model:</strong> {product.model}</p>
                    <p><strong>Serial Number:</strong> {product.serialNumber}</p>
                    <p><strong>Price:</strong> ${product.price}</p>
                    <p><strong>Stock:</strong> {product.quantity}</p>
                    <p><strong>Warranty:</strong> {product.warrantyStatus}</p>
                    <p><strong>Distributor:</strong> {product.distributor}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'orders' && (
          <div className="orders-section">
            <h2>Order Management</h2>
            <div className="orders-list">
              {orders.map(order => (
                <div key={order.id} className="order-card">
                  <div className="order-header">
                    <h3>Order #{order.id}</h3>
                    <select
                      value={order.status}
                      onChange={(e) => handleOrderStatusChange(order.id, e.target.value)}
                      className={`status-select ${order.status}`}
                    >
                      <option value="processing">Processing</option>
                      <option value="in-transit">In Transit</option>
                      <option value="delivered">Delivered</option>
                    </select>
                  </div>
                  <div className="order-details">
                    <p><strong>Customer:</strong> {order.customerName}</p>
                    <p><strong>Date:</strong> {order.date}</p>
                    <p><strong>Total:</strong> ${order.total}</p>
                    <div className="order-items">
                      <h4>Items:</h4>
                      {order.items.map((item, index) => (
                        <div key={index} className="order-item">
                          <span>{item.name}</span>
                          <span>x{item.quantity}</span>
                          <span>${item.price}</span>
                        </div>
                      ))}
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
                className={`status-tab ${reviewFilter === 'pending' ? 'active' : ''}`}
                onClick={() => setReviewFilter('pending')}
              >
                Pending Reviews
              </button>
              <button 
                className={`status-tab ${reviewFilter === 'approved' ? 'active' : ''}`}
                onClick={() => setReviewFilter('approved')}
              >
                Approved Reviews
              </button>
              <button 
                className={`status-tab ${reviewFilter === 'rejected' ? 'active' : ''}`}
                onClick={() => setReviewFilter('rejected')}
              >
                Rejected Reviews
              </button>
            </div>
            <div className="reviews-list">
              {reviews
                .filter(review => review.status === reviewFilter)
                .map(review => (
                  <div key={review.id} className="review-card">
                    <div className="review-header">
                      <h3>{review.productName}</h3>
                      <span className="review-date">{review.date}</span>
                    </div>
                    <div className="review-content">
                      <p className="reviewer">
                        <strong>Customer:</strong> {review.customerName}
                      </p>
                      <p className="review-text">{review.comment}</p>
                    </div>
                    {review.status === 'pending' && (
                      <div className="review-actions">
                        <button 
                          onClick={() => handleReviewApproval(review.id)}
                          className="approve-btn"
                        >
                          Approve
                        </button>
                        <button 
                          onClick={() => handleReviewRejection(review.id)}
                          className="reject-btn"
                        >
                          Reject
                        </button>
                      </div>
                    )}
                    <div className={`review-status ${review.status}`}>
                      {review.status.charAt(0).toUpperCase() + review.status.slice(1)}
                    </div>
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