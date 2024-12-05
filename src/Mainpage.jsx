import React, { useState, useEffect } from "react";
import "./Mainpage.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import logo from "./assets/Logo.png";

const Mainpage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [cartCount, setCartCount] = useState(0);
  const [categories, setCategories] = useState([]);
  const [cars, setCars] = useState([]);
  const [filteredCars, setFilteredCars] = useState([]);
  const [sortBy, setSortBy] = useState("default");
  const [currentUser, setCurrentUser] = useState(null);
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:8000/makes/");
        setCategories(response.data.makes);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchCars = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:8000/products/");
        setCars(response.data);
        setFilteredCars(response.data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };
    fetchCars();
  }, []);

  useEffect(() => {
    const results = cars.filter(
      (car) =>
        car.Model.toLowerCase().includes(searchTerm.toLowerCase()) ||
        car.Make.toLowerCase().includes(searchTerm.toLowerCase()) ||
        car.Category.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredCars(results);
  }, [searchTerm, cars]);

  useEffect(() => {
    let sortedCars = [...filteredCars];

    switch (sortBy) {
      case "price-low":
        sortedCars.sort((a, b) => a.Prices - b.Prices);
        break;
      case "price-high":
        sortedCars.sort((a, b) => b.Prices - a.Prices);
        break;
      case "default":
      default:
        sortedCars = [...cars];
        break;
    }

    setFilteredCars(sortedCars);
  }, [sortBy, cars]);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("currentUser"));
    if (user && user.rank > 0) {
      setCurrentUser(user);
    }
  }, []);

  const handleCategoryClick = async (category) => {
    try {
      const response = await axios.get(
        `http://127.0.0.1:8000/makes/${category}/products`
      );
      setFilteredCars(response.data);
    } catch (error) {
      console.error(`Error fetching products for ${category}:`, error);
    }
  };

  const handleAddToCart = (car, e) => {
    e.stopPropagation();
    const savedCart = JSON.parse(localStorage.getItem("cart") || "[]");
    const existingItem = savedCart.find((item) => item.objectId === car.objectId);

    if (existingItem) {
      const updatedCart = savedCart.map((item) =>
        item.objectId === car.objectId
          ? { ...item, quantity: item.quantity + 1 }
          : item
      );
      localStorage.setItem("cart", JSON.stringify(updatedCart));
    } else {
      const newCart = [...savedCart, { ...car, quantity: 1 }];
      localStorage.setItem("cart", JSON.stringify(newCart));
    }
    setCartCount((prev) => prev + 1);
  };

  const handleLogout = () => {
    localStorage.removeItem("currentUser");
    setCurrentUser(null);
    setDropdownVisible(false);
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
                placeholder="Search cars..."
                className="search-input"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="nav-icons">
              {currentUser ? (
                <div className="user-menu">
                  <button
                    onClick={() => setDropdownVisible(!dropdownVisible)}
                    className="icon-button"
                  >
                    👤 {currentUser.username}
                  </button>
                  {dropdownVisible && (
                    <div className="dropdown-menu">
                      <button onClick={handleLogout} className="dropdown-item">
                        Log Out
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <button onClick={() => navigate("/login")} className="icon-button">
                  👤 Login
                </button>
              )}
              <div className="cart-wrapper">
                <button onClick={() => navigate("/cart")} className="icon-button">
                  🛒
                </button>
                {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
              </div>
              <div className="orders-wrapper">
                <button onClick={() => navigate("/orders")} className="icon-button">
                  📦
                </button>
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
          </select>
        </section>

        <section className="categories-section">
          <h2 className="section-title">Brands</h2>
          <div className="categories-grid">
            {categories.map((category, index) => (
              <div
                key={index}
                className="category-card"
                onClick={() => handleCategoryClick(category)}
              >
                <div className="category-content">{category}</div>
              </div>
            ))}
          </div>
        </section>

        <section className="cars-section">
          <h2 className="section-title">Featured Vehicles</h2>
          <div className="cars-grid">
            {filteredCars.map((car) => (
              <div
                key={car.objectId}
                className="car-card"
                onClick={() => navigate(`/product/${car.objectId}`)}
              >
                <div className="car-content">
                  <div className="car-image-wrapper">
                    <img src={car.Photo} alt={car.Model} className="car-image" />
                  </div>
                  <div className="car-details">
                    <h3 className="car-title">
                      {car.Make} {car.Model}
                    </h3>
                    <p className="car-category">{car.Category}</p>
                    <p className="car-price">${car.Prices}</p>
                    {car.Stock > 0 ? (
                      <button
                        onClick={(e) => handleAddToCart(car, e)}
                        className="add-to-cart-btn"
                      >
                        Add to Cart
                      </button>
                    ) : (
                      <button className="add-to-cart-btn disabled" disabled>
                        Out of Stock
                      </button>
                    )}
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