import React, { useState, useEffect } from 'react';
import { Link, useLocation, Navigate, useNavigate, Routes, Route, BrowserRouter as Router } from 'react-router-dom';
import { ShoppingBag, Search, Layers, Zap, ArrowRight, Menu, X, ShieldCheck, Mail, Check, Star, Truck, RefreshCw } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useSearch } from '../context/SearchContext';
import { useAuth } from '../context/AuthContext';
import { API_URL } from '../lib/api';
import toast from 'react-hot-toast';

const NavProfile = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    if (!user) return null;

    const handleLogout = () => {
        logout();
        toast.success('Logged out successfully.');
        navigate('/login');
    };

    return (
        <button 
            onClick={handleLogout}
            className="hidden md:flex items-center gap-2 px-3 py-1 bg-white/5 border border-white/10 rounded-full hover:border-red-500/30 hover:text-red-400 transition-all group"
            title="Logout"
        >
            <ShieldCheck size={14} className="text-neon group-hover:text-red-400" />
            <span className="text-[10px] font-mono uppercase tracking-widest">{user.email.split('@')[0]}</span>
        </button>
    );
};


export default NavProfile;
