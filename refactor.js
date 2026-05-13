const fs = require('fs');
const path = require('path');

const srcPath = path.join(__dirname, 'client', 'src');
const appJsxPath = path.join(srcPath, 'App.jsx');
const content = fs.readFileSync(appJsxPath, 'utf8');

// The regex matches components.
const components = {
  Home: { dir: 'pages', match: /const Home = \({ preFilter = 'All' }\) => {[\s\S]*?(?=\nconst Layout =)/ },
  Layout: { dir: 'components', match: /const Layout = \({ children }\) => {[\s\S]*?(?=\nconst NavProfile =)/ },
  NavProfile: { dir: 'components', match: /const NavProfile = \(\) => {[\s\S]*?(?=\nconst MobileNavAuthLinks =)/ },
  MobileNavAuthLinks: { dir: 'components', match: /const MobileNavAuthLinks = \({ closeMenu }\) => {[\s\S]*?(?=\nconst ProtectedRoute =)/ },
  ProtectedRoute: { dir: 'components', match: /const ProtectedRoute = \({ children }\) => {[\s\S]*?(?=\nconst AnimatedRoutes =)/ },
  AnimatedRoutes: { dir: 'components', match: /const AnimatedRoutes = \(\) => {[\s\S]*?(?=\nconst App =)/ }
};

let remainingApp = content;

// Generate imports for the extracted components
let newImports = '';

for (const [name, config] of Object.entries(components)) {
  const matchResult = content.match(config.match);
  if (matchResult) {
    let componentCode = matchResult[0];
    
    // Add appropriate imports to the top of each component
    let componentImports = `import React, { useState, useEffect } from 'react';\nimport { Link, useLocation, Navigate, useNavigate } from 'react-router-dom';\nimport { ShoppingBag, Search, Layers, Zap, ArrowRight, Menu, X, ShieldCheck, Mail, Check } from 'lucide-react';\nimport { useCart } from '../context/CartContext';\nimport { useSearch } from '../context/SearchContext';\nimport { useAuth } from '../context/AuthContext';\nimport FadeInUp from './FadeInUp';\nimport ProductCard from './ProductCard';\nimport { API_URL } from '../lib/api';\nimport toast from 'react-hot-toast';\n\n`;
    
    if (name === 'Home') componentImports = componentImports.replace('./ProductCard', '../components/ProductCard').replace('./FadeInUp', '../components/FadeInUp');
    
    // Write the component file
    const destPath = path.join(srcPath, config.dir, `${name}.jsx`);
    fs.writeFileSync(destPath, componentImports + componentCode + `\n\nexport default ${name};\n`);
    
    // Remove component code from remainingApp
    remainingApp = remainingApp.replace(componentCode, '');
    
    // Add import statement for App.jsx
    newImports += `import ${name} from './${config.dir}/${name}';\n`;
  }
}

// Re-write App.jsx
// Remove the old components block, we will just add the new imports right after the original imports
let finalApp = newImports + remainingApp;

// Cleanup some duplicate empty lines
finalApp = finalApp.replace(/\n{3,}/g, '\n\n');

fs.writeFileSync(appJsxPath, finalApp);
console.log("Refactor successful");
