import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './ProductDetail.css';
import logo from './assets/Logo.png';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [reviews, setReviews] = useState([]); // State for reviews
  const [newReview, setNewReview] = useState('');
  const [userRating, setUserRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [showReviewForm, setShowReviewForm] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:8000/products/${id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch product data');
        }
        const data = await response.json();
        setProduct(data);
      } catch (error) {
        console.error('Error fetching product data:', error);
        alert('Failed to load product details. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:8000/reviews/${id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch reviews');
        }
        const data = await response.json();
        setReviews(data.reviews || []);
      } catch (error) {
        console.error('Error fetching reviews:', error);
      }
    };

    fetchReviews();
  }, [id]);

  const handleAddToCart = () => {
    if (product.Stock === 0) {
      alert('This product is out of stock');
      return;
    }

    const savedCart = JSON.parse(localStorage.getItem('cart') || '[]');
    const existingItem = savedCart.find((item) => item.objectId === product.objectId);

    if (existingItem) {
      const updatedCart = savedCart.map((item) =>
        item.objectId === product.objectId
          ? { ...item, quantity: item.quantity + 1 }
          : item
      );
      localStorage.setItem('cart', JSON.stringify(updatedCart));
    } else {
      const newCart = [...savedCart, { ...product, quantity: 1 }];
      localStorage.setItem('cart', JSON.stringify(newCart));
    }

    alert('Added to cart successfully!');
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    try {
      const currentUser = JSON.parse(localStorage.getItem('currentUser')) || {};
      const review = {
        user: currentUser.username || 'Anonymous',
        productId: id,
        rating: userRating,
        comment: newReview,
        date: new Date().toISOString().split('T')[0],
        visible: 'check', // Default to "check"
      };

      const response = await fetch(`http://127.0.0.1:8000/products/${id}/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(review),
      });

      if (!response.ok) {
        throw new Error('Failed to submit review');
      }

      alert('Your review has been submitted for admin approval.');
      setNewReview('');
      setUserRating(0);
      setShowReviewForm(false);
    } catch (error) {
      console.error('Error submitting review:', error);
      alert('Failed to submit review. Please try again.');
    }
  };

  // Calculate average rating using all reviews (including those with visible !== "yes")
  const averageRating =
    reviews.reduce((acc, review) => acc + review.rating, 0) / (reviews.length || 1);

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (!product) {
    return <div className="error">Product not found.</div>;
  }

  return (
    <div className="product-detail-container">
      <nav className="nav">
        <div className="nav-content">
          <div className="nav-left">
            <img
              src={logo}
              alt="WheelCar Logo"
              className="nav-logo"
              onClick={() => navigate('/main')}
            />
            <h1 className="nav-title">WheelCar</h1>
          </div>

          <div className="nav-right">
            <div className="nav-icons">
              <button onClick={() => navigate('/login')} className="icon-button">
                👤
              </button>
              <button onClick={() => navigate('/cart')} className="icon-button">
                🛒
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="product-content">
        <div className="product-left">
          <img src={product.Photo} alt={product.Model} className="product-image" />
        </div>

        <div className="product-right">
          <h1 className="product-title">{`${product.Make} ${product.Model}`}</h1>

          <div className="product-meta">
            <span className="product-category">{product.Category}</span>
            <div className="product-rating">
              {'★'.repeat(Math.floor(averageRating))}
              {'☆'.repeat(5 - Math.floor(averageRating))}
              <span className="rating-number">({averageRating.toFixed(1)})</span>
            </div>
          </div>

          <p className="product-price">${product.Prices}</p>

          <div
            className={`stock-status ${product.Stock === 0 ? 'out-of-stock' : ''}`}
          >
            {product.Stock === 0 ? 'Out of Stock' : `${product.Stock} in stock`}
          </div>

          <p className="product-description">
            {product.description || 'No description available.'}
          </p>

          <button
            onClick={handleAddToCart}
            className={`add-to-cartbtn ${product.Stock === 0 ? 'disabled' : ''}`}
            disabled={product.Stock === 0}
          >
            {product.Stock === 0 ? 'Out of Stock' : 'Add to Cart'}
          </button>
        </div>
      </div>

      <div className="rating-section">
        <h2>Rate This Product</h2>
        <div className="stars-wrapper">
          {[1, 2, 3, 4, 5].map((star) => (
            <span
              key={star}
              className={`star ${star <= (hoveredRating || userRating) ? 'active' : ''}`}
              onClick={() => setUserRating(star)}
              onMouseEnter={() => setHoveredRating(star)}
              onMouseLeave={() => setHoveredRating(0)}
            >
              ★
            </span>
          ))}
        </div>
      </div>

      <div className="reviews-section">
        <div className="reviews-header">
          <h2>Customer Reviews</h2>
          <button
            className="write-review-btn"
            onClick={() => setShowReviewForm(!showReviewForm)}
          >
            Write a Review
          </button>
        </div>

        {showReviewForm && (
          <form onSubmit={handleSubmitReview} className="review-form">
            <textarea
              value={newReview}
              onChange={(e) => setNewReview(e.target.value)}
              placeholder="Write your review here..."
              required
              minLength={10}
              maxLength={500}
            />
            <button type="submit" className="submit-review-btn">
              Submit Review
            </button>
          </form>
        )}

        <div className="reviews-list">
          {reviews.filter((review) => review.visible === 'yes').length === 0 ? (
            <p>No reviews yet for this product.</p>
          ) : (
            reviews
              .filter((review) => review.visible === 'yes')
              .map((review, index) => (
                <div key={index} className="review-item">
                  <div className="review-header">
                    <span className="reviewer-name">{review.user || 'Anonymous'}</span>
                    <div className="review-rating">
                      {'★'.repeat(Math.floor(review.rating))}
                      {'☆'.repeat(5 - Math.floor(review.rating))}
                    </div>
                  </div>
                  <span className="review-date">
                    {review.date
                      ? new Date(review.date).toLocaleDateString()
                      : 'Recent'}
                  </span>
                  <p className="review-comment">{review.comment}</p>
                </div>
              ))
          )}
                    <button
            onClick={() => navigate('/main')}
            className="back-to-store-btn"
          >
            Back to Store
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;

