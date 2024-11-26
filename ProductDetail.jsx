import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './ProductDetail.css';
import logo from './assets/Logo.png';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const car = {
    id: 1,
    title: "Tesla Model S",
    category: "Electric Vehicles",
    price: "$79,999",
    image: "/api/placeholder/800/500",
    stock: 3,
    rating: 4.5,
    description: "The Tesla Model S is an all-electric luxury sedan known for its long range and high performance. Features include autopilot capabilities, luxurious interior, and instant acceleration.",
    specs: {
      range: "405 miles",
      acceleration: "0-60 mph in 3.1s",
      topSpeed: "155 mph",
      power: "670 hp",
      drive: "All-Wheel Drive"
    },
    reviews: [
      { id: 1, user: "John D.", rating: 5, date: "2024-02-15", comment: "Amazing car, excellent performance!" },
      { id: 2, user: "Sarah M.", rating: 4, date: "2024-02-10", comment: "Great car but expensive maintenance" },
      { id: 3, user: "Mike R.", rating: 4.5, date: "2024-02-05", comment: "Best car I've ever owned. The autopilot feature is incredible." }
    ]
  };

  const handleAddToCart = () => {
    if (car.stock === 0) {
      alert('This product is out of stock');
      return;
    }

    const savedCart = JSON.parse(localStorage.getItem('cart') || '[]');
    const existingItem = savedCart.find(item => item.id === car.id);
    
    if (existingItem) {
      const updatedCart = savedCart.map(item =>
        item.id === car.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      );
      localStorage.setItem('cart', JSON.stringify(updatedCart));
    } else {
      const newCart = [...savedCart, { ...car, quantity: 1 }];
      localStorage.setItem('cart', JSON.stringify(newCart));
    }
    
    alert('Added to cart successfully!');
  };

  // Ortalama puanı hesapla
  const averageRating = car.reviews.reduce((acc, review) => acc + review.rating, 0) / car.reviews.length;

  return (
    <div className="product-detail-container">
      <nav className="nav">
        <div className="nav-content">
          <div className="nav-left">
            <img src={logo} alt="WheelCar Logo" className="nav-logo" onClick={() => navigate('/main')} />
            <h1 className="nav-title">WheelCar</h1>
          </div>
          
          <div className="nav-right">
            <div className="nav-icons">
              <button onClick={() => navigate('/login')} className="icon-button">👤</button>
              <button onClick={() => navigate('/cart')} className="icon-button">🛒</button>
            </div>
          </div>
        </div>
      </nav>

      <div className="product-content">
        <div className="product-left">
          <img src={car.image} alt={car.title} className="product-image" />
        </div>

        <div className="product-right">
          <h1 className="product-title">{car.title}</h1>
          
          <div className="product-meta">
            <span className="product-category">{car.category}</span>
            <div className="product-rating">
              {'★'.repeat(Math.floor(averageRating))}
              {'☆'.repeat(5 - Math.floor(averageRating))}
              <span className="rating-number">({averageRating.toFixed(1)})</span>
            </div>
          </div>

          <p className="product-price">{car.price}</p>
          
          <div className={`stock-status ${car.stock === 0 ? 'out-of-stock' : ''}`}>
            {car.stock === 0 ? 'Out of Stock' : `${car.stock} in stock`}
          </div>

          <p className="product-description">{car.description}</p>

          <div className="product-specs">
            <h2>Specifications</h2>
            <div className="specs-grid">
              <div className="spec-item">
                <span className="spec-label">Range:</span>
                <span className="spec-value">{car.specs.range}</span>
              </div>
              <div className="spec-item">
                <span className="spec-label">Acceleration:</span>
                <span className="spec-value">{car.specs.acceleration}</span>
              </div>
              <div className="spec-item">
                <span className="spec-label">Top Speed:</span>
                <span className="spec-value">{car.specs.topSpeed}</span>
              </div>
              <div className="spec-item">
                <span className="spec-label">Power:</span>
                <span className="spec-value">{car.specs.power}</span>
              </div>
              <div className="spec-item">
                <span className="spec-label">Drive:</span>
                <span className="spec-value">{car.specs.drive}</span>
              </div>
            </div>
          </div>

          <button 
            onClick={handleAddToCart}
            className={`add-to-cart-btn ${car.stock === 0 ? 'disabled' : ''}`}
            disabled={car.stock === 0}
          >
            {car.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
          </button>
        </div>
      </div>

      <div className="reviews-section">
        <h2>Customer Reviews</h2>
        <div className="reviews-list">
          {car.reviews.map(review => (
            <div key={review.id} className="review-item">
              <div className="review-header">
                <span className="reviewer-name">{review.user}</span>
                <div className="review-rating">
                  {'★'.repeat(Math.floor(review.rating))}
                  {'☆'.repeat(5 - Math.floor(review.rating))}
                </div>
              </div>
              <span className="review-date">{new Date(review.date).toLocaleDateString()}</span>
              <p className="review-comment">{review.comment}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;