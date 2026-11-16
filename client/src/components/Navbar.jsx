import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { FiSearch, FiHeart, FiShoppingBag, FiUser, FiMenu, FiX } from 'react-icons/fi';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const { user, wishlist, cart } = useContext(AuthContext); // Get user, wishlist, cart from context

    const toggleMenu = () => setIsOpen(!isOpen);

    return (
        <nav className="navbar">
            <div className="navbar-container">
                {/* Mobile Menu Icon */}
                <div className="mobile-menu-icon" onClick={toggleMenu}>
                    {isOpen ? <FiX /> : <FiMenu />}
                </div>

               <Link to='/' className='navbar-logo'>LUXE</Link>
               

                {/* Desktop Menu */}
                <ul className={isOpen ? "nav-menu active" : "nav-menu"}>
                      <li className="nav-item">
                        <NavLink to="/" className="nav-links" onClick={toggleMenu}>Home</NavLink>
                    </li>
                    <li className="nav-item">
                        <NavLink to="/men" className="nav-links" onClick={toggleMenu}>Men</NavLink>
                    </li>
                      <li className="nav-item">
                        <NavLink to="/women" className="nav-links" onClick={toggleMenu}>Women</NavLink>
                    </li>
                    <li className="nav-item">
                        <NavLink to="/jewellery" className="nav-links" onClick={toggleMenu}>Jewellery</NavLink>
                    </li>
                    <li className="nav-item">
                        <NavLink to="/kids" className="nav-links" onClick={toggleMenu}>Kids</NavLink>
                    </li>
                    <li className="nav-item">
                        <NavLink to="/new-arrivals" className="nav-links" onClick={toggleMenu}>New Arrivals</NavLink>
                    </li>
                    <li className="nav-item">
                        <NavLink to="/offers" className="nav-links highlight" onClick={toggleMenu}>Offers</NavLink>
                    </li>
                </ul>

                {/* Icons */}
                <div className="nav-icons">
                    <div className="icon-group">
                        <FiSearch className="nav-icon"/>
                    </div>
                    <Link to="/wishlist" className="icon-group">
                        <div style={{ position: 'relative' }}>
                            <FiHeart className="nav-icon" />
                            {wishlist.length > 0 && <span className="cart-badge">{wishlist.length}</span>}
                        </div> 
                    </Link>
                    <Link to="/cart" className="icon-group">
                        <div style={{ position: 'relative' }}>
                            <FiShoppingBag  className="nav-icon" />
                            {cart && cart.length > 0 && <span className="cart-badge">{cart.length}</span>}
                        </div>
                    </Link>
                    {/* Link to Profile if logged in, else Login */}
                    <Link to={user ? "/profile" : "/login"} className="icon-group">
                        <FiUser className={`nav-icon ${user ? 'active-user' : ''}`} style={{ color: user ? 'var(--primary)' : '' }} />
                    </Link>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
