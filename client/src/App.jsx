import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import ShopCategory from './pages/ShopCategory';
import ProductDetail from './pages/ProductDetail';
import Profile from './pages/Profile';
import Wishlist from './pages/Wishlist';
import Login from './pages/Login';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import OrderSuccess from './pages/OrderSuccess';
import { AuthProvider } from './context/AuthContext';

import Chatbox from './components/Chatbox';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/men" element={<ShopCategory category="men" />} />
            <Route path="/women" element={<ShopCategory category="women" />} />
            <Route path="/kids" element={<ShopCategory category="kids" />} />
            <Route path="/jewellery" element={<ShopCategory category="jewellery" />} />
            <Route path="/new-arrivals" element={<ShopCategory category="new-arrivals" />} />
            <Route path="/offers" element={<ShopCategory category="offers" />} />
            <Route path="/product/:id" element={<ProductDetail />} />

            <Route path="/login" element={<Login />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/wishlist" element={<Wishlist />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/order-success" element={<OrderSuccess />} />

            <Route path="*" element={<Home />} />
          </Routes>
          <Chatbox />
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
