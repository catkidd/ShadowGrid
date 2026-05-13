import React, { useState, useEffect } from 'react';
import { Link, useLocation, Navigate, useNavigate, Routes, Route, BrowserRouter as Router } from 'react-router-dom';
import { ShoppingBag, Search, Layers, Zap, ArrowRight, Menu, X, ShieldCheck, Mail, Check, Star, Truck, RefreshCw } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useSearch } from '../context/SearchContext';
import { useAuth } from '../context/AuthContext';
import { API_URL } from '../lib/api';
import toast from 'react-hot-toast';

import FadeInUp from './FadeInUp';
import NavAuthLinks from './NavAuthLinks';
import MobileNavAuthLinks from './MobileNavAuthLinks';
import NavProfile from './NavProfile';
import CartModal from './CartModal';

const Layout = ({ children }) => {
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const { cartCount } = useCart();
    const [isCartPulsing, setIsCartPulsing] = useState(false);
    const { searchQuery, setSearchQuery, isSearchVisible, setIsSearchVisible } = useSearch();

    // Newsletter state
    const [newsletterEmail, setNewsletterEmail] = useState('');
    const [termsAccepted, setTermsAccepted] = useState(false);
    const [isSubscribing, setIsSubscribing] = useState(false);

    const handleNewsletterSubmit = async (e) => {
        e.preventDefault();
        if (!termsAccepted) {
            toast.error('Please accept the terms and conditions');
            return;
        }
        if (!newsletterEmail) {
            toast.error('Please enter an email address');
            return;
        }

        setIsSubscribing(true);
        try {
            const response = await fetch(`${API_URL}/api/newsletter/subscribe`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: newsletterEmail })
            });
            const data = await response.json();
            
            if (!response.ok) throw new Error(data.message || 'Subscription failed');
            
            toast.success('Successfully subscribed to the newsletter!');
            setNewsletterEmail('');
            setTermsAccepted(false);
        } catch (err) {
            toast.error(err.message);
        } finally {
            setIsSubscribing(false);
        }
    };

    useEffect(() => {
        if (cartCount > 0) {
            const startTimer = setTimeout(() => setIsCartPulsing(true), 0);
            const stopTimer = setTimeout(() => setIsCartPulsing(false), 500);
            return () => {
                clearTimeout(startTimer);
                clearTimeout(stopTimer);
            };
        }
    }, [cartCount]);

    return (
        <div className="min-h-screen flex flex-col">
            {/* Navigation */}
            <nav className="sticky top-0 z-40 bg-charcoal/80 backdrop-blur-xl border-b border-white/5">
                <div className="container mx-auto px-6 py-4 flex justify-between items-center">
                    <Link to="/" className="flex items-center gap-2">
                        <div className="w-10 h-10 bg-neon rounded flex items-center justify-center text-charcoal neon-glow">
                            <Layers size={24} />
                        </div>
                        <h1 className="text-2xl font-black tracking-tighter uppercase italic">
                            Shadow<span className="text-neon">Grid</span>
                        </h1>
                    </Link>

                    <div className="hidden lg:flex items-center gap-8 text-xs font-bold uppercase tracking-widest text-white/60">
                        <Link to="/keyboards" className="hover:text-neon transition-colors">Keyboards</Link>
                        <Link to="/precision" className="hover:text-neon transition-colors">Precision</Link>
                        <Link to="/displays" className="hover:text-neon transition-colors">Displays</Link>
                        <NavAuthLinks />
                    </div>

                    <div className="flex items-center gap-4">
                        <div className={`flex items-center bg-white/5 border border-white/10 rounded-lg overflow-hidden transition-all duration-500 ${isSearchVisible ? 'w-48 md:w-64 px-3' : 'w-0'}`}>
                            <input 
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search products..."
                                className="bg-transparent border-none outline-none text-[10px] font-mono text-white w-full py-2"
                                autoFocus={isSearchVisible}
                            />
                            {searchQuery && (
                                <button onClick={() => setSearchQuery('')} className="text-white/30 hover:text-white">
                                    <X size={14} />
                                </button>
                            )}
                        </div>
                        <button 
                            onClick={() => setIsSearchVisible(!isSearchVisible)}
                            className={`p-2 transition-colors ${isSearchVisible ? 'text-neon' : 'text-white/50 hover:text-white'}`}
                        >
                            <Search size={20} />
                        </button>
                        <button 
                            onClick={() => setIsCartOpen(true)}
                            className={`relative p-2 bg-white/5 rounded-lg border hover:border-neon transition-all duration-300 ${isCartPulsing ? 'border-neon shadow-[0_0_15px_rgba(0,255,170,0.5)] animate-pulse' : 'border-white/10'}`}
                        >
                            <ShoppingBag size={20} />
                            {cartCount > 0 && (
                                <span className="absolute -top-1 -right-1 w-5 h-5 bg-neon text-charcoal text-[10px] font-black rounded-full flex items-center justify-center neon-glow">
                                    {cartCount}
                                </span>
                            )}
                        </button>
                        <NavProfile />
                        <button 
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="block lg:hidden p-2 text-white/50 hover:text-white transition-colors"
                        >
                            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>

                {/* Mobile Dropdown Menu */}
                {isMobileMenuOpen && (
                    <div className="flex lg:hidden bg-charcoal border-t border-white/5 py-4 px-6 flex-col gap-4 font-bold uppercase tracking-widest text-sm">
                        <Link to="/keyboards" className="text-white/60 hover:text-neon transition-colors py-2" onClick={() => setIsMobileMenuOpen(false)}>Keyboards</Link>
                        <Link to="/precision" className="text-white/60 hover:text-neon transition-colors py-2" onClick={() => setIsMobileMenuOpen(false)}>Precision</Link>
                        <Link to="/displays" className="text-white/60 hover:text-neon transition-colors py-2" onClick={() => setIsMobileMenuOpen(false)}>Displays</Link>
                        <MobileNavAuthLinks closeMenu={() => setIsMobileMenuOpen(false)} />
                    </div>
                )}
            </nav>

            {/* Page Content */}
            <div className="flex-1">
                {children}
            </div>

            {/* Newsletter Section */}
            <section className="bg-neon/10 border-y border-neon/20 py-20 relative overflow-hidden">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-neon/5 blur-[120px] rounded-full" />
                <div className="container mx-auto px-6 relative z-10 text-center">
                    <FadeInUp>
                        <h3 className="text-4xl font-black tracking-tighter uppercase italic mb-4">Newsletter</h3>
                        <p className="text-white/60 mb-10 max-w-lg mx-auto font-medium">Join 50,000+ members. Receive updates on new product launches and special offers.</p>
                        <form className="max-w-2xl mx-auto" onSubmit={handleNewsletterSubmit}>
                            <div className="flex flex-col md:flex-row gap-4 mb-6">
                                <div className="flex-1 relative">
                                    <label htmlFor="newsletter-email" className="sr-only">Newsletter Email</label>
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={20} />
                                    <input 
                                        id="newsletter-email"
                                        name="newsletter-email"
                                        type="email" 
                                        placeholder="yourname@email.com"
                                        value={newsletterEmail}
                                        onChange={(e) => setNewsletterEmail(e.target.value)}
                                        className="w-full bg-white/5 border border-white/10 rounded-lg py-4 pl-12 pr-4 text-sm font-mono focus:border-neon focus:outline-none transition-all"
                                    />
                                </div>
                                <button 
                                    disabled={isSubscribing}
                                    className="px-10 py-4 bg-neon text-charcoal font-black uppercase tracking-widest text-xs rounded-lg neon-glow hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isSubscribing ? 'Subscribing...' : 'Subscribe'}
                                </button>
                            </div>
                            <div className="flex items-center justify-center gap-3 text-[10px] font-mono text-white/40 uppercase tracking-widest">
                                <label className="flex items-center gap-2 cursor-pointer group">
                                    <input 
                                        type="checkbox" 
                                        className="hidden peer"
                                        checked={termsAccepted}
                                        onChange={(e) => setTermsAccepted(e.target.checked)}
                                    />
                                    <div className="w-4 h-4 border border-white/20 rounded peer-checked:bg-neon peer-checked:border-neon transition-all flex items-center justify-center">
                                        <Check size={12} className="text-charcoal opacity-0 peer-checked:opacity-100" />
                                    </div>
                                    <span className="group-hover:text-white/60 transition-colors italic">I accept the terms and conditions</span>
                                </label>
                            </div>
                        </form>
                    </FadeInUp>
                </div>
            </section>

            {/* Brands Bar */}
            <section className="py-12 bg-charcoal/30 border-b border-white/5">
                <div className="container mx-auto px-6">
                    <div className="flex flex-wrap justify-between items-center gap-12 opacity-30 grayscale hover:grayscale-0 transition-all duration-700">
                        {['ZODIAC', 'ZORO', 'PJK', 'GXL', 'HORIZON', 'CORE_OPS'].map((brand) => (
                            <span key={brand} className="text-2xl font-black tracking-[0.2em] italic cursor-default hover:text-neon transition-colors">
                                {brand}
                            </span>
                        ))}
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-20 bg-matte border-t border-white/5">
                <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
                    <div className="lg:col-span-2">
                        <div className="flex items-center gap-2 mb-6">
                            <div className="w-8 h-8 bg-neon/20 border border-neon/50 rounded flex items-center justify-center text-neon">
                                <Zap size={16} />
                            </div>
                            <h4 className="text-xl font-black tracking-tighter uppercase italic">SHADOWGRID</h4>
                        </div>
                        <p className="text-white/40 text-sm max-w-xs leading-relaxed font-medium">
                            The industrial standard for computer peripherals. High-performance tools for developers, gamers, and digital artists. Engineering the future of human-machine interaction.
                        </p>
                    </div>
                    <div>
                        <h5 className="text-[10px] font-black uppercase tracking-[0.3em] text-neon mb-6">Support Hub</h5>
                        <ul className="space-y-4 text-xs font-bold uppercase tracking-widest text-white/50">
                            <li><Link to="/about" className="hover:text-white transition-colors">About Us</Link></li>
                            <li><Link to="/contact" className="hover:text-white transition-colors">Contact Us</Link></li>
                            <li><Link to="/protocols" className="hover:text-white transition-colors">Help Center</Link></li>
                            <li><Link to="/maintenance" className="hover:text-white transition-colors">Careers</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h5 className="text-[10px] font-black uppercase tracking-[0.3em] text-neon mb-6">Company Policy</h5>
                        <ul className="space-y-4 text-xs font-bold uppercase tracking-widest text-white/50">
                            <li><Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
                            <li><Link to="/terms" className="hover:text-white transition-colors">Terms of Service</Link></li>
                            <li><Link to="/shipping" className="hover:text-white transition-colors">Shipping & Returns</Link></li>
                            <li><Link to="/payments" className="hover:text-white transition-colors">Payment Methods</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h5 className="text-[10px] font-black uppercase tracking-[0.3em] text-neon mb-6">Categories</h5>
                        <ul className="space-y-4 text-xs font-bold uppercase tracking-widest text-white/50">
                            <li><Link to="/" className="hover:text-white transition-colors">All Products</Link></li>
                            <li><Link to="/keyboards" className="hover:text-white transition-colors">Keyboards</Link></li>
                            <li><Link to="/precision" className="hover:text-white transition-colors">Mice</Link></li>
                            <li><Link to="/displays" className="hover:text-white transition-colors">Displays</Link></li>
                        </ul>
                    </div>
                </div>

                {/* Payment Methods & Legal Bottom */}
                <div className="container mx-auto px-6 mt-20 pt-8 border-t border-white/5">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-8">
                        <div className="flex flex-col gap-6">
                            <p className="text-xs font-mono text-white/60 uppercase tracking-[0.3em] mb-2 border-l-2 border-neon pl-4">Secure Checkout Powered by SSL</p>
                            <div className="flex items-center gap-10">
                                <div className="opacity-80 hover:opacity-100 hover:scale-110 transition-all duration-300">
                                    <img src="https://api.iconify.design/logos:visa.svg" className="h-8 md:h-10 w-auto" alt="Visa" />
                                </div>
                                <div className="opacity-80 hover:opacity-100 hover:scale-110 transition-all duration-300">
                                    <img src="https://api.iconify.design/logos:mastercard.svg" className="h-10 md:h-12 w-auto" alt="Mastercard" />
                                </div>
                                <div className="opacity-80 hover:opacity-100 hover:scale-110 transition-all duration-300">
                                    <img src="https://api.iconify.design/logos:paypal.svg" className="h-8 md:h-10 w-auto" alt="PayPal" />
                                </div>
                                <div className="opacity-80 hover:opacity-100 hover:scale-110 transition-all duration-300">
                                    <img src="https://api.iconify.design/logos:amex.svg" className="h-8 md:h-10 w-auto" alt="Amex" />
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-col items-center md:items-end gap-4 text-[10px] font-mono text-white/20 uppercase tracking-[0.2em]">
                            <p>Â© 2026 ShadowGrid Ops. All Rights Reserved.</p>
                            <div className="flex gap-8">
                                <Link to="/privacy" className="hover:text-neon transition-colors">Privacy Policy</Link>
                                <Link to="/terms" className="hover:text-neon transition-colors">Terms of Service</Link>
                            </div>
                        </div>
                    </div>
                </div>
            </footer>

            <CartModal isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
        </div>
    );
};


export default Layout;
