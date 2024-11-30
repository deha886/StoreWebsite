import React, { useState } from 'react';
import './Mainpage.css';
import { useNavigate } from 'react-router-dom';
import logo from './assets/Logo.png';

const Mainpage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [cartCount, setCartCount] = useState(0);
  const [sortBy, setSortBy] = useState('default');
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
      image: "/api/placeholder/400/300",
      stock: 3,
      rating: 4.5,
      description: "The Tesla Model S is an all-electric luxury sedan known for its long range and high performance. Features include autopilot capabilities, luxurious interior, and instant acceleration.",
      reviews: [
        { id: 1, user: "John D.", rating: 5, comment: "Amazing car, excellent performance!" },
        { id: 2, user: "Sarah M.", rating: 4, comment: "Great car but expensive maintenance" }
      ]
    },
    {
      id: 2,
      title: "Porsche 911",
      category: "Sports Cars",
      price: "$99,999",
      image: "/api/placeholder/400/300",
      stock: 2,
      rating: 4.8,
      description: "The Porsche 911 is an iconic sports car offering exceptional handling and performance. Its distinctive design and rear-engine layout make it a true driver's car.",
      reviews: [
        { id: 1, user: "Mike R.", rating: 5, comment: "The perfect sports car!" },
        { id: 2, user: "Lisa K.", rating: 4.5, comment: "Incredible handling and power" }
      ]
    },
    {
      id: 3,
      title: "Range Rover Sport",
      category: "SUVs",
      price: "$89,999",
      image: "/api/placeholder/400/300",
      stock: 0,
      rating: 4.3,
      description: "The Range Rover Sport combines luxury with off-road capability. Features premium interior materials and advanced terrain response system.",
      reviews: [
        { id: 1, user: "Tom H.", rating: 4, comment: "Luxurious but fuel hungry" },
        { id: 2, user: "Emma S.", rating: 4.5, comment: "Perfect family SUV" }
      ]
    },
    {
      id: 4,
      title: "Mercedes S-Class",
      category: "Luxury Cars",
      price: "$94,999",
      image: "/api/placeholder/400/300",
      stock: 5,
      rating: 4.9,
      description: "The Mercedes S-Class sets the standard for luxury sedans with its cutting-edge technology and unmatched comfort.",
      reviews: [
        { id: 1, user: "David M.", rating: 5, comment: "Ultimate luxury experience" },
        { id: 2, user: "Rachel W.", rating: 4.8, comment: "Incredible technology and comfort" }
      ]
    },
    {
      id: 5,
      title: "BMW M4",
      category: "Sports Cars",
      price: "$71,999",
      image: "/api/placeholder/400/300",
      stock: 1,
      rating: 4.6,
      description: "The BMW M4 delivers exhilarating performance with its powerful engine and precise handling. Features aggressive styling and modern technology.",
      reviews: [
        { id: 1, user: "Alex P.", rating: 4.5, comment: "Beast of a car!" },
        { id: 2, user: "Chris L.", rating: 4.7, comment: "Amazing performance and sound" }
      ]
    },
    {
      id: 6,
      title: "Audi e-tron GT",
      category: "Electric Vehicles",
      price: "$84,999",
      image: "/api/placeholder/400/300",
      stock: 4,
      rating: 4.7,
      description: "The Audi e-tron GT represents the future of electric performance with stunning design and impressive range.",
      reviews: [
        { id: 1, user: "Paul R.", rating: 5, comment: "Future of automotive" },
        { id: 2, user: "Maria K.", rating: 4.4, comment: "Beautiful design, great range" }
      ]
    }
  ];

  const handleAddToCart = (car, e) => {
    e.stopPropagation();
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
    setCartCount(prev => prev + 1);
  };

  const getFilteredAndSortedCars = () => {
    let filtered = cars.filter(car =>
      car.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      car.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      car.category.toLowerCase().includes(searchTerm.toLowerCase())
    );

    switch(sortBy) {
      case 'price-low':
        return filtered.sort((a, b) => 
          parseFloat(a.price.replace('$', '').replace(',', '')) - 
          parseFloat(b.price.replace('$', '').replace(',', ''))
        );
      case 'price-high':
        return filtered.sort((a, b) => 
          parseFloat(b.price.replace('$', '').replace(',', '')) - 
          parseFloat(a.price.replace('$', '').replace(',', ''))
        );
      case 'rating':
        return filtered.sort((a, b) => b.rating - a.rating);
      default:
        return filtered;
    }
  };

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
                placeholder="Search cars by name or description..." 
                className="search-input"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="nav-icons">
              <button onClick={() => navigate('/login')} className="icon-button">👤</button>
              <div className="cart-wrapper">
                <button onClick={() => navigate('/cart')} className="icon-button">🛒</button>
                {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
              </div>
            </div>
          </div>
        </div>
      </nav>

      <main className="main">
        <section className="sort-section">
          <select 
            value={sortBy} 
            onChange={(e) => setSortBy(e.target.value)}
            className="sort-select"
          >
            <option value="default">Default Sort</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="rating">Sort by Popularity</option>
          </select>
        </section>

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
            {getFilteredAndSortedCars().map((car) => (
              <div 
                key={car.id} 
                className="car-card"
                onClick={() => navigate(`/product/${car.id}`)}
              >
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
                    <div className="car-rating">
                      {'★'.repeat(Math.floor(car.rating))}
                      {'☆'.repeat(5 - Math.floor(car.rating))}
                      <span className="rating-number">({car.rating})</span>
                    </div>
                    <p className={`car-stock ${car.stock === 0 ? 'out-of-stock' : ''}`}>
                      {car.stock === 0 ? 'Out of Stock' : `${car.stock} in stock`}
                    </p>
                    <button 
                      onClick={(e) => handleAddToCart(car, e)} 
                      className={`add-to-cart-btn ${car.stock === 0 ? 'disabled' : ''}`}
                      disabled={car.stock === 0}
                    >
                      {car.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
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