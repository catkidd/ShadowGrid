import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Plus, Check, Zap, Star, Truck, ShieldCheck, RefreshCw } from 'lucide-react';
import { useCart } from '../context/CartContext';
import FadeInUp from '../components/FadeInUp';

const ProductDetail = () => {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { addToCart } = useCart();
    const [added, setAdded] = useState(false);
    const [activeTab, setActiveTab] = useState('delivery'); // delivery, returns, warranty

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const apiUrl = import.meta.env.VITE_API_URL || 'https://shadowgrid-x8m6.onrender.com';
                const response = await fetch(`${apiUrl}/api/products/${id}`);
                if (!response.ok) throw new Error('Product not found or API error');
                const data = await response.json();
                setProduct(data);
            } catch (err) {
                console.error('Fetch error:', err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [id]);

    const handleAddToCart = () => {
        addToCart(product);
        setAdded(true);
        setTimeout(() => setAdded(false), 2000);
    };

    if (loading) {
        return (
            <div className="container mx-auto px-6 py-20 min-h-[60vh] flex items-center justify-center">
                <div className="animate-pulse flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-t-2 border-neon rounded-full animate-spin" />
                    <p className="text-neon font-mono uppercase tracking-widest text-xs">Loading Product Details...</p>
                </div>
            </div>
        );
    }

    if (error || !product) {
        return (
            <div className="container mx-auto px-6 py-20 min-h-[60vh] flex flex-col items-center justify-center">
                <div className="glass-card p-12 text-center max-w-md w-full">
                    <Zap className="mx-auto text-orange-500 mb-4" size={48} />
                    <h2 className="text-2xl font-black uppercase italic tracking-tighter mb-2">Product Not Found</h2>
                    <p className="text-white/50 mb-8">The requested item could not be found in our database.</p>
                    <Link to="/" className="inline-flex items-center gap-2 text-neon hover:text-white transition-colors font-bold uppercase tracking-widest text-xs">
                        <ArrowLeft size={16} /> Return to Shop
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <main className="container mx-auto px-6 py-20">
            <Link to="/" className="inline-flex items-center gap-2 text-white/50 hover:text-neon transition-colors font-bold uppercase tracking-widest text-xs mb-12">
                <ArrowLeft size={16} /> Back to Catalog
            </Link>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-start">
                {/* Product Image Gallery (Sticky on Desktop) */}
                <div className="lg:sticky lg:top-32">
                    <FadeInUp>
                        <div className="relative aspect-square lg:aspect-[4/3] rounded-2xl overflow-hidden glass-card group">
                            <img 
                                src={product.imageURL} 
                                alt={product.name}
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-charcoal/20 pointer-events-none" />
                        </div>
                    </FadeInUp>
                </div>

                {/* Product Info */}
                <FadeInUp delay={100}>
                    <div className="flex flex-col">
                        <div className="mb-8 border-b border-white/10 pb-8">
                            <div className="flex items-center justify-between mb-4">
                                <p className="text-neon font-mono uppercase tracking-widest text-sm">
                                    {product.brand}
                                </p>
                                {/* Ratings */}
                                <div className="flex items-center gap-2">
                                    <div className="flex text-yellow-400">
                                        {[...Array(5)].map((_, i) => (
                                            <Star key={i} size={16} fill={i < Math.floor(product.rating || 5) ? "currentColor" : "none"} className={i < Math.floor(product.rating || 5) ? "" : "text-white/20"} />
                                        ))}
                                    </div>
                                    <span className="text-white/60 text-sm font-mono">{product.rating || "5.0"} ({product.reviewsCount || 0} reviews)</span>
                                </div>
                            </div>
                            
                            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tighter leading-tight lg:leading-none mb-6">
                                {product.name}
                            </h1>
                            
                            {/* Description */}
                            <p className="text-white/70 text-lg leading-relaxed mb-8">
                                {product.description || "Premium hardware designed for maximum performance."}
                            </p>

                            <div className="flex items-center gap-6">
                                <div className="flex flex-col">
                                    {product.originalPrice && product.originalPrice > product.price && (
                                        <div className="flex items-center gap-3">
                                            <span className="text-lg text-white/30 line-through font-mono">
                                                ${product.originalPrice}
                                            </span>
                                            <span className="text-xs font-black bg-red-500 text-white px-2 py-0.5 rounded animate-pulse">
                                                -{Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
                                            </span>
                                        </div>
                                    )}
                                    <span className="text-5xl font-mono font-black text-white">
                                        ${product.price}
                                    </span>
                                </div>
                                <span className={`px-4 py-2 rounded-lg text-sm font-bold uppercase tracking-widest ${product.stock < 10 ? 'bg-orange-500/10 text-orange-400 border border-orange-500/20' : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'}`}>
                                    {product.stock} Units Available
                                </span>
                            </div>
                        </div>

                        {/* Specs */}
                        <div className="mb-10">
                            <h3 className="text-lg font-bold uppercase tracking-widest mb-6">Product Specifications</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {product.specs?.map((spec, i) => (
                                    <div key={i} className="glass-card p-4 flex items-center gap-4">
                                        <div className="w-2 h-2 bg-neon rounded-full" />
                                        <span className="text-white/80 font-medium">{spec}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="mb-12">
                            <button 
                                onClick={handleAddToCart}
                                disabled={added || product.stock === 0}
                                className={`w-full py-6 rounded-xl font-black uppercase tracking-widest text-sm flex items-center justify-center gap-3 transition-all duration-300 ${
                                    added 
                                        ? 'bg-emerald-500 text-charcoal shadow-[0_0_20px_rgba(16,185,129,0.4)]' 
                                        : product.stock === 0
                                            ? 'bg-white/5 text-white/20 cursor-not-allowed'
                                            : 'bg-neon text-charcoal hover:bg-white neon-glow'
                                }`}
                            >
                                {added ? (
                                    <>
                                        <Check size={20} />
                                        Added to Cart
                                    </>
                                ) : product.stock === 0 ? (
                                    'Out of Stock'
                                ) : (
                                    <>
                                        <Plus size={20} />
                                        Add to Cart
                                    </>
                                )}
                            </button>
                        </div>

                        {/* Policy Tabs */}
                        <div className="glass-card rounded-xl overflow-hidden">
                            <div className="flex border-b border-white/10 font-mono text-xs uppercase tracking-widest">
                                <button 
                                    onClick={() => setActiveTab('delivery')}
                                    className={`flex-1 py-4 flex flex-col items-center gap-2 transition-colors ${activeTab === 'delivery' ? 'bg-white/10 text-neon' : 'text-white/50 hover:text-white hover:bg-white/5'}`}
                                >
                                    <Truck size={18} /> Delivery
                                </button>
                                <button 
                                    onClick={() => setActiveTab('returns')}
                                    className={`flex-1 py-4 flex flex-col items-center gap-2 border-l border-white/10 transition-colors ${activeTab === 'returns' ? 'bg-white/10 text-neon' : 'text-white/50 hover:text-white hover:bg-white/5'}`}
                                >
                                    <RefreshCw size={18} /> Returns
                                </button>
                                <button 
                                    onClick={() => setActiveTab('warranty')}
                                    className={`flex-1 py-4 flex flex-col items-center gap-2 border-l border-white/10 transition-colors ${activeTab === 'warranty' ? 'bg-white/10 text-neon' : 'text-white/50 hover:text-white hover:bg-white/5'}`}
                                >
                                    <ShieldCheck size={18} /> Warranty
                                </button>
                            </div>
                            <div className="p-6 text-sm text-white/70 leading-relaxed font-mono">
                                {activeTab === 'delivery' && (
                                    <p>Free standard shipping on all orders. Express delivery options are available at checkout. All items are shipped in premium, protective packaging.</p>
                                )}
                                {activeTab === 'returns' && (
                                    <p>30-day hassle-free return policy. If you are not completely satisfied with your purchase, you can initiate a return through your account dashboard for a full refund.</p>
                                )}
                                {activeTab === 'warranty' && (
                                    <p>2-Year Manufacturer Warranty included. Covers internal component defects and hardware failures under normal usage conditions.</p>
                                )}
                            </div>
                        </div>

                    </div>
                </FadeInUp>
            </div>
            {/* Ratings & Reviews Section */}
            <div className="mt-20 border-t border-white/10 pt-16">
                <h2 className="text-3xl font-black uppercase tracking-widest mb-12">Ratings & Reviews</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                    {/* Summary Block */}
                    <div className="glass-card p-8 rounded-xl flex flex-col items-center justify-center text-center">
                        <span className="text-6xl font-black text-white mb-2">{product.rating ? product.rating.toFixed(1) : '5.0'}</span>
                        <div className="flex text-yellow-400 mb-2">
                            {[...Array(5)].map((_, i) => (
                                <Star key={i} size={24} fill={i < Math.floor(product.rating || 5) ? "currentColor" : "none"} className={i < Math.floor(product.rating || 5) ? "" : "text-white/20"} />
                            ))}
                        </div>
                        <span className="text-white/50 text-sm font-mono uppercase tracking-widest">{product.reviewsCount || 0} Verified Ratings</span>
                    </div>

                    {/* Reviews List */}
                    <div className="md:col-span-2 space-y-6">
                        {product?.reviews && product?.reviews.length > 0 ? (
                            product?.reviews.map((review, idx) => (
                                <div key={idx} className="glass-card p-6 rounded-xl border border-white/5 hover:border-white/10 transition-colors">
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <div className="flex items-center gap-3 mb-1">
                                                <span className="font-bold text-white">{review?.user}</span>
                                                {review?.verifiedPurchase && (
                                                    <span className="text-[10px] uppercase tracking-widest text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded border border-emerald-400/20">Verified</span>
                                                )}
                                            </div>
                                            <div className="flex text-yellow-400">
                                                {[...Array(5)].map((_, i) => (
                                                    <Star key={i} size={12} fill={i < (review?.rating || 5) ? "currentColor" : "none"} className={i < (review?.rating || 5) ? "" : "text-white/20"} />
                                                ))}
                                            </div>
                                        </div>
                                        <span className="text-white/30 text-xs font-mono">{review?.date}</span>
                                    </div>
                                    <p className="text-white/70 text-sm leading-relaxed">{review?.comment}</p>
                                </div>
                            ))
                        ) : (
                            <div className="glass-card p-8 rounded-xl text-center border border-white/5">
                                <p className="text-white/40 font-mono text-sm uppercase tracking-widest">No reviews for this product yet.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </main>
    );
};

export default ProductDetail;
