import React, { useState, useEffect } from 'react';
import { Link, useLocation, Navigate, useNavigate, Routes, Route, BrowserRouter as Router } from 'react-router-dom';
import { ShoppingBag, Search, Layers, Zap, ArrowRight, Menu, X, ShieldCheck, Mail, Check, Star, Truck, RefreshCw } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useSearch } from '../context/SearchContext';
import { useAuth } from '../context/AuthContext';
import { API_URL } from '../lib/api';
import toast from 'react-hot-toast';

const MobileNavAuthLinks = ({ closeMenu }) => {
    const { user, logout, isAdmin } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        toast.success('Logged out successfully.');
        closeMenu();
        navigate('/login');
    };

    return (
        <>
            <Link to="/about" className="text-white/60 hover:text-neon transition-colors py-2" onClick={closeMenu}>About</Link>
            {isAdmin && <Link to="/admin/dashboard" className="text-neon hover:text-white transition-colors py-2" onClick={closeMenu}>Admin</Link>}
            {!user ? (
                <Link to="/login" className="text-white hover:text-neon transition-colors py-2" onClick={closeMenu}>Login</Link>
            ) : (
                <button 
                    onClick={handleLogout}
                    className="text-left text-red-400 hover:text-red-300 transition-colors py-2 uppercase text-xs font-bold tracking-widest"
                >
                    Logout
                </button>
            )}
        </>
    );
};


export default MobileNavAuthLinks;
