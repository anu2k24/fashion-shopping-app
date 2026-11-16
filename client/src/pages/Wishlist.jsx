import React from 'react';
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from 'react-router-dom';
import { FiTrash2, FiShoppingBag } from 'react-icons/fi';
import './Wishlist.css';

const Wishlist = () => {
    const { wishlist, removeFromWishlist, addToCart, user } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleMoveToCart = (product) => {
        addToCart(product);
        removeFromWishlist(product.id);
        navigate('/cart');
    };

    if (!user) {
        return (
            <div className="container section center-msg">
                <h2>Please Login</h2>
                <p>You need to be logged in to view your wishlist.</p>
                <button className="btn btn-primary mt-4" onClick={() => navigate('/login')}>Login</button>
            </div>
        );
    }

    if (wishlist.length === 0) {
        return (
            <div className="container section center-msg">
                <h2>Your Wishlist is Empty</h2>
                <p>Start saving your favorite items now!</p>
                <button className="btn btn-primary mt-4" onClick={() => navigate('/')}>Start Shopping</button>
            </div>
        );
    }

    return (
        <div className="container section wishlist-page">
            <h1 className="section-title">My Wishlist ({wishlist.length})</h1>

            <div className="wishlist-grid">
                {wishlist.map(product => (
                    <div key={product.id} className="wishlist-card">
                        <div className="wishlist-image">
                            <img src={product.image} alt={product.name} />
                            <button
                                className="remove-btn"
                                onClick={() => removeFromWishlist(product.id)}
                                title="Remove"
                            >
                                <FiTrash2 />
                            </button>
                        </div>
                        <div className="wishlist-details">
                            <h3>{product.name}</h3>
                            <p className="w-price">₹{product.price.toLocaleString()}</p>
                            <button className="btn btn-primary btn-sm btn-move" onClick={() => handleMoveToCart(product)}>
                                <FiShoppingBag /> Move to Cart
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Wishlist;
