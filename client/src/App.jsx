import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { ShoppingBag, Search, Layers, Zap, ArrowRight, Menu, X, ShieldCheck, Mail, Check } from 'lucide-react';
import { CartProvider, useCart } from './context/CartContext';
import { SearchProvider } from './context/SearchProvider';
import { useSearch } from './context/SearchContext';
import ProductCard from './components/ProductCard';
import CartModal from './components/CartModal';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfService from './pages/TermsOfService';
import Protocols from './pages/Protocols';
import Maintenance from './pages/Maintenance';
import ShippingReturns from './pages/ShippingReturns';
import PaymentMethods from './pages/PaymentMethods';
import Contact from './pages/Contact';
import About from './pages/About';
import ProductDetail from './pages/ProductDetail';
import FadeInUp from './components/FadeInUp';
import ScrollToTop from './components/ScrollToTop';

const Home = ({ preFilter = 'All' }) => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeFilter, setActiveFilter] = useState(preFilter);
    const { searchQuery } = useSearch();

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/products');
                const data = await response.json();
                setProducts(data);
            } catch (err) {
                console.error('Failed to fetch products:', err);
                setProducts([]);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    // Calculate filtered products during render
    const filteredProducts = products.filter(p => {
        const matchesCategory = activeFilter === 'All' || p.category === activeFilter;
        const matchesSearch = !searchQuery || 
            p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.description.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    const handleFilterChange = (filter) => {
        setActiveFilter(filter);
    };

    return (
        <>
            {/* Hero Section - Only show on main Home */}
            {preFilter === 'All' && (
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
                                    <button 
                                        onClick={() => document.getElementById('catalog').scrollIntoView({ behavior: 'smooth' })}
                                        className="px-8 py-4 bg-neon text-charcoal font-black uppercase tracking-widest text-xs rounded-lg neon-glow flex items-center gap-2 group"
                                    >
                                        Explore The Grid
                                        <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                                    </button>
                                    <Link 
                                        to="/protocols"
                                        className="px-8 py-4 bg-white/5 border border-white/10 hover:border-white/30 text-white font-black uppercase tracking-widest text-xs rounded-lg transition-all"
                                    >
                                        Documentation
                                    </Link>
                                </div>
                            </div>
                        </FadeInUp>
                    </div>
                </header>
            )}

            {/* Trust Bar - New Section */}
            {preFilter === 'All' && (
                <section className="bg-charcoal/50 border-y border-white/5 py-8">
                    <div className="container mx-auto px-6">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                            {[
                                { icon: <ShoppingBag size={24} />, title: "Quantum Delivery", desc: "Same-day grid dispatch" },
                                { icon: <ShieldCheck size={24} />, title: "Verified Secure", desc: "Military-grade encryption" },
                                { icon: <Zap size={24} />, title: "Hyper Support", desc: "24/7 technical oversight" },
                                { icon: <Layers size={24} />, title: "Global Network", desc: "Nodes in 50+ territories" }
                            ].map((item, i) => (
                                <FadeInUp key={i} delay={i * 100}>
                                    <div className="flex items-center gap-4 group cursor-default">
                                        <div className="text-neon p-3 rounded-lg bg-neon/5 border border-neon/10 group-hover:border-neon/40 transition-all duration-300">
                                            {item.icon}
                                        </div>
                                        <div>
                                            <h4 className="text-sm font-black uppercase tracking-wider">{item.title}</h4>
                                            <p className="text-[10px] text-white/40 uppercase font-mono">{item.desc}</p>
                                        </div>
                                    </div>
                                </FadeInUp>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* Category Hub - New Section */}
            {preFilter === 'All' && (
                <section className="py-24 relative overflow-hidden">
                    <div className="container mx-auto px-6">
                        <div className="text-center mb-16">
                            <h3 className="text-4xl font-black tracking-tighter uppercase italic mb-4">Sync Your Setup</h3>
                            <p className="text-white/40 font-mono text-sm uppercase tracking-widest">Select your operational segment</p>
                        </div>
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                            {[
                                { name: 'Keyboards', img: 'https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?w=800', link: '/keyboards' },
                                { name: 'Precision', img: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=800', link: '/precision' },
                                { name: 'Displays', img: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=800', link: '/displays' },
                                { name: 'Maintenance', img: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=800', link: '/maintenance' }
                            ].map((cat, i) => (
                                <FadeInUp key={i} delay={i * 150}>
                                    <Link to={cat.link} className="group relative block aspect-square rounded-2xl overflow-hidden glass-card border-white/5 hover:border-neon/50 transition-all duration-500">
                                        <img src={cat.img} alt={cat.name} className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-110 transition-all duration-700 opacity-50 group-hover:opacity-100" />
                                        <div className="absolute inset-0 bg-gradient-to-t from-charcoal to-transparent opacity-80" />
                                        <div className="absolute bottom-8 left-8">
                                            <h4 className="text-3xl font-black uppercase tracking-tighter italic transform group-hover:translate-x-2 transition-transform">{cat.name}</h4>
                                            <div className="w-8 h-1 bg-neon mt-2 scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
                                        </div>
                                    </Link>
                                </FadeInUp>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* Promotional Banner - New Section */}
            {preFilter === 'All' && (
                <section className="container mx-auto px-6 mb-24">
                    <FadeInUp>
                        <div className="relative rounded-3xl overflow-hidden bg-white/5 border border-white/10 group">
                            <div className="grid md:grid-cols-2 items-center">
                                <div className="p-12 lg:p-20 relative z-10">
                                    <span className="inline-block px-4 py-1 bg-red-600 text-[10px] font-black uppercase tracking-widest rounded-full mb-6 animate-pulse">Critical Alert</span>
                                    <h3 className="text-5xl lg:text-7xl font-black tracking-tighter uppercase italic leading-none mb-6">
                                        Save up to <br />
                                        <span className="text-neon text-6xl lg:text-9xl">$150</span>
                                    </h3>
                                    <p className="text-xl text-white/60 mb-10 max-w-md font-medium">On selected experimental hardware and neural interface peripherals. Limited grid access available.</p>
                                    <Link to="/keyboards" className="px-10 py-5 bg-white text-charcoal font-black uppercase tracking-widest text-xs rounded-lg hover:bg-neon hover:text-charcoal transition-all inline-block">
                                        Initiate Protocol
                                    </Link>
                                </div>
                                <div className="relative h-full min-h-[400px] overflow-hidden">
                                    <img 
                                        src="https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=1200" 
                                        className="absolute inset-0 w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-1000 opacity-40 group-hover:opacity-100" 
                                        alt="Promo"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-r from-charcoal via-charcoal/50 to-transparent" />
                                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-neon/10 rounded-full blur-[100px] group-hover:bg-neon/20 transition-all" />
                                </div>
                            </div>
                        </div>
                    </FadeInUp>
                </section>
            )}

            {/* Featured / Best Sellers Section */}
            {preFilter === 'All' && products.length > 0 && (
                <section className="container mx-auto px-6 mb-32">
                    <div className="flex items-center justify-between mb-12">
                        <div>
                            <h3 className="text-3xl font-black tracking-tighter uppercase italic mb-2">Best Sellers</h3>
                            <p className="text-white/40 text-sm font-mono uppercase tracking-widest">High-demand hardware modules</p>
                        </div>
                        <div className="hidden md:flex gap-4">
                            <button className="p-3 border border-white/10 rounded-full hover:border-neon transition-colors"><ArrowRight className="rotate-180" size={20} /></button>
                            <button className="p-3 border border-white/10 rounded-full hover:border-neon transition-colors"><ArrowRight size={20} /></button>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {products.slice(0, 4).map((product, i) => (
                            <FadeInUp key={product._id} delay={i * 100}>
                                <ProductCard product={product} />
                            </FadeInUp>
                        ))}
                    </div>
                    <div className="mt-12 text-center">
                        <button 
                            onClick={() => document.getElementById('catalog').scrollIntoView({ behavior: 'smooth' })}
                            className="px-10 py-4 bg-white/5 border border-white/10 hover:border-white/30 text-white font-black uppercase tracking-widest text-xs rounded-lg transition-all"
                        >
                            View All Units
                        </button>
                    </div>
                </section>
            )}

            {/* Product Grid */}
            <main id="catalog" className={`container mx-auto px-6 ${preFilter === 'All' ? 'py-20' : 'py-32'}`}>
                <FadeInUp delay={100}>
                    <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
                        <div>
                            <h3 className="text-3xl font-black tracking-tighter uppercase italic mb-2">
                                {preFilter === 'All' ? 'Available Inventory' : 'Grid Segment Inventory'}
                            </h3>
                            <p className="text-white/40 text-sm font-mono uppercase tracking-widest">
                                {preFilter === 'All' ? 'Active Stock Status: Validated' : `Category: ${preFilter === 'Mice' ? 'Precision' : preFilter}`}
                            </p>
                        </div>
                        <div className="flex items-center gap-4 bg-white/5 p-1 rounded-lg border border-white/5 font-mono text-[10px] uppercase">
                            {['All', 'Keyboards', 'Mice', 'Displays'].map((filter) => (
                                <button 
                                    key={filter}
                                    onClick={() => handleFilterChange(filter)}
                                    className={`px-4 py-2 rounded font-bold transition-all ${activeFilter === filter ? 'bg-neon text-charcoal shadow-[0_0_15px_rgba(0,255,170,0.3)]' : 'hover:text-white/60'}`}
                                >
                                    {filter === 'Mice' ? 'Precision' : filter === 'All' ? 'All Units' : filter}
                                </button>
                            ))}
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
                    ) : filteredProducts.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                            {filteredProducts.map(product => (
                                <ProductCard key={product._id} product={product} />
                            ))}
                        </div>
                    ) : (
                        <div className="py-20 text-center glass-card border border-white/5">
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
    const { searchQuery, setSearchQuery, isSearchVisible, setIsSearchVisible } = useSearch();

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
                        <Link to="/about" className="hover:text-[#8B5CF6] transition-colors">About</Link>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className={`flex items-center bg-white/5 border border-white/10 rounded-lg overflow-hidden transition-all duration-500 ${isSearchVisible ? 'w-48 md:w-64 px-3' : 'w-0'}`}>
                            <input 
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search the grid..."
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
                        <Link to="/about" className="text-white/60 hover:text-[#8B5CF6] transition-colors py-2" onClick={() => setIsMobileMenuOpen(false)}>About</Link>
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
                        <h3 className="text-4xl font-black tracking-tighter uppercase italic mb-4">Neural Update Protocol</h3>
                        <p className="text-white/60 mb-10 max-w-lg mx-auto font-medium">Join 50,000+ operators. Receive encrypted updates on new hardware drops and grid maintenance.</p>
                        <form className="max-w-2xl mx-auto" onSubmit={(e) => e.preventDefault()}>
                            <div className="flex flex-col md:flex-row gap-4 mb-6">
                                <div className="flex-1 relative">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={20} />
                                    <input 
                                        type="email" 
                                        placeholder="OPERATOR_EMAIL@GRID.COM"
                                        className="w-full bg-white/5 border border-white/10 rounded-lg py-4 pl-12 pr-4 text-sm font-mono focus:border-neon focus:outline-none transition-all"
                                    />
                                </div>
                                <button className="px-10 py-4 bg-neon text-charcoal font-black uppercase tracking-widest text-xs rounded-lg neon-glow hover:scale-105 transition-all">
                                    Subscribe
                                </button>
                            </div>
                            <div className="flex items-center justify-center gap-3 text-[10px] font-mono text-white/40 uppercase tracking-widest">
                                <label className="flex items-center gap-2 cursor-pointer group">
                                    <input type="checkbox" className="hidden peer" />
                                    <div className="w-4 h-4 border border-white/20 rounded peer-checked:bg-neon peer-checked:border-neon transition-all flex items-center justify-center">
                                        <Check size={12} className="text-charcoal opacity-0 peer-checked:opacity-100" />
                                    </div>
                                    <span className="group-hover:text-white/60 transition-colors italic">I accept the grid transmission terms</span>
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
                        <h5 className="text-[10px] font-black uppercase tracking-[0.3em] text-neon mb-6">Operational Hub</h5>
                        <ul className="space-y-4 text-xs font-bold uppercase tracking-widest text-white/50">
                            <li><Link to="/about" className="hover:text-white transition-colors">About Us</Link></li>
                            <li><Link to="/contact" className="hover:text-white transition-colors">Contact Us</Link></li>
                            <li><Link to="/protocols" className="hover:text-white transition-colors">Help Center</Link></li>
                            <li><Link to="/maintenance" className="hover:text-white transition-colors">Careers</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h5 className="text-[10px] font-black uppercase tracking-[0.3em] text-neon mb-6">Security & Policy</h5>
                        <ul className="space-y-4 text-xs font-bold uppercase tracking-widest text-white/50">
                            <li><Link to="/privacy" className="hover:text-white transition-colors">Privacy Protocol</Link></li>
                            <li><Link to="/terms" className="hover:text-white transition-colors">Terms of Service</Link></li>
                            <li><Link to="/shipping" className="hover:text-white transition-colors">Shipping & Returns</Link></li>
                            <li><Link to="/payments" className="hover:text-white transition-colors">Payment Methods</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h5 className="text-[10px] font-black uppercase tracking-[0.3em] text-neon mb-6">Terminal</h5>
                        <ul className="space-y-4 text-xs font-bold uppercase tracking-widest text-white/50">
                            <li><Link to="/" className="hover:text-white transition-colors">Nexus Grid</Link></li>
                            <li><Link to="/keyboards" className="hover:text-white transition-colors">Input Systems</Link></li>
                            <li><Link to="/precision" className="hover:text-white transition-colors">Precision Tools</Link></li>
                            <li><Link to="/displays" className="hover:text-white transition-colors">Visual Arrays</Link></li>
                        </ul>
                    </div>
                </div>

                {/* Payment Methods & Legal Bottom */}
                <div className="container mx-auto px-6 mt-20 pt-8 border-t border-white/5">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-8">
                        <div className="flex flex-col gap-6">
                            <p className="text-xs font-mono text-white/60 uppercase tracking-[0.3em] mb-2 border-l-2 border-neon pl-4">We Accept Secure Grid Payments</p>
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
                            <p>© 2026 ShadowGrid Ops. All Rights Reserved.</p>
                            <div className="flex gap-8">
                                <Link to="/privacy" className="hover:text-neon transition-colors">Privacy_Protocol</Link>
                                <Link to="/terms" className="hover:text-neon transition-colors">Terms_Of_Service</Link>
                            </div>
                        </div>
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
            </Routes>
        </FadeInUp>
    );
};

const App = () => (
    <SearchProvider>
        <CartProvider>
            <Router>
                <ScrollToTop />
                <Layout>
                    <AnimatedRoutes />
                </Layout>
            </Router>
        </CartProvider>
    </SearchProvider>
);

export default App;
