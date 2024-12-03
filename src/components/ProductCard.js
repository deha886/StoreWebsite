import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

const ProductCard = () => {
    const { id } = useParams();
    const [car, setCar] = useState(null);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        axios.get(`http://127.0.0.1:8000/products/${id}`)
            .then(response => setCar(response.data))
            .catch(err => {
                setError("Error fetching car details");
                console.error(err);
            });
    }, [id]);

    if (error) return <div>{error}</div>;
    if (!car) return <div>Loading...</div>;

    return (
        <div>
            <h1>{car.Make} {car.Model}</h1>
            <p>ProductID: {car.objectId}</p>
            <p>Year: {car.Year}</p>
            <p>Category: {car.Category}</p>
            <p>Price: ${car.Prices}</p>
            <p>Stock: {car.Stock}</p>
            <button onClick={() => navigate("/payment")}>BUY</button>
        </div>
    );
};

export default ProductCard;
