const fs = require('fs');
const path = require('path');

const srcPath = path.join(__dirname, 'client', 'src');
const appJsxPath = path.join(srcPath, 'App.jsx');
const content = fs.readFileSync(appJsxPath, 'utf8');

const componentsToExtract = [
    { name: 'Home', type: 'pages' },
    { name: 'Layout', type: 'components' },
    { name: 'ProtectedRoute', type: 'components' },
    { name: 'AnimatedRoutes', type: 'components' },
    { name: 'NavAuthLinks', type: 'components' },
    { name: 'NavProfile', type: 'components' },
    { name: 'MobileNavAuthLinks', type: 'components' }
];

let remainingApp = content;
let appImports = `import Home from './pages/Home';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import AnimatedRoutes from './components/AnimatedRoutes';
import NavAuthLinks from './components/NavAuthLinks';
import NavProfile from './components/NavProfile';
import MobileNavAuthLinks from './components/MobileNavAuthLinks';\n\n`;

for (const comp of componentsToExtract) {
    const startRegex = new RegExp(`const ${comp.name} = .*?=>\\s*[{|\\(]`);
    const match = remainingApp.match(startRegex);
    if (!match) {
        console.log(`Could not find start of ${comp.name}`);
        continue;
    }

    const startIndex = match.index;
    let braceCount = 0;
    let endIndex = startIndex;
    let foundStart = false;

    // Scan forward to count braces
    for (let i = startIndex; i < remainingApp.length; i++) {
        const char = remainingApp[i];
        if (char === '{' || char === '(') {
            braceCount++;
            foundStart = true;
        } else if (char === '}' || char === ')') {
            braceCount--;
        }

        if (foundStart && braceCount === 0) {
            // Find the trailing semicolon if it exists
            endIndex = i;
            if (remainingApp[i + 1] === ';') {
                endIndex++;
            }
            break;
        }
    }

    const componentCode = remainingApp.substring(startIndex, endIndex + 1);
    
    // Generate file contents
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

    // Remove from remainingApp
    remainingApp = remainingApp.substring(0, startIndex) + remainingApp.substring(endIndex + 1);
}

// Add the imports back to remainingApp, at the very beginning of the file, right after existing imports
const existingImportsMatch = remainingApp.match(/import.*?;\n/g);
if (existingImportsMatch) {
    const lastImportIndex = remainingApp.lastIndexOf(existingImportsMatch[existingImportsMatch.length - 1]);
    const afterLastImportIndex = lastImportIndex + existingImportsMatch[existingImportsMatch.length - 1].length;
    
    remainingApp = remainingApp.substring(0, afterLastImportIndex) + "\n" + appImports + remainingApp.substring(afterLastImportIndex);
}

// Cleanup excessive newlines
remainingApp = remainingApp.replace(/\n{3,}/g, '\n\n');

fs.writeFileSync(appJsxPath, remainingApp);
console.log("App split completed!");
