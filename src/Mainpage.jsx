import React, { useState } from 'react';
import './Mainpage.css';
import { useNavigate } from 'react-router-dom';
import logo from './assets/Logo.png';

const Mainpage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [cartCount, setCartCount] = useState(0);
  const navigate = useNavigate();
  
  const categories = [
    { id: 1, name: "Sports Cars" },
    { id: 2, name: "SUVs" },
    { id: 3, name: "Electric Vehicles" },
    { id: 4, name: "Luxury Cars" },
    { id: 5, name: "Classic Cars" }
  ];

  const cars = [
    {
      id: 1,
      title: "Tesla Model S",
      category: "Electric Vehicles",
      price: "$79,999",
      image: "/api/placeholder/400/300"
    },
    {
      id: 2,
      title: "Porsche 911",
      category: "Sports Cars",
      price: "$99,999",
      image: "/api/placeholder/400/300"
    },
    {
      id: 3,
      title: "Range Rover Sport",
      category: "SUVs",
      price: "$89,999",
      image: "/api/placeholder/400/300"
    },
    {
      id: 4,
      title: "Mercedes S-Class",
      category: "Luxury Cars",
      price: "$94,999",
      image: "/api/placeholder/400/300"
    },
    {
      id: 5,
      title: "BMW M4",
      category: "Sports Cars",
      price: "$71,999",
      image: "/api/placeholder/400/300"
    },
    {
      id: 6,
      title: "Audi e-tron GT",
      category: "Electric Vehicles",
      price: "$84,999",
      image: "/api/placeholder/400/300"
    }
  ];

  const handleAddToCart = () => {
    setCartCount(prev => prev + 1);
  };

  const filteredCars = cars.filter(car =>
    car.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    car.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="store-container">
      <nav className="nav">
        <div className="nav-content">
          <div className="nav-left">
            <img src={logo} alt="WheelCar Logo" className="nav-logo" />
            <h1 className="nav-title">WheelCar</h1>
          </div>
          
          <div className="nav-right">
            <div className="search-wrapper">
              <input 
                type="search" 
                placeholder="Search cars..." 
                className="search-input"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="nav-icons">
              <button onClick={() => navigate('/login')} className="icon-button">👤</button>
              <div className="cart-wrapper">
                <button className="icon-button">🛒</button>
                {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
              </div>
            </div>
          </div>
        </div>
      </nav>

      <main className="main">
        <section className="categories-section">
          <h2 className="section-title">Categories</h2>
          <div className="categories-grid">
            {categories.map((category) => (
              <div key={category.id} className="category-card">
                <div className="category-content">
                  {category.name}
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="cars-section">
          <h2 className="section-title">Featured Vehicles</h2>
          <div className="cars-grid">
            {filteredCars.map((car) => (
              <div key={car.id} className="car-card">
                <div className="car-content">
                  <div className="car-image-wrapper">
                    <img 
                      src={car.image} 
                      alt={car.title} 
                      className="car-image"
                    />
                  </div>
                  <div className="car-details">
                    <h3 className="car-title">{car.title}</h3>
                    <p className="car-category">{car.category}</p>
                    <p className="car-price">{car.price}</p>
                    <button onClick={handleAddToCart} className="add-to-cart-btn">
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

export default Mainpage;