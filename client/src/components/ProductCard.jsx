import React from 'react';
import { ShoppingCart, Cpu, Plus } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { Link } from 'react-router-dom';

const ProductCard = ({ product }) => {
    const { addToCart } = useCart();

    return (
        <div className="glass-card group relative flex flex-col h-full transition-all duration-300 hover:-translate-y-2 border border-transparent hover:border-neon/50">
            {/* Discount Badge */}
            {product.originalPrice && (
                <div className="absolute top-4 right-4 z-10">
                    <span className="px-3 py-1 text-[10px] uppercase tracking-widest font-bold bg-red-500 text-white rounded-full shadow-[0_0_15px_rgba(239,68,68,0.5)] animate-pulse">
                        -{Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
                    </span>
                </div>
            )}

            {/* Image Container */}
            <Link to={`/product/${product._id}`} className="relative aspect-[4/3] overflow-hidden block">
                <img 
                    src={product.imageURL} 
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    onError={(e) => {
                        e.target.src = 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800'; // Generic high-tech hardware fallback
                    }}
                />
                <div className="absolute inset-0 bg-charcoal/40 group-hover:bg-charcoal/20 transition-colors duration-300" />
            </Link>

            {/* Content */}
            <div className="p-6 flex flex-col flex-grow">
                <div className="flex justify-between items-start mb-2">
                    <div>
                        <Link to={`/product/${product._id}`}>
                            <h3 className="text-xl font-bold tracking-tight text-white group-hover:text-neon transition-colors">
                                {product.name}
                            </h3>
                        </Link>
                        <p className="text-white/50 text-sm">{product.brand}</p>
                    </div>
                    <div className="flex flex-col items-end">
                        {product.originalPrice && (
                            <span className="text-xs text-white/30 line-through font-mono">
                                ${product.originalPrice}
                            </span>
                        )}
                        <span className="text-xl font-mono font-bold text-neon">
                            ${product.price}
                        </span>
                    </div>
                </div>

                {/* Specs */}
                <div className="flex flex-wrap gap-2 my-4">
                    {product.specs?.slice(0, 3).map((spec, i) => (
                        <span key={i} className="text-[10px] text-white/40 border border-white/10 px-2 py-0.5 rounded uppercase">
                            {spec}
                        </span>
                    ))}
                </div>

                <div className="mt-auto flex items-center justify-between pt-4 border-t border-white/5">
                    <span className={`text-xs font-medium ${product.stock < 10 ? 'text-orange-400' : 'text-emerald-400'}`}>
                        {product.stock} Units left
                    </span>
                    
                    <button 
                        onClick={() => addToCart(product)}
                        className="flex items-center gap-2 bg-white/10 hover:bg-neon hover:text-charcoal px-4 py-2 rounded-lg font-bold text-xs uppercase tracking-wider transition-all duration-300"
                    >
                        <Plus size={14} />
                        Add to Grid
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProductCard;
