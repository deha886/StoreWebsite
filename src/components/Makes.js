import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const Makes = () => {
    const [makes, setMakes] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        axios.get("http://127.0.0.1:8000/makes/")
            .then(response => setMakes(response.data.makes))
            .catch(err => {
                setError("Error fetching car makes");
                console.error(err);
            });
    }, []);

    if (error) return <div>{error}</div>;

    return (
        <div>
            <h1>Car Makes</h1>
            <ul>
                {makes.map((make, index) => (
                    <li key={index}>
                        <Link to={`/make/${make}`}>{make}</Link>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Makes;
