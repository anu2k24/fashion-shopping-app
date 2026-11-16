import React, { useState } from 'react';
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { FiPackage, FiUser, FiMapPin, FiRefreshCw, FiLogOut } from 'react-icons/fi';
import './Profile.css';

const Profile = () => {
    const { user, logout } = useContext(AuthContext);
    const [activeTab, setActiveTab] = useState('dashboard');

    if (!user) {
        return <div className="container section">Please login to view profile.</div>;
    }

    // Mock Orders
    const orders = [
        { id: '#ORD-2831', date: 'Jan 5, 2026', total: 2499, status: 'Delivered', items: 2 },
        { id: '#ORD-2899', date: 'Jan 8, 2026', total: 1299, status: 'Processing', items: 1 }
    ];

    // Mock Returns
    const returns = [
        { id: '#RET-001', orderId: '#ORD-2400', date: 'Dec 20, 2025', status: 'Refunded' }
    ];

    const renderContent = () => {
        switch (activeTab) {
            case 'orders':
                return (
                    <div className="profile-content-card">
                        <h3>My Orders</h3>
                        <div className="orders-list">
                            {orders.map(order => (
                                <div key={order.id} className="order-item">
                                    <div className="order-header">
                                        <span className="order-id">{order.id}</span>
                                        <span className={`status-badge ${order.status.toLowerCase()}`}>{order.status}</span>
                                    </div>
                                    <div className="order-details">
                                        <p>Placed on: {order.date}</p>
                                        <p>Total: ₹{order.total}</p>
                                        <p>{order.items} Items</p>
                                    </div>
                                    <button className="btn-outline-sm">View Details</button>
                                </div>
                            ))}
                        </div>
                    </div>
                );
            case 'returns':
                return (
                    <div className="profile-content-card">
                        <h3>Returns & Refunds</h3>
                        <div className="orders-list">
                            {returns.map(ret => (
                                <div key={ret.id} className="order-item">
                                    <div className="order-header">
                                        <span className="order-id">{ret.id}</span>
                                        <span className={`status-badge ${ret.status.toLowerCase()}`}>{ret.status}</span>
                                    </div>
                                    <p>Order: {ret.orderId}</p>
                                    <p>Requested: {ret.date}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                );
            case 'dashboard':
            default:
                return (
                    <div className="profile-content-card">
                        <h3>Personal Information</h3>
                        <form className="profile-form">
                            <div className="form-group">
                                <label>Full Name</label>
                                <input type="text" defaultValue={user.name} />
                            </div>
                            <div className="form-group">
                                <label>Email Address</label>
                                <input type="email" defaultValue={user.email} disabled />
                            </div>
                            <div className="form-group">
                                <label>Phone Number</label>
                                <input type="tel" defaultValue={user.phone} />
                            </div>
                            <button className="btn btn-primary">Save Changes</button>
                        </form>
                    </div>
                );
        }
    };

    return (
        <div className="container section profile-page">
            <div className="profile-layout">
                <div className="profile-sidebar">
                    <div className="user-brief">
                        <div className="avatar-circle">{user.name.charAt(0)}</div>
                        <div>
                            <h4>{user.name}</h4>
                            <p>{user.email}</p>
                        </div>
                    </div>
                    <nav className="profile-nav">
                        <button
                            className={activeTab === 'dashboard' ? 'active' : ''}
                            onClick={() => setActiveTab('dashboard')}
                        >
                            <FiUser /> Personal Info
                        </button>
                        <button
                            className={activeTab === 'orders' ? 'active' : ''}
                            onClick={() => setActiveTab('orders')}
                        >
                            <FiPackage /> My Orders
                        </button>
                        <button
                            className={activeTab === 'returns' ? 'active' : ''}
                            onClick={() => setActiveTab('returns')}
                        >
                            <FiRefreshCw /> Returns
                        </button>
                        <button onClick={logout} className="logout-btn">
                            <FiLogOut /> Logout
                        </button>
                    </nav>
                </div>
                <div className="profile-main">
                    {renderContent()}
                </div>
            </div>
        </div>
    );
};

export default Profile;
