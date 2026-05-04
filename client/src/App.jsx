import React, { useState, useEffect } from 'react';
import { ShoppingBag, Search, Layers, Zap, ArrowRight } from 'lucide-react';
import { CartProvider, useCart } from './context/CartContext';
import ProductCard from './components/ProductCard';
import CartModal from './components/CartModal';

const ShadowGridApp = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const { cartCount } = useCart();

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
        <div className="min-h-screen flex flex-col">
            {/* Navigation */}
            <nav className="sticky top-0 z-40 bg-charcoal/80 backdrop-blur-xl border-b border-white/5">
                <div className="container mx-auto px-6 py-4 flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <div className="w-10 h-10 bg-neon rounded flex items-center justify-center text-charcoal neon-glow">
                            <Layers size={24} />
                        </div>
                        <h1 className="text-2xl font-black tracking-tighter uppercase italic">
                            Shadow<span className="text-neon">Grid</span>
                        </h1>
                    </div>

                    <div className="hidden md:flex items-center gap-8 text-xs font-bold uppercase tracking-widest text-white/60">
                        <a href="#" className="hover:text-neon transition-colors">Keyboards</a>
                        <a href="#" className="hover:text-neon transition-colors">Precision</a>
                        <a href="#" className="hover:text-neon transition-colors">Displays</a>
                        <a href="#" className="hover:text-neon transition-colors">About</a>
                    </div>

                    <div className="flex items-center gap-4">
                        <button className="p-2 text-white/50 hover:text-white transition-colors">
                            <Search size={20} />
                        </button>
                        <button 
                            onClick={() => setIsCartOpen(true)}
                            className="relative p-2 bg-white/5 rounded-lg border border-white/10 hover:border-neon transition-all"
                        >
                            <ShoppingBag size={20} />
                            {cartCount > 0 && (
                                <span className="absolute -top-1 -right-1 w-5 h-5 bg-neon text-charcoal text-[10px] font-black rounded-full flex items-center justify-center neon-glow">
                                    {cartCount}
                                </span>
                            )}
                        </button>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <header className="relative py-20 overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-neon/5 rounded-full blur-[120px]" />
                </div>
                
                <div className="container mx-auto px-6 relative z-10">
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
                </div>
            </header>

            {/* Product Grid */}
            <main className="container mx-auto px-6 py-20">
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
            </main>

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
                            <li><a href="#" className="hover:text-white transition-colors">Terminal</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Nexus</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">GitHub</a></li>
                        </ul>
                    </div>
                    <div>
                        <h5 className="text-[10px] font-black uppercase tracking-[0.3em] text-neon mb-6">Support</h5>
                        <ul className="space-y-4 text-xs font-bold uppercase tracking-widest text-white/50">
                            <li><a href="#" className="hover:text-white transition-colors">Protocols</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Maintenance</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
                        </ul>
                    </div>
                </div>
                <div className="container mx-auto px-6 mt-20 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] font-mono text-white/20 uppercase tracking-[0.2em]">
                    <p>© 2026 ShadowGrid Ops. All Rights Reserved.</p>
                    <div className="flex gap-8">
                        <a href="#">Privacy_Policy</a>
                        <a href="#">Terms_Of_Service</a>
                    </div>
                </div>
            </footer>

            <CartModal isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
        </div>
    );
};

const App = () => (
    <CartProvider>
        <ShadowGridApp />
    </CartProvider>
);

export default App;
