import React from 'react';
import './App.css'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Loginpage from './Loginpage'; 
import Mainpage from './Mainpage';
import Cart from './Cart';
import ProductDetail from './ProductDetail';
import OrdersPage from './OrdersPage';
import Admin from './Admin';
import Signuppage from './Signuppage';
import InvoicePage from './InvoicePage';


function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/login" element={<Loginpage />} />
          <Route path="/main" element={<Mainpage />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/product/:id" element={<ProductDetail />} /> 
          <Route path="/orders" element={<OrdersPage />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/signup" element={<Signuppage />} />
          <Route path="/invoice" element={<InvoicePage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;