import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, Link } from "react-router-dom";

const CarsByMake = () => {
    const { make } = useParams();
    const [cars, setCars] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        axios.get(`http://127.0.0.1:8000/makes/${make}/products`)
            .then(response => setCars(response.data))
            .catch(err => {
                setError("Error fetching cars for the selected make");
                console.error(err);
            });
    }, [make]);

    if (error) return <div>{error}</div>;

    return (
        <div>
            <h1>Cars for {make}</h1>
            <ul>
                {cars.map(car => (
                    <li key={car.objectId}>
                        <Link to={`/product/${car.objectId}`}>
                            {car.Model} ({car.Year})
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default CarsByMake;
