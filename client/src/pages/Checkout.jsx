import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { API_URL } from '../lib/api';
import { ArrowLeft, ShoppingBag, MapPin, CreditCard, Check, Package } from 'lucide-react';
import toast from 'react-hot-toast';
import FadeInUp from '../components/FadeInUp';

const Checkout = () => {
    const { cart, cartTotal, clearCart } = useCart();
    const { token } = useAuth();
    const navigate = useNavigate();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [orderPlaced, setOrderPlaced] = useState(null);

    const [form, setForm] = useState({
        fullName: '',
        address: '',
        city: '',
        postalCode: '',
        country: '',
        paymentMethod: 'Card'
    });

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (cart.length === 0) return toast.error('Your cart is empty.');
        setIsSubmitting(true);

        try {
            const response = await fetch(`${API_URL}/api/orders`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    items: cart,
                    shippingAddress: {
                        fullName: form.fullName,
                        address: form.address,
                        city: form.city,
                        postalCode: form.postalCode,
                        country: form.country
                    },
                    paymentMethod: form.paymentMethod
                })
            });

            const data = await response.json();

            if (response.ok) {
                clearCart();
                setOrderPlaced(data.order);
                toast.success('Order placed successfully!');
            } else {
                toast.error(data.message || 'Failed to place order.');
            }
        } catch {
            toast.error('Connection error. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    // ── Order Confirmation Screen ──────────────────────────────────────────────
    if (orderPlaced) {
        return (
            <main className="container mx-auto px-6 py-24 min-h-[80vh] flex items-center justify-center">
                <FadeInUp className="w-full max-w-lg text-center">
                    <div className="glass-card p-12">
                        <div className="w-20 h-20 rounded-full bg-neon/10 border border-neon/30 flex items-center justify-center mx-auto mb-8">
                            <Check className="text-neon" size={40} />
                        </div>
                        <h1 className="text-4xl font-black uppercase tracking-tighter italic mb-3">Order Confirmed</h1>
                        <p className="text-white/50 font-mono text-xs uppercase tracking-widest mb-8">
                            Order ID: <span className="text-neon">{orderPlaced._id?.slice(-10).toUpperCase()}</span>
                        </p>
                        <div className="text-left glass-card p-6 rounded-xl mb-8 space-y-3">
                            {orderPlaced.items?.map((item, i) => (
                                <div key={i} className="flex items-center justify-between text-sm">
                                    <span className="font-bold text-white/80">{item.name} <span className="text-white/30 font-mono">×{item.quantity}</span></span>
                                    <span className="font-mono text-neon">${(item.price * item.quantity).toFixed(2)}</span>
                                </div>
                            ))}
                            <div className="border-t border-white/10 pt-3 flex justify-between font-black">
                                <span>Total</span>
                                <span className="text-neon font-mono">${orderPlaced.total?.toFixed(2)}</span>
                            </div>
                        </div>
                        <p className="text-white/40 text-xs font-mono uppercase tracking-widest mb-8">
                            Shipping to: {orderPlaced.shippingAddress?.fullName}, {orderPlaced.shippingAddress?.city}
                        </p>
                        <Link
                            to="/"
                            className="inline-flex items-center gap-2 px-8 py-4 bg-neon text-charcoal font-black uppercase tracking-widest text-xs rounded-xl neon-glow hover:bg-white transition-all"
                        >
                            <ShoppingBag size={16} />
                            Continue Shopping
                        </Link>
                    </div>
                </FadeInUp>
            </main>
        );
    }

    // ── Empty Cart Guard ──────────────────────────────────────────────────────
    if (cart.length === 0) {
        return (
            <main className="container mx-auto px-6 py-24 min-h-[80vh] flex items-center justify-center">
                <FadeInUp className="text-center">
                    <Package className="mx-auto text-white/10 mb-6" size={64} />
                    <h1 className="text-3xl font-black uppercase tracking-tighter italic mb-4">Cart is Empty</h1>
                    <Link to="/" className="text-neon hover:text-white transition-colors font-bold uppercase tracking-widest text-xs flex items-center gap-2 justify-center">
                        <ArrowLeft size={16} /> Back to Shop
                    </Link>
                </FadeInUp>
            </main>
        );
    }

    return (
        <main className="container mx-auto px-6 py-20">
            <Link to="/" className="inline-flex items-center gap-2 text-white/50 hover:text-neon transition-colors font-bold uppercase tracking-widest text-xs mb-12">
                <ArrowLeft size={16} /> Back to Cart
            </Link>

            <FadeInUp>
                <h1 className="text-4xl font-black uppercase tracking-tighter italic mb-2">Checkout</h1>
                <p className="text-white/40 font-mono text-xs uppercase tracking-widest mb-12">Complete your order</p>
            </FadeInUp>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                {/* Checkout Form */}
                <FadeInUp className="lg:col-span-2">
                    <form onSubmit={handleSubmit} className="space-y-10">
                        {/* Shipping Address */}
                        <div className="glass-card p-8">
                            <h2 className="text-lg font-black uppercase tracking-widest mb-6 flex items-center gap-3">
                                <MapPin className="text-neon" size={20} />
                                Shipping Address
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="md:col-span-2">
                                    <FormField label="Full Name" name="fullName" value={form.fullName} onChange={handleChange} placeholder="John Doe" required />
                                </div>
                                <div className="md:col-span-2">
                                    <FormField label="Street Address" name="address" value={form.address} onChange={handleChange} placeholder="123 Main Street, Apt 4B" required />
                                </div>
                                <FormField label="City" name="city" value={form.city} onChange={handleChange} placeholder="New York" required />
                                <FormField label="Postal Code" name="postalCode" value={form.postalCode} onChange={handleChange} placeholder="10001" required />
                                <div className="md:col-span-2">
                                    <FormField label="Country" name="country" value={form.country} onChange={handleChange} placeholder="United States" required />
                                </div>
                            </div>
                        </div>

                        {/* Payment Method */}
                        <div className="glass-card p-8">
                            <h2 className="text-lg font-black uppercase tracking-widest mb-6 flex items-center gap-3">
                                <CreditCard className="text-neon" size={20} />
                                Payment Method
                            </h2>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                {['Card', 'PayPal', 'Crypto'].map((method) => (
                                    <label key={method} className={`flex items-center gap-3 p-4 rounded-xl border cursor-pointer transition-all ${form.paymentMethod === method ? 'border-neon bg-neon/5' : 'border-white/10 hover:border-white/20'}`}>
                                        <input
                                            type="radio"
                                            name="paymentMethod"
                                            value={method}
                                            checked={form.paymentMethod === method}
                                            onChange={handleChange}
                                            className="hidden"
                                        />
                                        <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${form.paymentMethod === method ? 'border-neon' : 'border-white/30'}`}>
                                            {form.paymentMethod === method && <div className="w-2 h-2 rounded-full bg-neon" />}
                                        </div>
                                        <span className="text-xs font-black uppercase tracking-widest">{method}</span>
                                    </label>
                                ))}
                            </div>
                            <p className="text-white/30 text-[10px] font-mono uppercase tracking-widest mt-4">
                                * Payment is simulated for demonstration purposes.
                            </p>
                        </div>

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className={`w-full py-5 rounded-xl font-black uppercase tracking-widest text-sm flex items-center justify-center gap-3 transition-all duration-300 ${
                                isSubmitting ? 'bg-white/5 text-white/20' : 'bg-neon text-charcoal hover:bg-white neon-glow'
                            }`}
                        >
                            {isSubmitting ? 'Processing Order...' : (
                                <>
                                    <Check size={18} />
                                    Place Order — ${cartTotal.toFixed(2)}
                                </>
                            )}
                        </button>
                    </form>
                </FadeInUp>

                {/* Order Summary */}
                <FadeInUp delay={100}>
                    <div className="glass-card p-8 lg:sticky lg:top-32">
                        <h2 className="text-lg font-black uppercase tracking-widest mb-6 flex items-center gap-3">
                            <ShoppingBag className="text-neon" size={20} />
                            Order Summary
                        </h2>
                        <div className="space-y-4 mb-6">
                            {cart.map((item) => (
                                <div key={item._id} className="flex items-center gap-4">
                                    <div className="w-14 h-14 rounded-lg overflow-hidden bg-white/5 border border-white/10 flex-shrink-0">
                                        <img src={item.imageURL} alt={item.name} className="w-full h-full object-cover opacity-80" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-bold truncate">{item.name}</p>
                                        <p className="text-[10px] text-white/40 font-mono uppercase">Qty: {item.quantity}</p>
                                    </div>
                                    <span className="text-sm font-mono font-bold text-neon">${(item.price * item.quantity).toFixed(2)}</span>
                                </div>
                            ))}
                        </div>
                        <div className="border-t border-white/10 pt-6 space-y-3">
                            <div className="flex justify-between text-sm text-white/60">
                                <span>Subtotal</span>
                                <span className="font-mono">${cartTotal.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-sm text-white/60">
                                <span>Shipping</span>
                                <span className="font-mono text-neon">Free</span>
                            </div>
                            <div className="flex justify-between font-black text-base pt-2 border-t border-white/10">
                                <span>Total</span>
                                <span className="font-mono text-neon">${cartTotal.toFixed(2)}</span>
                            </div>
                        </div>
                    </div>
                </FadeInUp>
            </div>
        </main>
    );
};

const FormField = ({ label, name, value, onChange, placeholder, required }) => (
    <div className="space-y-2">
        <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/60 font-mono pl-1">{label}</label>
        <input
            type="text"
            name={name}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            required={required}
            className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-sm font-mono focus:border-neon focus:outline-none transition-all placeholder:text-white/10"
        />
    </div>
);

export default Checkout;
