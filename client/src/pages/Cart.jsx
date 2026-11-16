import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { FiTrash2, FiMinus, FiPlus, FiArrowRight, FiShoppingBag } from 'react-icons/fi';
import './Cart.css';

const Cart = () => {
    const { cart, updateQty, removeFromCart, clearCart, user } = useContext(AuthContext); // Added user
    const navigate = useNavigate();

    const cartTotal = useMemo(() => {
        return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    }, [cart]);

    const discount = 0; // Fixed logic for now or percentage
    const shipping = cartTotal > 999 ? 0 : 99;
    const finalTotal = cartTotal - discount + shipping;

    const handleCheckout = () => {
        if (!user) {
            navigate('/login');
        } else {
            navigate('/checkout');
        }
    };

    if (cart.length === 0) {
        return (
            <div className="container section center-msg">
                <div className="empty-cart-icon"><FiShoppingBag /></div>
                <h2>Your Cart is Empty</h2>
                <p>Looks like you haven't added anything to your cart yet.</p>
                <button className="btn btn-primary mt-4" onClick={() => navigate('/')}>Continue Shopping</button>
            </div>
        );
    }

    return (
        <div className="container section cart-page">
            <h1 className="section-title">Shopping Cart ({cart.length})</h1>

            <div className="cart-layout">
                <div className="cart-items">
                    <div className="cart-header-row">
                        <span>Product</span>
                        <span>Quantity</span>
                        <span>Total</span>
                    </div>

                    {cart.map((item) => (
                        <div key={`${item.id}-${item.size || 'default'}`} className="cart-item">
                            <div className="cart-product-info">
                                <img src={item.image} alt={item.name} />
                                <div>
                                    <h3>{item.name}</h3>
                                    <p className="item-meta">Size: {item.size || 'M'} | Color: Default</p>
                                    <p className="item-price">₹{item.price.toLocaleString()}</p>
                                </div>
                            </div>

                            <div className="cart-qty-ctrl">
                                <div className="qty-selector sm">
                                    <button onClick={() => updateQty(item.id, item.size || 'M', -1)} disabled={item.quantity <= 1}><FiMinus /></button>
                                    <span>{item.quantity}</span>
                                    <button onClick={() => updateQty(item.id, item.size || 'M', 1)}><FiPlus /></button>
                                </div>
                                <button className="remove-link" onClick={() => removeFromCart(item.id, item.size || 'M')}>
                                    <FiTrash2 /> Remove
                                </button>
                            </div>

                            <div className="cart-item-total">
                                ₹{(item.price * item.quantity).toLocaleString()}
                            </div>
                        </div>
                    ))}

                    <button className="btn-clear-cart" onClick={clearCart}>Clear Cart</button>
                </div>

                <div className="cart-summary">
                    <h3>Order Summary</h3>
                    <div className="summary-row">
                        <span>Subtotal</span>
                        <span>₹{cartTotal.toLocaleString()}</span>
                    </div>
                    <div className="summary-row">
                        <span>Discount</span>
                        <span>- ₹{discount}</span>
                    </div>
                    <div className="summary-row">
                        <span>Shipping</span>
                        <span>{shipping === 0 ? 'Free' : `₹${shipping}`}</span>
                    </div>
                    <div className="summary-row total">
                        <span>Total</span>
                        <span>₹{finalTotal.toLocaleString()}</span>
                    </div>

                    <button className="btn btn-primary full-width checkout-btn" onClick={handleCheckout}>
                        Proceed to Checkout <FiArrowRight />
                    </button>
                    <p className="secure-text">🔒 100% Secure Checkout</p>
                </div>
            </div>
        </div>
    );
};

export default Cart;
