import React from "react";
import { Link } from "react-router-dom";

const ErrorPage = () => {
    return (
        <div className="app">
            <h3>You have not provided your Details. Head back to <Link to="/">Home</Link>.</h3>
        </div>
    );
};

export default ErrorPage;