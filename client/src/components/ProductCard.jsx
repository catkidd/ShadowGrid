import React from 'react';
import { ShoppingCart, Cpu, Plus } from 'lucide-react';
import { useCart } from '../context/CartContext';

const ProductCard = ({ product }) => {
    const { addToCart } = useCart();

    return (
        <div className="glass-card group relative flex flex-col h-full">
            {/* Category Badge */}
            <div className="absolute top-4 left-4 z-10">
                <span className="px-3 py-1 text-[10px] uppercase tracking-widest font-bold bg-neon text-charcoal rounded-full neon-glow">
                    {product.category}
                </span>
            </div>

            {/* Image Container */}
            <div className="relative aspect-[4/3] overflow-hidden">
                <img 
                    src={product.imageURL} 
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-charcoal/40 group-hover:bg-charcoal/20 transition-colors duration-300" />
            </div>

            {/* Content */}
            <div className="p-6 flex flex-col flex-grow">
                <div className="flex justify-between items-start mb-2">
                    <div>
                        <h3 className="text-xl font-bold tracking-tight text-white group-hover:text-neon transition-colors">
                            {product.name}
                        </h3>
                        <p className="text-white/50 text-sm">{product.brand}</p>
                    </div>
                    <span className="text-xl font-mono font-bold text-neon">
                        ${product.price}
                    </span>
                </div>

                {/* Specs */}
                <div className="flex flex-wrap gap-2 my-4">
                    {product.specs.slice(0, 3).map((spec, i) => (
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
