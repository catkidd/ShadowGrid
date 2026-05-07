import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { ShoppingBag, Search, Layers, Zap, ArrowRight, Menu, X } from 'lucide-react';
import { CartProvider, useCart } from './context/CartContext';
import ProductCard from './components/ProductCard';
import CartModal from './components/CartModal';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfService from './pages/TermsOfService';
import Protocols from './pages/Protocols';
import Maintenance from './pages/Maintenance';
import Contact from './pages/Contact';
import About from './pages/About';
import ProductDetail from './pages/ProductDetail';
import FadeInUp from './components/FadeInUp';
import ScrollToTop from './components/ScrollToTop';

const Home = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                // Using localhost by default, can be env variable
                const response = await fetch('http://localhost:5000/api/products');
                const data = await response.json();
                setProducts(data);
            } catch (err) {
                console.error('Failed to fetch products:', err);
                // Fallback to empty array if server is down during dev
                setProducts([]);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    return (
        <>
            {/* Hero Section */}
            <header className="relative py-20 min-h-[calc(100vh-80px)] flex items-center overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-neon/5 rounded-full blur-[120px]" />
                </div>
                
                <div className="container mx-auto px-6 relative z-10">
                    <FadeInUp>
                        <div className="max-w-3xl">
                            <div className="flex items-center gap-2 mb-4">
                                <span className="w-12 h-[1px] bg-neon" />
                                <span className="text-neon text-xs font-black uppercase tracking-[0.3em]">Hardware Protocol v4.0</span>
                            </div>
                            <h2 className="text-6xl md:text-8xl font-black tracking-tighter leading-none mb-8">
                                PRECISION <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-white/20">REDEFINED.</span>
                            </h2>
                            <p className="text-lg text-white/60 mb-10 max-w-xl font-medium leading-relaxed">
                                Boutique engineering for the digital elite. We source the world's most responsive peripherals to bridge the gap between human and machine.
                            </p>
                            <div className="flex flex-wrap gap-4">
                                <button className="px-8 py-4 bg-neon text-charcoal font-black uppercase tracking-widest text-xs rounded-lg neon-glow flex items-center gap-2 group">
                                    Explore The Grid
                                    <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                                </button>
                                <button className="px-8 py-4 bg-white/5 border border-white/10 hover:border-white/30 text-white font-black uppercase tracking-widest text-xs rounded-lg transition-all">
                                    Documentation
                                </button>
                            </div>
                        </div>
                    </FadeInUp>
                </div>
            </header>

            {/* Product Grid */}
            <main className="container mx-auto px-6 py-20">
                <FadeInUp delay={100}>
                    <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
                        <div>
                            <h3 className="text-3xl font-black tracking-tighter uppercase italic mb-2">Available Inventory</h3>
                            <p className="text-white/40 text-sm font-mono uppercase tracking-widest">Active Stock Status: Validated</p>
                        </div>
                        <div className="flex items-center gap-4 bg-white/5 p-1 rounded-lg border border-white/5 font-mono text-[10px] uppercase">
                            <button className="px-4 py-2 bg-neon text-charcoal rounded font-bold">All Units</button>
                            <button className="px-4 py-2 hover:text-white/60 transition-colors">Input</button>
                            <button className="px-4 py-2 hover:text-white/60 transition-colors">Output</button>
                        </div>
                    </div>
                </FadeInUp>

                <FadeInUp delay={200}>
                    {loading ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                            {[...Array(8)].map((_, i) => (
                                <div key={i} className="h-[400px] bg-white/5 animate-pulse rounded-xl" />
                            ))}
                        </div>
                    ) : products.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                            {products.map(product => (
                                <ProductCard key={product._id} product={product} />
                            ))}
                        </div>
                    ) : (
                        <div className="py-20 text-center glass-card">
                            <p className="text-white/30 font-mono italic">No inventory detected on this grid segment.</p>
                        </div>
                    )}
                </FadeInUp>
            </main>
        </>
    );
};

const Layout = ({ children }) => {
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const { cartCount } = useCart();
    const [isCartPulsing, setIsCartPulsing] = useState(false);

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
                        <Link to="/" className="hover:text-neon transition-colors">Keyboards</Link>
                        <Link to="/" className="hover:text-neon transition-colors">Precision</Link>
                        <Link to="/" className="hover:text-neon transition-colors">Displays</Link>
                        <Link to="/about" className="hover:text-[#8B5CF6] transition-colors">About</Link>
                    </div>

                    <div className="flex items-center gap-4">
                        <button className="p-2 text-white/50 hover:text-white transition-colors">
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
                        <Link to="/" className="text-white/60 hover:text-neon transition-colors py-2" onClick={() => setIsMobileMenuOpen(false)}>Keyboards</Link>
                        <Link to="/" className="text-white/60 hover:text-neon transition-colors py-2" onClick={() => setIsMobileMenuOpen(false)}>Precision</Link>
                        <Link to="/" className="text-white/60 hover:text-neon transition-colors py-2" onClick={() => setIsMobileMenuOpen(false)}>Displays</Link>
                        <Link to="/about" className="text-white/60 hover:text-[#8B5CF6] transition-colors py-2" onClick={() => setIsMobileMenuOpen(false)}>About</Link>
                    </div>
                )}
            </nav>

            {/* Page Content */}
            {children}

            {/* Footer */}
            <footer className="mt-auto py-20 bg-matte border-t border-white/5">
                <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12">
                    <div className="md:col-span-2">
                        <div className="flex items-center gap-2 mb-6">
                            <div className="w-8 h-8 bg-neon/20 border border-neon/50 rounded flex items-center justify-center text-neon">
                                <Zap size={16} />
                            </div>
                            <h4 className="text-xl font-black tracking-tighter uppercase italic">SHADOWGRID</h4>
                        </div>
                        <p className="text-white/40 text-sm max-w-xs leading-relaxed font-medium">
                            The industrial standard for computer peripherals. High-performance tools for developers, gamers, and digital artists.
                        </p>
                    </div>
                    <div>
                        <h5 className="text-[10px] font-black uppercase tracking-[0.3em] text-neon mb-6">Connect</h5>
                        <ul className="space-y-4 text-xs font-bold uppercase tracking-widest text-white/50">
                            <li><Link to="/about" className="hover:text-white transition-colors">About</Link></li>
                            <li><Link to="/" className="hover:text-white transition-colors">Terminal</Link></li>
                            <li><Link to="/" className="hover:text-white transition-colors">Nexus</Link></li>
                            <li><a href="https://github.com" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">GitHub</a></li>
                        </ul>
                    </div>
                    <div>
                        <h5 className="text-[10px] font-black uppercase tracking-[0.3em] text-neon mb-6">Support</h5>
                        <ul className="space-y-4 text-xs font-bold uppercase tracking-widest text-white/50">
                            <li><Link to="/protocols" className="hover:text-white transition-colors">Protocols</Link></li>
                            <li><Link to="/maintenance" className="hover:text-white transition-colors">Maintenance</Link></li>
                            <li><Link to="/contact" className="hover:text-white transition-colors">Contact</Link></li>
                        </ul>
                    </div>
                </div>
                <div className="container mx-auto px-6 mt-20 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] font-mono text-white/20 uppercase tracking-[0.2em]">
                    <p>© 2026 ShadowGrid Ops. All Rights Reserved.</p>
                    <div className="flex gap-8">
                        <Link to="/privacy" className="hover:text-neon transition-colors">Privacy_Policy</Link>
                        <Link to="/terms" className="hover:text-neon transition-colors">Terms_Of_Service</Link>
                    </div>
                </div>
            </footer>

            <CartModal isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
        </div>
    );
};

const AnimatedRoutes = () => {
    const location = useLocation();
    return (
        <FadeInUp key={location.pathname} className="flex-1 flex flex-col w-full h-full">
            <Routes location={location}>
                <Route path="/" element={<Home />} />
                <Route path="/product/:id" element={<ProductDetail />} />
                <Route path="/about" element={<About />} />
                <Route path="/privacy" element={<PrivacyPolicy />} />
                <Route path="/terms" element={<TermsOfService />} />
                <Route path="/protocols" element={<Protocols />} />
                <Route path="/maintenance" element={<Maintenance />} />
                <Route path="/contact" element={<Contact />} />
            </Routes>
        </FadeInUp>
    );
};

const App = () => (
    <CartProvider>
        <Router>
            <ScrollToTop />
            <Layout>
                <AnimatedRoutes />
            </Layout>
        </Router>
    </CartProvider>
);

export default App;
