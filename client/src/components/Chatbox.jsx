import React, { useState, useRef, useEffect, useCallback } from 'react';
import { MessageCircle, X, Send, Bot, User, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import './Chatbox.css';

/**
 * Chatbox Component - AI-Powered Product Search
 * Features:
 * - Floating toggle button
 * - Chat window with user/bot messages
 * - Typing indicator
 * - Inline product cards (top 3 results)
 * - Loading state
 * - Auto-scroll
 * - Chat history maintained in session
 */

const API_BASE_URL = 'http://localhost:5000';

const Chatbox = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        {
            id: 'welcome',
            text: "Hi! I'm your AI shopping assistant. Ask me anything like:\n• men tshirt under 1000\n• women earrings above 2000\n• kids jeans 1000-2000",
            isBot: true,
            products: [],
        }
    ]);
    const [inputValue, setInputValue] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);
    const inputRef = useRef(null);

    // Auto-scroll to bottom on new messages
    const scrollToBottom = useCallback(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, []);

    useEffect(() => {
        scrollToBottom();
    }, [messages, isLoading, scrollToBottom]);

    // Focus input when chat opens
    useEffect(() => {
        if (isOpen) {
            setTimeout(() => inputRef.current?.focus(), 100);
        }
    }, [isOpen]);

    const handleSend = async (e) => {
        e.preventDefault();
        if (!inputValue.trim() || isLoading) return;

        const userQuery = inputValue.trim();
        const userMessageId = `user-${Date.now()}`;

        // Add user message
        setMessages((prev) => [
            ...prev,
            { id: userMessageId, text: userQuery, isBot: false, products: [] },
        ]);
        setInputValue('');
        setIsLoading(true);

        try {
            const res = await fetch(`${API_BASE_URL}/api/product/search`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
        query: userQuery,
        sortBy: "price_low"
    }),
});

            if (!res.ok) {
                throw new Error(`Server error: ${res.status}`);
            }

        const data = await res.json();

console.log("API RESPONSE:", data); 

            const botMessageId = `bot-${Date.now()}`;
            const botMessage = {
                id: botMessageId,
                text: data.message || 'Here are your results:',
                isBot: true,
                products: (data.products || []).slice(0, 3), // Show top 3 products inline
                filters: data.filters || null,
            };

            setMessages((prev) => [...prev, botMessage]);
        } catch (error) {
            console.error('Chat search error:', error);
            setMessages((prev) => [
                ...prev,
                {
                    id: `bot-err-${Date.now()}`,
                    text: '❌ Something went wrong. Please try again.',
                    isBot: true,
                    products: [],
                },
            ]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend(e);
        }
    };

    const handleProductClick = (productId) => {
        window.location.href = `/product/${productId}`;
    };

    return (
        <div className="chatbox-container">
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        className="chat-window"
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        transition={{ duration: 0.25, ease: 'easeOut' }}
                    >
                        {/* Header */}
                        <div className="chat-header">
                            <div className="chat-header-info">
                                <div className="chat-header-icon">
                                    <Bot size={20} />
                                </div>
                                <div>
                                    <h4>AI Shopping Assistant</h4>
                                    <span className="chat-header-status">Online</span>
                                </div>
                            </div>
                            <button
                                className="chat-close-btn"
                                onClick={() => setIsOpen(false)}
                                aria-label="Close chat"
                            >
                                <X size={18} />
                            </button>
                        </div>

                        {/* Messages */}
                        <div className="chat-messages">
                            {messages.map((msg) => (
                                <div key={msg.id} className={`message-group ${msg.isBot ? 'bot' : 'user'}`}>
                                    <div className={`message-avatar ${msg.isBot ? 'bot' : 'user'}`}>
                                        {msg.isBot ? <Bot size={14} /> : <User size={14} />}
                                    </div>
                                    <div className="message-content">
                                        <div className={`message-bubble ${msg.isBot ? 'bot' : 'user'}`}>
                                            {msg.text.split('\n').map((line, idx) => (
                                                <span key={idx}>
                                                    {line}
                                                    <br />
                                                </span>
                                            ))}
                                        </div>

                                        {/* Inline Product Cards */}
                                        {msg.isBot && msg.products && msg.products.length > 0 && (
                                            <div className="chat-product-cards">
                                                {msg.products.map((product) => (
                                                    <div
                                                        key={product.id}
                                                        className="chat-product-card"
                                                        onClick={() => handleProductClick(product.id)}
                                                        role="button"
                                                        tabIndex={0}
                                                        onKeyDown={(e) => {
                                                            if (e.key === 'Enter') handleProductClick(product.id);
                                                        }}
                                                    >
                                                        <img
                                                        src={product.image || "https://via.placeholder.com/80"}
                                                            alt={product.name}
                                                            className="chat-product-image"
                                                            loading="lazy"
                                                        />
                                                        <div className="chat-product-info">
                                                            <p className="chat-product-name">{product.name}</p>
                                                            <p className="chat-product-price">
                                                                ₹{product.price?.toLocaleString()}
                                                            </p>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}

                            {/* Typing Indicator */}
                            {isLoading && (
                                <div className="message-group bot">
                                    <div className="message-avatar bot">
                                        <Bot size={14} />
                                    </div>
                                    <div className="message-content">
                                        <div className="typing-indicator">
                                            <span></span>
                                            <span></span>
                                            <span></span>
                                        </div>
                                    </div>
                                </div>
                            )}

                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input */}
                        <form className="chat-input" onSubmit={handleSend}>
                            <input
                                ref={inputRef}
                                type="text"
                                placeholder="Search like: men tshirt under 1000"
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                onKeyDown={handleKeyDown}
                                disabled={isLoading}
                            />
                            <button
                                type="submit"
                                disabled={isLoading || !inputValue.trim()}
                                aria-label="Send message"
                            >
                                {isLoading ? (
                                    <Loader2 size={18} className="spin-loader" />
                                ) : (
                                    <Send size={18} />
                                )}
                            </button>
                        </form>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Toggle Button */}
            {!isOpen && (
                <motion.button
                    className="chat-toggle-btn"
                    onClick={() => setIsOpen(true)}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    aria-label="Open chat"
                >
                    <MessageCircle size={28} />
                </motion.button>
            )}
        </div>
    );
};

export default Chatbox;

