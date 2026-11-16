import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { FiCheckCircle } from 'react-icons/fi';

const OrderSuccess = () => {
    const navigate = useNavigate();
    const { clearCart } = useContext(AuthContext);
    const [orderId] = useState(() => `ORD-${Math.floor(1000 + Math.random() * 9000)}`);

    useEffect(() => {
        clearCart();
    }, [clearCart]);

    return (
        <div className="container section center-msg" style={{ minHeight: '60vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
            <FiCheckCircle style={{ fontSize: '80px', color: '#27ae60', marginBottom: '24px' }} />
            <h1 style={{ fontSize: '32px', marginBottom: '16px' }}>Order Placed Successfully!</h1>
            <p style={{ color: '#666', marginBottom: '32px' }}>
                Thank you for shopping with LUXE. Your order <strong>#{orderId}</strong> has been confirmed.
            </p>
            <div style={{ display: 'flex', gap: '16px' }}>
                <button className="btn btn-outline" onClick={() => navigate('/profile')}>View Order</button>
                <button className="btn btn-primary" onClick={() => navigate('/')}>Continue Shopping</button>
            </div>
        </div>
    );
};

export default OrderSuccess;
