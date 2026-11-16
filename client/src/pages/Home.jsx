import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiArrowRight } from 'react-icons/fi';
import axios from 'axios';
import './Home.css';

const Home = () => {
    const [newArrivals, setNewArrivals] = useState([]);

    useEffect(() => {
        const fetchNewArrivals = async () => {
            try {
                const res = await axios.get('http://localhost:5000/api/products');
                // Filter for products tagged "New" or just take the last 4 added (reverse)
                const sorted = res.data.reverse().slice(0, 4);
                setNewArrivals(sorted);
            } catch (error) {
                console.error("Error fetching new arrivals", error);
            }
        };
        fetchNewArrivals();
    }, []);

    const fadeInUp = {
        hidden: { opacity: 0, y: 40 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
    };

    const staggerContainer = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.2 } }
    };

    return (
        <div className="home-page">
            {/* Hero Section */}
            <section className="hero-section" style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1573408301185-9146fe634ad0?q=80&w=2075")' }}>
                {/* Visual Fix: Inline style for dynamic hero image if CSS doesn't support it easily, or just rely on CSS if it's there. 
                   The user asked for Jewellery Front Page Top. Let's make the Hero image a stunning Jewellery/Traditional model shot.
                   Image: Traditional Indian Jewellery Model or similar. 
                */}
                <div className="hero-overlay"></div>
                <div className="hero-content container">
                    <motion.div
                        initial="hidden"
                        animate="visible"
                        variants={staggerContainer}
                        className="hero-text-box"
                    >
                        <motion.p variants={fadeInUp} className="hero-subtitle">Tradition Meets Elegance</motion.p>
                        <motion.h1 variants={fadeInUp} className="hero-title">Timeless Beauty</motion.h1>
                        <motion.div variants={fadeInUp} className="hero-actions">
                            <Link to="/women" className="btn btn-primary">Shop Traditional</Link>
                            <Link to="/jewellery" className="btn btn-outline-light">View Jewellery</Link>
                        </motion.div>
                    </motion.div>
                </div>
            </section>n

            {/* Category Highlights */}
            <section className="section categories-section container">
                <div className="section-header">
                    <h2>Shop by Category</h2>
                    <p>Curated collections for every occasion</p>
                </div>
                <div className="categories-grid">
                    <Link to="/women" className="category-card tall">
                        {/* Women: Traditional Saree/Lehenga Image */}
                        <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRy71V4JOUzQ9tpYKjk5fajRkT1g10RHwJK4IQtCrebgQ&s=10" alt="women Traditional" />
                        <div className="category-overlay">
                            <h3>Women</h3>
                            <span className="shop-link">Explore <FiArrowRight /></span>
                        </div>
                    </Link>
                    <div className="category-column">
                        <Link to="/men" className="category-card">
                            {/* Men: Traditional Kurta/Sherwani Image */}
                            <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRct1Kr3TMCWRpCYehN2SAKivjuKCJNSe0bbg&s" alt="Men Traditional" />
                            <div className="category-overlay">
                                <h3>Men</h3>
                                <span className="shop-link">Explore <FiArrowRight /></span>
                            </div>
                        </Link>
                        <Link to="/kids" className="category-card">
                            {/* Kids: Traditional/Cute Image */}
                            <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ8LaNMGvtr3EwTDQjiW7mkdEKAEHHv04vsIA&s" alt="Kids Fashion" />
                            <div className="category-overlay">
                                <h3>Kids</h3>
                                <p className="text-sm text-white/90 mt-1">Comfort and fun for your little ones.</p>
                                <span className="shop-link">Explore <FiArrowRight /></span>
                            </div>
                        </Link>
                    </div>
                </div>
            </section>

            {/* New Arrivals (Horizontal Scroll) */}
            <section className="section new-arrivals-section">
                <div className="container">
                    <div className="section-header-row">
                        <h2>New Arrivals</h2>
                        <Link to="/new-arrivals" className="view-all">View All</Link>
                    </div>
                    <div className="product-scroll">
                        {newArrivals.map((product) => (
                            <Link to={`/product/${product.id}`} key={product.id} className="product-card">
                                <div className="product-image">
                                    <span className="badge-new">NEW</span>
                                    <img src={product.image} alt={product.name} />
                                    {/* <button className="btn-add-cart">Add to Cart</button> */}
                                </div>
                                <div className="product-info">
                                    <h4>{product.name}</h4>
                                    <p>₹{product.price.toLocaleString()}</p>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* Featured Jewellery Collection */}
            <section className="section featured-jewellery">
                <div className="container featured-layout">
                    <div className="featured-text">
                        <h2>Exquisite Jewellery</h2>
                        <p>Handcrafted pieces that define luxury. From diamond necklaces to gold bangles, find your perfect sparkle.</p>
                        <Link to="/jewellery" className="btn btn-primary">Discover Collection</Link>
                    </div>
                    <div className="featured-image">
                        {/* Detailed Jewellery Image */}
                        <img src="https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?q=80&w=1000" alt="Luxury Jewellery" />
                    </div>
                </div>
            </section>

            {/* Trust Badges */}
            <section className="trust-section">
                <div className="container trust-grid">
                    <div className="trust-item">
                        <h4>Secure Payment</h4>
                        <p>100% Secure Transactions</p>
                    </div>
                    <div className="trust-item">
                        <h4>Free Shipping</h4>
                        <p>On Orders Over $100</p>
                    </div>
                    <div className="trust-item">
                        <h4>Easy Returns</h4>
                        <p>30-Day Money Back</p>
                    </div>
                    <div className="trust-item">
                        <h4>24/7 Support</h4>
                        <p>Dedicated Support</p>
                    </div>
                </div>
            </section>
        </div>
    )
};

export default Home;
