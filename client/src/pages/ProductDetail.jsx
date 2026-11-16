import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FiHeart, FiShoppingBag, FiRepeat, FiStar, FiMinus, FiPlus } from 'react-icons/fi';
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import ProductCard from '../components/ProductCard';
import productsData from '../data/products';
import './ProductDetail.css';

const ProductDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user, addToWishlist, addToCart, isInWishlist, removeFromWishlist } = useContext(AuthContext); // Context

    const [product, setProduct] = useState(null);
    const [selectedSize, setSelectedSize] = useState('');
    const [quantity, setQuantity] = useState(1);
    const [activeTab, setActiveTab] = useState('description');
    const [mainImage, setMainImage] = useState('');
    const [addedToCartEffect, setAddedToCartEffect] = useState(false);

    // Reset added to cart effect after 2 seconds
    useEffect(() => {
        if (addedToCartEffect) {
            const timer = setTimeout(() => {
                setAddedToCartEffect(false);
            }, 2000);
            return () => clearTimeout(timer);
        }
    }, [addedToCartEffect]);

    useEffect(() => {
        // Find product by ID
        const foundProduct = productsData.find(p => p.id === parseInt(id));
        if (foundProduct) {
            setProduct(foundProduct);
            setMainImage(foundProduct.image);
            // Default size selection
            if (foundProduct.filters?.size) setSelectedSize(foundProduct.filters.size);
        }
    }, [id]);

    if (!product) return <div className="container section">Product not found</div>;

    // Logic to find related products: Same Category, excluding current
    const relatedProducts = productsData.filter(p =>
        p.category === product.category && p.id !== product.id
    ).slice(0, 4);

    const isWishlisted = isInWishlist(product.id);

    const handleAddToWishlist = () => {
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

    const handleAddToCart = () => {
        // Validation for size if clothing? Assuming mock data has defaults or user picked
        // For simplicity, using selectedSize
        addToCart(product, quantity, selectedSize);
        setAddedToCartEffect(true);
        // Navigate to cart after a brief delay to show the effect
        setTimeout(() => {
            navigate('/cart');
        }, 500);
    };

    const incrementQty = () => setQuantity(q => q + 1);
    const decrementQty = () => setQuantity(q => (q > 1 ? q - 1 : 1));

    const isJewellery = product.gender === 'Jewellery' || product.category === 'Jewellery';

    return (
        <div className="product-detail-page container">
            <div className="product-layout">
                {/* Gallery */}
                <div className="product-gallery">
                    <div className="main-image-container">
                        <img src={mainImage} alt={product.name} className="main-image zoom-effect" />
                        <div className="overlay-icons-detail">
                            <button
                                onClick={handleAddToWishlist}
                                className={`overlay-icon ${isWishlisted ? 'active-wishlist' : ''}`}
                                title="Wishlist"
                            >
                                <FiHeart style={{ fill: isWishlisted ? 'currentColor' : 'none' }} />
                            </button>
                            <button onClick={() => document.getElementById('related-products').scrollIntoView({ behavior: 'smooth' })} className="overlay-icon" title="Similar Products">
                                <FiRepeat />
                            </button>
                        </div>
                    </div>
                    <div className="thumbnail-list">
                        {[product.image, product.image, product.image].map((img, idx) => (
                            <img
                                key={idx}
                                src={img}
                                alt={`Thumb ${idx}`}
                                className={`thumbnail ${mainImage === img ? 'active' : ''}`}
                                onClick={() => setMainImage(img)}
                            />
                        ))}
                    </div>
                </div>

                {/* Info */}
                <div className="product-info-section">
                    <div className="product-header-info">
                        <h1 className="p-title">{product.name}</h1>
                        <p className="p-category">{product.gender} / {product.category}</p>

                        <div className="p-price-box">
                            <span className="p-price">₹{product.price.toLocaleString()}</span>
                            {product.tags.includes('Sale') && <span className="p-discount-badge">10% OFF</span>}
                        </div>

                        <div className="p-rating">
                            <div className="stars">
                                <FiStar className="fill" />
                                <FiStar className="fill" />
                                <FiStar className="fill" />
                                <FiStar className="fill" />
                                <FiStar />
                            </div>
                            <span>(42 Reviews)</span>
                        </div>
                    </div>

                    <p className="p-description-short">
                        Experience premium quality with our {product.name}.
                        Designed for {product.gender === 'Jewellery' ? 'elegance' : 'comfort and style'}.
                    </p>

                    <div className="p-options">
                        {!isJewellery && (
                            <div className="option-group">
                                <label>Size</label>
                                <div className="size-selector">
                                    {['XS', 'S', 'M', 'L', 'XL', 'XXL'].map(size => (
                                        <button
                                            key={size}
                                            className={`size-btn ${selectedSize === size ? 'selected' : ''}`}
                                            onClick={() => setSelectedSize(size)}
                                        >
                                            {size}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {isJewellery && (
                            <div className="option-group">
                                <label>Material</label>
                                <div className="material-badge">{product.filters?.material || 'Premium Alloy'}</div>
                            </div>
                        )}
                    </div>

                    <div className="p-actions">
                        <div className="qty-selector">
                            <button onClick={decrementQty}><FiMinus /></button>
                            <span>{quantity}</span>
                            <button onClick={incrementQty}><FiPlus /></button>
                        </div>
                        <button className="btn btn-primary add-to-cart-btn" onClick={handleAddToCart}>
                            {addedToCartEffect ? 'Added to Cart!' : <><FiShoppingBag /> Add to Cart</>}
                        </button>
                    </div>

                    <div className="p-meta">
                        {product.filters?.sleeve && <p><strong>Sleeve:</strong> {product.filters.sleeve}</p>}
                        {product.filters?.neck && <p><strong>Neck:</strong> {product.filters.neck}</p>}
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div className="product-tabs-section">
                <div className="tabs-header">
                    <button className={activeTab === 'description' ? 'active' : ''} onClick={() => setActiveTab('description')}>Description</button>
                    <button className={activeTab === 'specs' ? 'active' : ''} onClick={() => setActiveTab('specs')}>Specifications</button>
                    <button className={activeTab === 'reviews' ? 'active' : ''} onClick={() => setActiveTab('reviews')}>Reviews</button>
                </div>
                <div className="tab-content">
                    {activeTab === 'description' && <p>Elevate your style with this stunning {product.name}. Crafted with attention to detail.</p>}
                    {activeTab === 'specs' && <ul><li>Quality: Premium</li><li>Origin: Imported</li></ul>}
                    {activeTab === 'reviews' && <p>No reviews yet.</p>}
                </div>
            </div>

            {/* Related */}
            <div id="related-products" className="related-products-section">
                <h2>Similar Products</h2>
                <div className="products-grid">
                    {relatedProducts.length > 0 ? relatedProducts.map(rp => (
                        <ProductCard key={rp.id} product={rp} />
                    )) : <p>No similar products found.</p>}
                </div>
            </div>
        </div>
    );
};

export default ProductDetail;
