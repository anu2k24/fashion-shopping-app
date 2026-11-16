import React, { createContext, useState, useEffect, useCallback } from 'react';

const AuthContext = createContext();

export { AuthContext };

export const AuthProvider = ({ children }) => {
    // Mock User State
    const [user, setUser] = useState(null);
    // Cart State
    const [cart, setCart] = useState([]);
    const [wishlist, setWishlist] = useState([]);

    // Load initial state (mock persistence)
    useEffect(() => {
        try {
            const savedUser = localStorage.getItem('user');
            if (savedUser) setUser(JSON.parse(savedUser));
        } catch (e) {
            console.error("Failed to parse user", e);
            localStorage.removeItem('user');
        }

        try {
            const savedWishlist = localStorage.getItem('wishlist');
            if (savedWishlist) setWishlist(JSON.parse(savedWishlist));
        } catch (e) {
            console.error("Failed to parse wishlist", e);
            localStorage.removeItem('wishlist');
        }

        try {
            const savedCart = localStorage.getItem('cart');
            if (savedCart) setCart(JSON.parse(savedCart));
        } catch (e) {
            console.error("Failed to parse cart", e);
            localStorage.removeItem('cart');
        }
    }, []);

    useEffect(() => {
        if (user) {
            localStorage.setItem('user', JSON.stringify(user));
            localStorage.setItem('wishlist', JSON.stringify(wishlist));
        } else {
            localStorage.removeItem('user');
            localStorage.removeItem('wishlist');
        }
        localStorage.setItem('cart', JSON.stringify(cart));
    }, [user, wishlist, cart]);

    // eslint-disable-next-line no-unused-vars
    const login = useCallback((email, _password) => {
        // Mock login
        const mockUser = {
            name: 'Ananya Sharma',
            email: email,
            phone: '+91 98765 43210',
            address: '123, Fashion Street, Mumbai, 400001'
        };
        setUser(mockUser);
        return true;
    }, []);

    const logout = () => {
        setUser(null);
        setWishlist([]);
        setCart([]);
        localStorage.removeItem('cart');
    };

    const addToWishlist = (product) => {
        if (!wishlist.find(item => item.id === product.id)) {
            setWishlist([...wishlist, product]);
        }
    };

    const removeFromWishlist = (productId) => {
        setWishlist(wishlist.filter(item => item.id !== productId));
    };

    const isInWishlist = (productId) => {
        return wishlist.some(item => item.id === productId);
    };

    // Cart Functions
    const addToCart = (product, quantity = 1, size = 'M') => {
        setCart(prevCart => {
            const existingItem = prevCart.find(item => item.id === product.id && item.size === size);
            if (existingItem) {
                return prevCart.map(item =>
                    (item.id === product.id && item.size === size)
                        ? { ...item, quantity: item.quantity + quantity }
                        : item
                );
            }
            return [...prevCart, { ...product, quantity, size }];
        });
    };

    const removeFromCart = (itemId, size) => {
        const itemSize = size || 'M';
        setCart(prevCart => prevCart.filter(item => {
            const cartItemSize = item.size || 'M';
            return !(item.id === itemId && cartItemSize === itemSize);
        }));
    };

    const updateQty = (itemId, size, amount) => {
        const itemSize = size || 'M';
        setCart(prevCart => prevCart.map(item => {
            const cartItemSize = item.size || 'M';
            if (item.id === itemId && cartItemSize === itemSize) {
                const newQty = item.quantity + amount;
                return { ...item, quantity: newQty > 0 ? newQty : 1 };
            }
            return item;
        }));
    };

    const clearCart = () => {
        setCart([]);
    };

    return (
        <AuthContext.Provider value={{
            user,
            wishlist,
            cart,
            login,
            logout,
            addToWishlist,
            removeFromWishlist,
            isInWishlist,
            addToCart,
            removeFromCart,
            updateQty,
            clearCart
        }}>
            {children}
        </AuthContext.Provider>
    );
};

   
