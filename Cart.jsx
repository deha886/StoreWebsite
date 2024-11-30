// Cart.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Cart.css';

const Cart = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState(() => {
    const savedCart = localStorage.getItem('cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });

  const [paymentInfo, setPaymentInfo] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    nameOnCard: ''
  });

  const handleQuantityChange = (id, change) => {
    setCartItems(items => 
      items.map(item => 
        item.id === id 
          ? { ...item, quantity: Math.max(1, item.quantity + change) }
          : item
      )
    );
    updateLocalStorage(cartItems);
  };

  const removeItem = (id) => {
    const newItems = cartItems.filter(item => item.id !== id);
    setCartItems(newItems);
    updateLocalStorage(newItems);
  };

  const updateLocalStorage = (items) => {
    localStorage.setItem('cart', JSON.stringify(items));
  };

  const handlePaymentSubmit = (e) => {
    e.preventDefault();
    alert('Payment successful!');
    setCartItems([]);
    localStorage.removeItem('cart');
    navigate('/main');
  };

  const calculateTotal = () => {
    const subtotal = cartItems.reduce((sum, item) => {
      const price = parseFloat(item.price.replace('$', '').replace(',', ''));
      return sum + price * item.quantity;
    }, 0);
    const tax = subtotal * 0.1;
    return { subtotal, tax, total: subtotal + tax };
  };

  const { subtotal, tax, total } = calculateTotal();

  return (
    <div className="cart-container">
      <nav className="cart-nav">
        <button 
          onClick={() => navigate('/main')} 
          className="back-button"
        >
          ← Back to Main
        </button>
      </nav>

      <h1 className="cart-title">Your Cart</h1>
      
      <div className="cart-content">
        <div className="cart-items">
          {cartItems.length === 0 ? (
            <p className="empty-cart">Your cart is empty</p>
          ) : (
            cartItems.map(item => (
              <div key={item.id} className="cart-item">
                <img src={item.image} alt={item.title} className="item-image" />
                <div className="item-details">
                  <h3>{item.title}</h3>
                  <p>{item.price}</p>
                  <div className="quantity-controls">
                    <button onClick={() => handleQuantityChange(item.id, -1)}>-</button>
                    <span>{item.quantity}</span>
                    <button onClick={() => handleQuantityChange(item.id, 1)}>+</button>
                  </div>
                  <button onClick={() => removeItem(item.id)} className="remove-btn">
                    Remove
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {cartItems.length > 0 && (
          <div className="checkout-section">
            <div className="total-section">
              <h2>Order Summary</h2>
              <div className="total-row">
                <span>Subtotal:</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="total-row">
                <span>Tax (10%):</span>
                <span>${tax.toFixed(2)}</span>
              </div>
              <div className="total-row total">
                <span>Total:</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>

            <div className="payment-section">
              <h2>Payment Details</h2>
              <form onSubmit={handlePaymentSubmit} className="payment-form">
                <div className="form-group">
                  <label>Card Number</label>
                  <input
                    required
                    type="text"
                    placeholder="1234 5678 9012 3456"
                    maxLength="19"
                    onChange={(e) => setPaymentInfo({
                      ...paymentInfo,
                      cardNumber: e.target.value
                    })}
                  />
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Expiry Date</label>
                    <input
                      required
                      type="text"
                      placeholder="MM/YY"
                      maxLength="5"
                      onChange={(e) => setPaymentInfo({
                        ...paymentInfo,
                        expiryDate: e.target.value
                      })}
                    />
                  </div>
                  <div className="form-group">
                    <label>CVV</label>
                    <input
                      required
                      type="text"
                      placeholder="123"
                      maxLength="3"
                      onChange={(e) => setPaymentInfo({
                        ...paymentInfo,
                        cvv: e.target.value
                      })}
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label>Name on Card</label>
                  <input
                    required
                    type="text"
                    placeholder="John Doe"
                    onChange={(e) => setPaymentInfo({
                      ...paymentInfo,
                      nameOnCard: e.target.value
                    })}
                  />
                </div>
                <button type="submit" className="checkout-button">
                  Complete Purchase
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;