import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FiHeart, FiShoppingBag, FiRepeat } from 'react-icons/fi';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import './ProductCard.css';

const ProductCard = ({ product }) => {
    const navigate = useNavigate();
    const { user, addToWishlist, removeFromWishlist, isInWishlist } = useContext(AuthContext);

    const isWishlisted = isInWishlist(product.id);

    const handleCardClick = () => {
        navigate(`/product/${product.id}`);
    };

    const handleWishlistClick = (e) => {
        e.stopPropagation();
        if (!user) {
            navigate('/login');
        } else {
            if (isWishlisted) {
                removeFromWishlist(product.id);
            } else {
                addToWishlist(product);
            }
        }
    };

    const handleSimilarClick = (e) => {
        e.stopPropagation();
        navigate(`/product/${product.id}#related-products`);
    };

    const handleAddToCart = (e) => {
        e.stopPropagation();
        // Logic to add to cart
        console.log("Added to cart:", product.name);
    };

    return (
        <div className="product-card-grid" onClick={handleCardClick}>
            <div className="product-image-container">
                {product.tags && product.tags.length > 0 && (
                    <div className="product-tags">
                        {product.tags.map(tag => <span key={tag} className="tag">{tag}</span>)}
                    </div>
                )}
                <img src={product.image} alt={product.name} loading="lazy" />

                {/* Overlay Icons */}
                <div className="card-overlay-icons">
                    <button
                        className={`icon-btn-overlay ${isWishlisted ? 'active-wishlist' : ''}`}
                        onClick={handleWishlistClick}
                        title={isWishlisted ? "Remove from Wishlist" : "Add to Wishlist"}
                    >
                        <FiHeart style={{ fill: isWishlisted ? 'currentColor' : 'none' }} />
                    </button>
                    <button
                        className="icon-btn-overlay"
                        onClick={handleSimilarClick}
                        title="Similar Products"
                    >
                        <FiRepeat />
                    </button>
                </div>

                {/* Add to Cart */}
                <div className="card-actions-bottom">
                    <button className="action-btn-cart" onClick={handleAddToCart} title="Add to Cart">
                        <FiShoppingBag />
                    </button>
                </div>
            </div>
            <div className="product-details">
                <h3 className="product-name">{product.name}</h3>
                <p className="product-category">{product.category}</p>
                <div className="product-price">
                    ₹{product.price.toLocaleString()}
                </div>
            </div>
        </div>
    );
};

export default ProductCard;
