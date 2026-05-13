import React, { useState, useEffect } from 'react';
import { Link, useLocation, Navigate, useNavigate, Routes, Route, BrowserRouter as Router } from 'react-router-dom';
import { ShoppingBag, Search, Layers, Zap, ArrowRight, Menu, X, ShieldCheck, Mail, Check, Star, Truck, RefreshCw } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useSearch } from '../context/SearchContext';
import { useAuth } from '../context/AuthContext';
import { API_URL } from '../lib/api';
import toast from 'react-hot-toast';

import FadeInUp from './FadeInUp';
import Home from '../pages/Home';
import ProductDetail from '../pages/ProductDetail';
import About from '../pages/About';
import PrivacyPolicy from '../pages/PrivacyPolicy';
import TermsOfService from '../pages/TermsOfService';
import Protocols from '../pages/Protocols';
import Maintenance from '../pages/Maintenance';
import ShippingReturns from '../pages/ShippingReturns';
import PaymentMethods from '../pages/PaymentMethods';
import Contact from '../pages/Contact';
import Login from '../pages/Login';
import Signup from '../pages/Signup';
import Checkout from '../pages/Checkout';
import AdminDashboard from '../pages/AdminDashboard';
import ProtectedRoute from './ProtectedRoute';

const AnimatedRoutes = () => {
    const location = useLocation();
    return (
        <FadeInUp key={location.pathname} className="flex-1 flex flex-col w-full h-full">
            <Routes location={location}>
                <Route path="/" element={<Home preFilter="All" />} />
                <Route path="/keyboards" element={<Home preFilter="Keyboards" />} />
                <Route path="/precision" element={<Home preFilter="Mice" />} />
                <Route path="/displays" element={<Home preFilter="Displays" />} />
                <Route path="/product/:id" element={<ProductDetail />} />
                <Route path="/about" element={<About />} />
                <Route path="/privacy" element={<PrivacyPolicy />} />
                <Route path="/terms" element={<TermsOfService />} />
                <Route path="/protocols" element={<Protocols />} />
                <Route path="/maintenance" element={<Maintenance />} />
                <Route path="/shipping" element={<ShippingReturns />} />
                <Route path="/payments" element={<PaymentMethods />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route 
                    path="/admin/dashboard" 
                    element={
                        <ProtectedRoute>
                            <AdminDashboard />
                        </ProtectedRoute>
                    } 
                />
            </Routes>
        </FadeInUp>
    );
};


export default AnimatedRoutes;
