import React from 'react';
import { useNavigate } from 'react-router-dom';
import './OrdersPage.css';

const OrdersPage = () => {
  const navigate = useNavigate();

  // Örnek sipariş verileri
  const orders = [
    {
      id: "99952",
      date: "11/29/2024 11:01:20AM",
      total: "79,999",
      status: "processing",
      items: [
        {
          id: 1,
          title: "Tesla Model S",
          price: "$79,999",
          image: "/api/placeholder/100/100"
        }
      ]
    },
    {
      id: "99951",
      date: "11/28/2024 03:15:45PM",
      total: "99,999",
      status: "in-transit",
      items: [
        {
          id: 2,
          title: "Porsche 911",
          price: "$99,999",
          image: "/api/placeholder/100/100"
        }
      ]
    },
    {
      id: "99950",
      date: "11/27/2024 09:30:10AM",
      total: "89,999",
      status: "delivered",
      items: [
        {
          id: 3,
          title: "Range Rover Sport",
          price: "$89,999",
          image: "/api/placeholder/100/100"
        }
      ]
    }
  ];

  const getStatusClass = (status) => {
    switch(status) {
      case 'processing':
        return 'status-processing';
      case 'in-transit':
        return 'status-transit';
      case 'delivered':
        return 'status-delivered';
      default:
        return '';
    }
  };

  return (
    <div className="orders-container">
      <div className="back-link-wrapper">
        <button 
          onClick={() => navigate('/main')} 
          className="back-link"
        >
          ← Back to Store
        </button>
      </div>

      <h1 className="orders-title">My Orders</h1>

      <div className="orders-list">
        {orders.map((order) => (
          <div key={order.id} className="order-card">
            <div className="order-header">
              <h2 className="order-number">ORDER NUMBER #{order.id}</h2>
            </div>

            <div className="order-content">
              <div className="order-items">
                <h3>Ordered Items</h3>
                {order.items.map((item) => (
                  <div key={item.id} className="order-item">
                    <img src={item.image} alt={item.title} className="item-image" />
                    <div className="item-details">
                      <h4>{item.title}</h4>
                      <p>{item.price}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="order-info">
                <div className="info-row">
                  <span className="info-label">Order Date:</span>
                  <span className="info-value">{order.date}</span>
                </div>
                <div className="info-row">
                  <span className="info-label">Order Total:</span>
                  <span className="info-value">${order.total}</span>
                </div>
                <div className="info-row">
                  <span className="info-label">Status:</span>
                  <span className={`order-status ${getStatusClass(order.status)}`}>
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </span>
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