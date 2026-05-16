import { useState, useEffect } from 'react';
import { API_URL } from '../lib/api';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Plus, Check, Zap, Star, Truck, ShieldCheck, RefreshCw } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import FadeInUp from '../components/FadeInUp';
import toast from 'react-hot-toast';

const ProductDetail = () => {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { addToCart } = useCart();
    const [added, setAdded] = useState(false);
    const [activeTab, setActiveTab] = useState('delivery'); // delivery, returns, warranty
    const { user } = useAuth();
    const [reviewRating, setReviewRating] = useState(5);
    const [reviewComment, setReviewComment] = useState('');
    const [reviewSubmitting, setReviewSubmitting] = useState(false);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await fetch(`${API_URL}/api/products/${id}`);
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

    const handleReviewSubmit = async (e) => {
        e.preventDefault();
        if (!user) {
            toast.error('You must be logged in to leave a review');
            return;
        }
        if (!reviewComment.trim()) {
            toast.error('Please enter a review comment');
            return;
        }
        
        setReviewSubmitting(true);
        try {
            const token = localStorage.getItem('shadowgrid-token') || sessionStorage.getItem('shadowgrid-token');
            const response = await fetch(`${API_URL}/api/products/${id}/reviews`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ rating: reviewRating, comment: reviewComment })
            });
            
            const data = await response.json();
            if (!response.ok) throw new Error(data.message || 'Failed to submit review');
            
            toast.success('Review submitted successfully');
            setReviewComment('');
            setReviewRating(5);
            
            // Refresh product to get new reviews
            const freshResponse = await fetch(`${API_URL}/api/products/${id}`);
            if (freshResponse.ok) {
                const freshProduct = await freshResponse.json();
                setProduct(freshProduct);
            }
        } catch (err) {
            toast.error(err.message);
        } finally {
            setReviewSubmitting(false);
        }
    };

    if (loading) {
        return (
            <main className="container mx-auto px-6 py-20">
                {/* Back button skeleton */}
                <div className="w-32 h-4 bg-white/5 rounded animate-pulse mb-12" />

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-start">
                    {/* Image Skeleton */}
                    <div className="aspect-square lg:aspect-[4/3] rounded-2xl bg-white/5 animate-pulse glass-card" />

                    {/* Info Skeleton */}
                    <div className="flex flex-col">
                        <div className="mb-8 border-b border-white/10 pb-8">
                            <div className="flex items-center justify-between mb-4">
                                <div className="w-24 h-4 bg-white/5 rounded animate-pulse" />
                                <div className="w-32 h-4 bg-white/5 rounded animate-pulse" />
                            </div>
                            
                            <div className="w-3/4 h-12 lg:h-16 bg-white/10 rounded animate-pulse mb-6" />
                            
                            <div className="space-y-3 mb-8">
                                <div className="w-full h-4 bg-white/5 rounded animate-pulse" />
                                <div className="w-5/6 h-4 bg-white/5 rounded animate-pulse" />
                                <div className="w-4/6 h-4 bg-white/5 rounded animate-pulse" />
                            </div>

                            <div className="flex items-center gap-6">
                                <div className="w-32 h-12 bg-white/10 rounded animate-pulse" />
                                <div className="w-40 h-10 bg-emerald-500/10 border border-emerald-500/20 rounded-lg animate-pulse" />
                            </div>
                        </div>

                        {/* Specs Skeleton */}
                        <div className="mb-10">
                            <div className="w-48 h-6 bg-white/5 rounded animate-pulse mb-6" />
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {[1, 2, 3, 4].map(i => (
                                    <div key={i} className="glass-card p-4 h-14 bg-white/5 animate-pulse rounded-xl" />
                                ))}
                            </div>
                        </div>

                        {/* Button Skeleton */}
                        <div className="w-full h-16 bg-white/5 rounded-xl animate-pulse" />
                    </div>
                </div>
            </main>
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
                                    {(() => {
                                        const discount = product.showDiscount && (product.discount > 0 
                                            ? product.discount 
                                            : (product.originalPrice && product.originalPrice > product.price 
                                                ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) 
                                                : 0));
                                        return discount > 0 ? (
                                            <div className="flex items-center gap-3">
                                                <span className="text-lg text-white/30 line-through font-mono">
                                                    ${product.originalPrice}
                                                </span>
                                                <span className="text-xs font-black bg-red-500 text-white px-2 py-0.5 rounded animate-pulse">
                                                    -{discount}%
                                                </span>
                                            </div>
                                        ) : null;
                                    })()}
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
                            <p className="text-white/40 font-mono text-sm uppercase tracking-widest">No reviews for this product yet.</p>
                        )}
                        
                        {/* Review Form */}
                        <div className="glass-card p-6 rounded-xl border border-white/5 mt-8">
                            <h3 className="text-xl font-bold uppercase tracking-widest mb-4">Write a Review</h3>
                            {user ? (
                                <form onSubmit={handleReviewSubmit}>
                                    <div className="mb-4">
                                        <label className="block text-xs font-mono uppercase tracking-widest text-white/50 mb-2">Rating</label>
                                        <div className="flex gap-2">
                                            {[1, 2, 3, 4, 5].map((star) => (
                                                <button
                                                    key={star}
                                                    type="button"
                                                    onClick={() => setReviewRating(star)}
                                                    className="focus:outline-none"
                                                >
                                                    <Star 
                                                        size={24} 
                                                        fill={star <= reviewRating ? "currentColor" : "none"} 
                                                        className={star <= reviewRating ? "text-yellow-400" : "text-white/20 hover:text-yellow-400/50 transition-colors"} 
                                                    />
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="mb-4">
                                        <label className="block text-xs font-mono uppercase tracking-widest text-white/50 mb-2">Comment</label>
                                        <textarea
                                            value={reviewComment}
                                            onChange={(e) => setReviewComment(e.target.value)}
                                            className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-sm font-mono focus:border-neon focus:outline-none transition-all resize-none min-h-[100px] placeholder:text-white/20"
                                            placeholder="Share your experience with this product..."
                                            required
                                        />
                                    </div>
                                    <button
                                        type="submit"
                                        disabled={reviewSubmitting}
                                        className="px-6 py-3 bg-neon text-charcoal rounded-xl font-black uppercase tracking-widest text-xs hover:bg-white transition-all w-full sm:w-auto disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {reviewSubmitting ? 'Submitting...' : 'Submit Review'}
                                    </button>
                                </form>
                            ) : (
                                <div className="text-center py-6 border border-white/10 border-dashed rounded-xl">
                                    <p className="text-white/60 mb-4 font-mono text-sm">You must be logged in to leave a review.</p>
                                    <Link to="/login" className="inline-block px-6 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg font-bold uppercase tracking-widest text-xs transition-colors">
                                        Log In
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
};

export default ProductDetail;
