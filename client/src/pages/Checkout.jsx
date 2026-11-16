import React, { useState } from 'react';
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from 'react-router-dom';
import { FiCreditCard, FiCheckCircle } from 'react-icons/fi';
import './Checkout.css';

const Checkout = () => {
    const { cart, user } = useContext(AuthContext);
    const navigate = useNavigate();
    const [address, setAddress] = useState(user?.address || '');
    const [paymentMethod, setPaymentMethod] = useState('card');
    const [orderPlaced, setOrderPlaced] = useState(false);

    const cartTotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    const shipping = cartTotal > 999 ? 0 : 99;
    const total = cartTotal + shipping;

    const handlePlaceOrder = (e) => {
        e.preventDefault();
        setOrderPlaced(true);
        // Simulate API call
        setTimeout(() => {
            navigate('/order-success');
        }, 2000);
    };

    if (orderPlaced) {
        return (
            <div className="container section center-msg">
                <FiCheckCircle style={{ fontSize: '64px', color: '#27ae60', marginBottom: '24px' }} />
                <h1>Processing Payment...</h1>
                <p>Please do not close this window.</p>
            </div>
        );
    }

    return (
        <div className="container section checkout-page">
            <h1 className="section-title">Checkout</h1>

            <div className="checkout-layout">
                <div className="checkout-form-col">
                    {/* Address Section */}
                    <section className="checkout-card">
                        <h3>Shipping Address</h3>
                        <form id="checkout-form" onSubmit={handlePlaceOrder}>
                            <div className="form-group">
                                <label>Full Name</label>
                                <input type="text" defaultValue={user?.name} required />
                            </div>
                            <div className="form-group">
                                <label>Full Address</label>
                                <textarea
                                    rows="3"
                                    value={address}
                                    onChange={(e) => setAddress(e.target.value)}
                                    placeholder="Street Address, City, Zip Code"
                                    required
                                ></textarea>
                            </div>
                            <div className="form-group">
                                <label>Phone Number</label>
                                <input type="tel" defaultValue={user?.phone} required />
                            </div>
                        </form>
                    </section>

                    {/* Payment Section */}
                    <section className="checkout-card">
                        <h3>Payment Method</h3>
                        <div className="payment-options">
                            {/* Credit/Debit Card Option */}
                            <div className={`payment-option-container ${paymentMethod === 'card' ? 'active' : ''}`}>
                                <label className={`payment-option ${paymentMethod === 'card' ? 'selected' : ''}`}>
                                    <input
                                        type="radio"
                                        name="payment"
                                        value="card"
                                        checked={paymentMethod === 'card'}
                                        onChange={() => setPaymentMethod('card')}
                                    />
                                    <span className="radio-dot"></span>
                                    <div className="pay-content">
                                        <span className="pay-title">Credit / Debit Card</span>
                                        <p className="pay-desc">Visa, Mastercard, RuPay</p>
                                    </div>
                                    <FiCreditCard className="pay-icon" />
                                </label>
                                {paymentMethod === 'card' && (
                                    <div className="payment-details-form slide-down">
                                        <div className="form-group">
                                            <input type="text" placeholder="Card Number" maxLength="19" required />
                                        </div>
                                        <div className="form-row">
                                            <div className="form-group">
                                                <input type="text" placeholder="Valid Thru (MM/YY)" maxLength="5" required />
                                            </div>
                                            <div className="form-group">
                                                <input type="password" placeholder="CVV" maxLength="3" required />
                                            </div>
                                        </div>
                                        <div className="form-group">
                                            <input type="text" placeholder="Card Holder Name" required />
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* UPI Option */}
                            <div className={`payment-option-container ${paymentMethod === 'upi' ? 'active' : ''}`}>
                                <label className={`payment-option ${paymentMethod === 'upi' ? 'selected' : ''}`}>
                                    <input
                                        type="radio"
                                        name="payment"
                                        value="upi"
                                        checked={paymentMethod === 'upi'}
                                        onChange={() => setPaymentMethod('upi')}
                                    />
                                    <span className="radio-dot"></span>
                                    <div className="pay-content">
                                        <span className="pay-title">UPI / Wallet</span>
                                        <p className="pay-desc">Google Pay, PhonePe, Paytm</p>
                                    </div>
                                    <img src="https://cdn-icons-png.flaticon.com/128/2504/2504848.png" alt="UPI" style={{ width: '24px', opacity: 0.6 }} />
                                </label>
                                {paymentMethod === 'upi' && (
                                    <div className="payment-details-form slide-down">
                                        <div className="form-group">
                                            <input type="text" placeholder="Enter UPI ID (e.g. mobile@upi)" required pattern="[a-zA-Z0-9.\-_]{2,256}@[a-zA-Z]{2,64}" />
                                        </div>
                                        <button type="button" className="btn-verify">Verify</button>
                                    </div>
                                )}
                            </div>

                            {/* COD Option */}
                            <div className={`payment-option-container ${paymentMethod === 'cod' ? 'active' : ''}`}>
                                <label className={`payment-option ${paymentMethod === 'cod' ? 'selected' : ''}`}>
                                    <input
                                        type="radio"
                                        name="payment"
                                        value="cod"
                                        checked={paymentMethod === 'cod'}
                                        onChange={() => setPaymentMethod('cod')}
                                    />
                                    <span className="radio-dot"></span>
                                    <div className="pay-content">
                                        <span className="pay-title">Cash on Delivery</span>
                                        <p className="pay-desc">Pay safely upon delivery</p>
                                    </div>
                                </label>
                            </div>
                        </div>
                    </section>
                </div>

                {/* Order Summary */}
                <div className="checkout-summary-col">
                    <div className="checkout-summary-card">
                        <h3>Order Summary</h3>
                        <div className="summary-items-list">
                            {cart.map(item => (
                                <div key={`${item.id}-${item.size}`} className="summary-item">
                                    <span>{item.name} x {item.quantity}</span>
                                    <span>₹{(item.price * item.quantity).toLocaleString()}</span>
                                </div>
                            ))}
                        </div>
                        <div className="summary-divider"></div>
                        <div className="summary-row">
                            <span>Subtotal</span>
                            <span>₹{cartTotal.toLocaleString()}</span>
                        </div>
                        <div className="summary-row">
                            <span>Shipping</span>
                            <span>{shipping === 0 ? 'Free' : `₹${shipping}`}</span>
                        </div>
                        <div className="summary-divider"></div>
                        <div className="summary-row total">
                            <span>Payable Amount</span>
                            <span>₹{total.toLocaleString()}</span>
                        </div>

                        <button className="btn btn-primary full-width mt-4" type="submit" form="checkout-form">
                            Confirm & Pay
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Checkout;
