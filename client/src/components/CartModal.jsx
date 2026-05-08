import { X, Trash2, Plus, Minus, CreditCard, ShoppingBag } from 'lucide-react';
import { useCart } from '../context/CartContext';

const CartModal = ({ isOpen, onClose }) => {
    const { cart, removeFromCart, updateQuantity, cartTotal, clearCart } = useCart();

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-end p-0 sm:p-4 bg-charcoal/80 backdrop-blur-sm transition-opacity duration-300">
            {/* Overlay click to close */}
            <div className="absolute inset-0" onClick={onClose} />
            
            <div className="relative w-full max-w-md h-full bg-matte border-l border-white/10 flex flex-col shadow-2xl animate-slide-in">
                {/* Header */}
                <div className="p-6 border-b border-white/5 flex justify-between items-center bg-charcoal">
                    <h2 className="text-xl font-bold tracking-tighter flex items-center gap-2">
                        <ShoppingBag className="text-neon" size={20} />
                        CURRENT GRID
                    </h2>
                    <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full transition-colors">
                        <X size={20} />
                    </button>
                </div>

                {/* Items */}
                <div className="flex-grow overflow-y-auto p-6 space-y-6">
                    {cart.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-white/30 space-y-4">
                            <ShoppingBag size={48} strokeWidth={1} />
                            <p className="font-mono text-sm uppercase tracking-widest">Grid is Empty</p>
                        </div>
                    ) : (
                        cart.map((item) => (
                            <div key={item._id} className="flex gap-4 group">
                                <div className="w-20 h-20 bg-charcoal rounded-lg overflow-hidden border border-white/5">
                                    <img src={item.imageURL} alt={item.name} className="w-full h-full object-cover" />
                                </div>
                                <div className="flex-grow">
                                    <div className="flex justify-between">
                                        <h4 className="font-bold text-sm group-hover:text-neon transition-colors">{item.name}</h4>
                                        <button onClick={() => removeFromCart(item._id)} className="text-white/30 hover:text-red-400 transition-colors">
                                            <Trash2 size={14} />
                                        </button>
                                    </div>
                                    <p className="text-neon font-mono text-xs mb-3">${item.price}</p>
                                    
                                    <div className="flex items-center gap-3">
                                        <div className="flex items-center border border-white/10 rounded-md bg-charcoal">
                                            <button 
                                                onClick={() => updateQuantity(item._id, -1, item.stock)}
                                                className="p-1 hover:text-neon transition-colors"
                                            >
                                                <Minus size={12} />
                                            </button>
                                            <span className="w-8 text-center text-xs font-mono">{item.quantity}</span>
                                            <button 
                                                onClick={() => updateQuantity(item._id, 1, item.stock)}
                                                className="p-1 hover:text-neon transition-colors"
                                            >
                                                <Plus size={12} />
                                            </button>
                                        </div>
                                        <span className="text-[10px] text-white/30 uppercase tracking-tighter">
                                            Limit: {item.stock}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Footer */}
                {cart.length > 0 && (
                    <div className="p-6 bg-charcoal border-t border-white/10 space-y-4">
                        <div className="flex justify-between items-center mb-4">
                            <span className="text-sm text-white/50 uppercase tracking-widest font-mono">Subtotal</span>
                            <span className="text-2xl font-bold text-neon font-mono">${cartTotal.toFixed(2)}</span>
                        </div>
                        <button className="w-full py-4 bg-neon text-charcoal font-black uppercase tracking-widest text-sm rounded-lg hover:brightness-110 transition-all flex items-center justify-center gap-2 neon-glow">
                            <CreditCard size={18} />
                            Initiate Transfer
                        </button>
                        <button 
                            onClick={clearCart}
                            className="w-full py-2 text-[10px] text-white/20 uppercase tracking-widest hover:text-red-400 transition-colors"
                        >
                            Flush Cart Data
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CartModal;
