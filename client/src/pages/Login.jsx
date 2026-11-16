import React, { useState } from 'react';
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        // Mock Login
        login(email, password);
        navigate('/profile'); // Redirect after login
    };

    return (
        <div className="container section" style={{ maxWidth: '400px' }}>
            <h2>Login</h2>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '24px' }}>
                <input
                    type="email"
                    placeholder="Email Address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    style={{ padding: '12px', border: '1px solid #ddd' }}
                    required
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    style={{ padding: '12px', border: '1px solid #ddd' }}
                    required
                />
                <button type="submit" className="btn btn-primary">Login</button>
            </form>
            <p style={{ marginTop: '16px', textAlign: 'center', fontSize: '14px' }}>
                Try any email & password to test mock login.
            </p>
        </div>
    );
};

export default Login;
