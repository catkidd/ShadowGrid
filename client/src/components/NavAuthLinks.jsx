import React, { useState, useEffect } from 'react';
import { Link, useLocation, Navigate, useNavigate, Routes, Route, BrowserRouter as Router } from 'react-router-dom';
import { ShoppingBag, Search, Layers, Zap, ArrowRight, Menu, X, ShieldCheck, Mail, Check, Star, Truck, RefreshCw } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useSearch } from '../context/SearchContext';
import { useAuth } from '../context/AuthContext';
import { API_URL } from '../lib/api';
import toast from 'react-hot-toast';

const NavAuthLinks = () => {
    const { user, isAdmin } = useAuth();
    
    return (
        <>
            <Link to="/about" className="text-white/70 hover:text-neon transition-colors text-xs font-black uppercase tracking-widest">About</Link>
            {isAdmin && <Link to="/admin/dashboard" className="text-neon hover:text-white transition-colors text-xs font-black uppercase tracking-widest">Admin</Link>}
            {!user ? (
                <Link to="/login" className="text-white/70 hover:text-neon transition-colors text-xs font-black uppercase tracking-widest">Login</Link>
            ) : null}
        </>
    );
};


export default NavAuthLinks;
