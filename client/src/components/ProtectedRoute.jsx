import React, { useState, useEffect } from 'react';
import { Link, useLocation, Navigate, useNavigate, Routes, Route, BrowserRouter as Router } from 'react-router-dom';
import { ShoppingBag, Search, Layers, Zap, ArrowRight, Menu, X, ShieldCheck, Mail, Check, Star, Truck, RefreshCw } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useSearch } from '../context/SearchContext';
import { useAuth } from '../context/AuthContext';
import { API_URL } from '../lib/api';
import toast from 'react-hot-toast';

const ProtectedRoute = ({ children }) => {
    const { isAdmin, loading } = useAuth();
    if (loading) return <div className="min-h-screen flex items-center justify-center text-neon font-mono uppercase tracking-[0.3em]">Checking Authorization...</div>;
    if (!isAdmin) return <Navigate to="/login" replace />;
    return children;
};


export default ProtectedRoute;
