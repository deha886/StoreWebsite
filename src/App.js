import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Makes from "./components/Makes";
import CarsByMake from "./components/CarsByMake";
import ProductCard from "./components/ProductCard";
import Payment from "./components/Payment";

const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Makes />} />
                <Route path="/make/:make" element={<CarsByMake />} />
                <Route path="/product/:id" element={<ProductCard />} />
                <Route path="/payment" element={<Payment />} />
            </Routes>
        </Router>
    );
};

export default App;
