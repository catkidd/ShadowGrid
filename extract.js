const fs = require('fs');
const path = require('path');

const srcPath = path.join(__dirname, 'client', 'src');
const appJsxPath = path.join(srcPath, 'App.jsx');
const lines = fs.readFileSync(appJsxPath, 'utf8').split('\n');

const components = [
    { name: 'Home', type: 'pages', start: 27, end: 284 },
    { name: 'Layout', type: 'components', start: 285, end: 559 },
    { name: 'ProtectedRoute', type: 'components', start: 560, end: 566 },
    { name: 'AnimatedRoutes', type: 'components', start: 567, end: 600 },
    { name: 'NavAuthLinks', type: 'components', start: 650, end: 663 },
    { name: 'NavProfile', type: 'components', start: 664, end: 686 },
    { name: 'MobileNavAuthLinks', type: 'components', start: 687, end: 715 }
];

for (const comp of components) {
    const componentCode = lines.slice(comp.start, comp.end + 1).join('\n');
    const destPath = path.join(srcPath, comp.type, `${comp.name}.jsx`);
    
    let componentImports = `import React, { useState, useEffect } from 'react';
import { Link, useLocation, Navigate, useNavigate, Routes, Route, BrowserRouter as Router } from 'react-router-dom';
import { ShoppingBag, Search, Layers, Zap, ArrowRight, Menu, X, ShieldCheck, Mail, Check, Star, Truck, RefreshCw } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useSearch } from '../context/SearchContext';
import { useAuth } from '../context/AuthContext';
import { API_URL } from '../lib/api';
import toast from 'react-hot-toast';\n\n`;

    if (comp.name === 'Home') {
        componentImports += `import ProductCard from '../components/ProductCard';\nimport FadeInUp from '../components/FadeInUp';\n\n`;
    } else if (comp.name === 'Layout') {
        componentImports += `import FadeInUp from './FadeInUp';\nimport NavAuthLinks from './NavAuthLinks';\nimport MobileNavAuthLinks from './MobileNavAuthLinks';\nimport NavProfile from './NavProfile';\nimport CartModal from './CartModal';\n\n`;
    } else if (comp.name === 'AnimatedRoutes') {
        componentImports += `import FadeInUp from './FadeInUp';\nimport Home from '../pages/Home';\nimport ProductDetail from '../pages/ProductDetail';\nimport About from '../pages/About';\nimport PrivacyPolicy from '../pages/PrivacyPolicy';\nimport TermsOfService from '../pages/TermsOfService';\nimport Protocols from '../pages/Protocols';\nimport Maintenance from '../pages/Maintenance';\nimport ShippingReturns from '../pages/ShippingReturns';\nimport PaymentMethods from '../pages/PaymentMethods';\nimport Contact from '../pages/Contact';\nimport Login from '../pages/Login';\nimport Signup from '../pages/Signup';\nimport Checkout from '../pages/Checkout';\nimport AdminDashboard from '../pages/AdminDashboard';\nimport ProtectedRoute from './ProtectedRoute';\n\n`;
    }

    const fileContent = componentImports + componentCode + `\n\nexport default ${comp.name};\n`;
    fs.writeFileSync(destPath, fileContent);
    console.log(`Extracted ${comp.name}`);
}

// App remains in App.jsx, rewrite it
const appImports = `import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { SearchProvider } from './context/SearchProvider';
import { CartProvider } from './context/CartContext';
import ScrollToTop from './components/ScrollToTop';
import Layout from './components/Layout';
import AnimatedRoutes from './components/AnimatedRoutes';\n\n`;

const appCode = lines.slice(601, 649).join('\n');
const appFileContent = appImports + appCode + `\n\nexport default App;\n`;
fs.writeFileSync(appJsxPath, appFileContent);
console.log('App.jsx rewritten');
