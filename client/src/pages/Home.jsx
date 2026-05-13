import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Zap, ShoppingBag, Layers, ShieldCheck } from 'lucide-react';
import { useSearch } from '../context/SearchContext';
import { API_URL } from '../lib/api';
import ProductCard from '../components/ProductCard';
import FadeInUp from '../components/FadeInUp';

const Home = ({ preFilter = 'All' }) => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeFilter, setActiveFilter] = useState(preFilter);
    const { searchQuery } = useSearch();

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await fetch(`${API_URL}/api/products`);
                if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
                const data = await response.json();
                if (Array.isArray(data)) {
                    setProducts(data);
                } else {
                    setProducts([]);
                }
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
                                    <span className="text-neon text-xs font-black uppercase tracking-[0.3em]">Premium Hardware Collection</span>
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
                                        onClick={() => document.getElementById('catalog')?.scrollIntoView({ behavior: 'smooth' })}
                                        className="px-8 py-4 bg-neon text-charcoal font-black uppercase tracking-widest text-xs rounded-lg neon-glow flex items-center gap-2 group"
                                    >
                                        Shop Catalog
                                        <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                                    </button>
                                    <Link 
                                        to="/protocols"
                                        className="px-8 py-4 bg-white/5 border border-white/10 hover:border-white/30 text-white font-black uppercase tracking-widest text-xs rounded-lg transition-all"
                                    >
                                        Support
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
                                { icon: <ShoppingBag size={24} />, title: "Fast Shipping", desc: "Same-day dispatch" },
                                { icon: <ShieldCheck size={24} />, title: "Secure Payment", desc: "SSL encrypted checkout" },
                                { icon: <Zap size={24} />, title: "Expert Support", desc: "24/7 technical assistance" },
                                { icon: <Layers size={24} />, title: "Global Warranty", desc: "Available in 50+ countries" }
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
                            <h3 className="text-4xl font-black tracking-tighter uppercase italic mb-4">Shop by Category</h3>
                            <p className="text-white/40 font-mono text-sm uppercase tracking-widest">Select your equipment category</p>
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
                                        <div className="absolute bottom-4 left-4 sm:bottom-8 sm:left-8 pr-4">
                                            <h4 className="text-xl sm:text-2xl lg:text-3xl font-black uppercase tracking-tighter italic transform group-hover:translate-x-2 transition-transform leading-none">{cat.name}</h4>
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
                                    <span className="inline-block px-4 py-1 bg-red-600 text-[10px] font-black uppercase tracking-widest rounded-full mb-6 animate-pulse">Limited Offer</span>
                                    <h3 className="text-5xl lg:text-7xl font-black tracking-tighter uppercase italic leading-none mb-6">
                                        Save up to <br />
                                        <span className="text-neon text-6xl lg:text-9xl">$150</span>
                                    </h3>
                                    <p className="text-xl text-white/60 mb-10 max-w-md font-medium">On selected high-performance peripherals and accessories. Limited stock available.</p>
                                    <Link to="/keyboards" className="px-10 py-5 bg-white text-charcoal font-black uppercase tracking-widest text-xs rounded-lg hover:bg-neon hover:text-charcoal transition-all inline-block">
                                        Shop the Collection
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
                            onClick={() => document.getElementById('catalog')?.scrollIntoView({ behavior: 'smooth' })}
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


export default Home;
