import React from 'react';
import './App.css'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Loginpage from './Loginpage'; 
import Mainpage from './Mainpage';
import Cart from './Cart';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/login" element={<Loginpage />} />
          <Route path="/main" element={<Mainpage />} />
          <Route path="/cart" element={<Cart />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
