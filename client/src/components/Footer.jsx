import React from 'react';
import './Footer.css';
import { FiInstagram, FiFacebook, FiTwitter, FiMessageCircle } from 'react-icons/fi';

const Footer = () => {
    return (
        <footer className="footer">
            <div className="container footer-container">
                <div className="footer-col">
                    <h3 className="footer-logo">LUXE.</h3>
                    <p className="footer-desc">
                        Redefining elegance for the modern era. Premium quality clothing and jewellery.
                    </p>
                    <div className="social-icons">
                        <FiInstagram />
                        <FiFacebook />
                        <FiTwitter />
                        <FiMessageCircle />
                    </div>
                </div>

                <div className="footer-col">
                    <h4>Shop</h4>
                    <ul>
                        <li>Women</li>
                        <li>Jewellery</li>
                        <li>Kids</li>
                        <li>New Arrivals</li>
                    </ul>
                </div>

                <div className="footer-col">
                    <h4>Support</h4>
                    <ul>
                        <li>Contact Us</li>
                        <li>FAQs</li>
                        <li>Shipping & Returns</li>
                        <li>Size Guide</li>
                    </ul>
                </div>

                <div className="footer-col">
                    <h4>Legal</h4>
                    <ul>
                        <li>Privacy Policy</li>
                        <li>Terms of Service</li>
                    </ul>
                </div>
            </div>
            <div className="footer-bottom">
                <p>&copy; 2026 LUXE Fashion. All rights reserved.</p>
            </div>
        </footer>
    );
};
export default Footer;
