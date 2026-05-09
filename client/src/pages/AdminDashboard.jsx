import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
    Plus, Edit, Trash2, LayoutDashboard, Package, 
    Save, X, AlertCircle, CheckCircle2 
} from 'lucide-react';
import toast from 'react-hot-toast';
import FadeInUp from '../components/FadeInUp';

const AdminDashboard = () => {
    const { token, isAdmin, loading: authLoading } = useAuth();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editingProduct, setEditingProduct] = useState(null);
    const [isCreating, setIsCreating] = useState(false);

    const [formData, setFormData] = useState({
        name: '', brand: '', category: '', price: '', stock: '', imageURL: '', description: '', specs: ''
    });

    const fetchProducts = async () => {
        try {
            const apiUrl = import.meta.env.VITE_API_URL || (import.meta.env.DEV ? 'http://localhost:5000' : 'https://shadowgrid-x8m6.onrender.com');
            const response = await fetch(`${apiUrl}/api/products`);
            const data = await response.json();
            setProducts(data);
        } catch {
            toast.error('Connection error. Registration portal offline.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!authLoading && isAdmin) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            fetchProducts();
        }
    }, [authLoading, isAdmin]);

    const handleAction = async (method, url, body = null) => {
        try {
            const apiUrl = import.meta.env.VITE_API_URL || (import.meta.env.DEV ? 'http://localhost:5000' : 'https://shadowgrid-x8m6.onrender.com');
            const response = await fetch(`${apiUrl}${url}`, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: body ? JSON.stringify(body) : null
            });

            if (response.ok) {
                toast.success('Operation protocol successful');
                fetchProducts();
                resetForm();
            } else {
                const errData = await response.json();
                toast.error(errData.message || 'Operation failure');
            }
        } catch {
            toast.error('Neural link interrupted');
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const payload = {
            ...formData,
            price: parseFloat(formData.price),
            stock: parseInt(formData.stock),
            specs: formData.specs.split(',').map(s => s.trim())
        };

        if (editingProduct) {
            handleAction('PUT', `/api/products/${editingProduct._id}`, payload);
        } else {
            handleAction('POST', '/api/products', payload);
        }
    };

    const resetForm = () => {
        setFormData({ name: '', brand: '', category: '', price: '', stock: '', imageURL: '', description: '', specs: '' });
        setEditingProduct(null);
        setIsCreating(false);
    };

    if (authLoading || (!isAdmin && !token)) return <div className="min-h-screen flex items-center justify-center text-neon font-mono uppercase tracking-[0.3em]">Authenticating...</div>;

    return (
        <main className="container mx-auto px-6 py-20 min-h-screen">
            <FadeInUp>
                <div className="flex items-center justify-between mb-12 border-b border-white/10 pb-8">
                    <div>
                        <h1 className="text-4xl font-black uppercase tracking-tighter italic flex items-center gap-4">
                            <LayoutDashboard className="text-neon" size={32} />
                            Admin Dashboard
                        </h1>
                        <p className="text-white/40 font-mono text-xs uppercase tracking-widest mt-2">Product Management Console</p>
                    </div>
                    <button 
                        onClick={() => setIsCreating(true)}
                        className="bg-neon text-charcoal px-6 py-3 rounded-lg font-black uppercase tracking-widest text-xs flex items-center gap-2 hover:bg-white transition-all neon-glow"
                    >
                        <Plus size={16} /> Add New Product
                    </button>
                </div>


                {(isCreating || editingProduct) ? (
                    <div className="glass-card p-10 max-w-4xl mx-auto mb-16">
                        <div className="flex items-center justify-between mb-10">
                            <h2 className="text-2xl font-bold uppercase tracking-widest flex items-center gap-3">
                                <Package className="text-neon" size={24} />
                                {editingProduct ? 'Edit Product' : 'Add New Product'}
                            </h2>
                            <button onClick={resetForm} className="text-white/40 hover:text-white transition-colors">
                                <X size={24} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-6">
                                <InputField label="Product Name" value={formData.name} onChange={v => setFormData({...formData, name: v})} placeholder="SHADOWBLADE X1" />
                                <InputField label="Brand" value={formData.brand} onChange={v => setFormData({...formData, brand: v})} placeholder="SHADOWGRID" />
                                <InputField label="Category" value={formData.category} onChange={v => setFormData({...formData, category: v})} placeholder="KEYBOARDS" />
                                <InputField label="Image URL" value={formData.imageURL} onChange={v => setFormData({...formData, imageURL: v})} placeholder="HTTPS://IMAGES.UNSPLASH.COM/..." />
                            </div>
                            <div className="space-y-6">
                                <div className="grid grid-cols-2 gap-4">
                                    <InputField label="Price ($)" type="number" value={formData.price} onChange={v => setFormData({...formData, price: v})} placeholder="189.99" />
                                    <InputField label="Stock Quantity" type="number" value={formData.stock} onChange={v => setFormData({...formData, stock: v})} placeholder="15" />
                                </div>
                                <InputField label="Specs (Comma separated)" value={formData.specs} onChange={v => setFormData({...formData, specs: v})} placeholder="RGB, OPTICAL, ALUMINUM" />
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/60 font-mono">Product Description</label>
                                    <textarea 
                                        value={formData.description}
                                        onChange={e => setFormData({...formData, description: e.target.value})}
                                        className="w-full h-32 bg-white/5 border border-white/10 rounded-xl p-4 text-sm font-mono focus:border-neon focus:outline-none transition-all resize-none"
                                        placeholder="Enter product details..."
                                    />
                                </div>
                            </div>
                            <div className="md:col-span-2 flex justify-end gap-4 pt-4">
                                <button type="button" onClick={resetForm} className="px-8 py-4 border border-white/10 rounded-xl font-bold uppercase tracking-widest text-[10px] hover:bg-white/5 transition-all">Cancel</button>
                                <button type="submit" className="px-10 py-4 bg-neon text-charcoal rounded-xl font-black uppercase tracking-widest text-[10px] flex items-center gap-2 hover:bg-white transition-all neon-glow">
                                    <Save size={16} /> Save Product
                                </button>
                            </div>
                        </form>
                    </div>
                ) : null}

                <div className="grid grid-cols-1 gap-4">
                    {loading ? (
                        <div className="text-center py-20 text-white/20 font-mono animate-pulse">Loading Products...</div>
                    ) : products.length === 0 ? (
                        <div className="text-center py-20 border border-dashed border-white/10 rounded-2xl text-white/40">No Products Found</div>
                    ) : (
                        products.map(product => (
                            <div key={product._id} className="glass-card p-6 flex items-center justify-between group hover:border-neon/30 transition-all">
                                <div className="flex items-center gap-6">
                                    <div className="w-16 h-16 rounded-lg overflow-hidden bg-white/5">
                                        <img src={product.imageURL} alt={product.name} className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold uppercase tracking-tight">{product.name}</h3>
                                        <p className="text-white/40 font-mono text-[10px] uppercase tracking-widest">{product.category} | {product.brand}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-12">
                                    <div className="text-right font-mono">
                                        <p className="text-white/20 text-[10px] uppercase mb-1">Status</p>
                                        <p className={`text-xs font-bold ${product.stock < 10 ? 'text-orange-400' : 'text-emerald-400'}`}>{product.stock} In Stock</p>
                                    </div>
                                    <div className="text-right font-mono">
                                        <p className="text-white/20 text-[10px] uppercase mb-1">Price</p>
                                        <p className="text-neon font-bold">${product.price}</p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <button 
                                            onClick={() => {
                                                setEditingProduct(product);
                                                setFormData({
                                                    name: product.name,
                                                    brand: product.brand,
                                                    category: product.category,
                                                    price: product.price,
                                                    stock: product.stock,
                                                    imageURL: product.imageURL,
                                                    description: product.description,
                                                    specs: product.specs.join(', ')
                                                });
                                                setIsCreating(false);
                                            }}
                                            className="p-3 text-white/40 hover:text-neon hover:bg-white/5 rounded-lg transition-all"
                                        >
                                            <Edit size={18} />
                                        </button>
                                        <button 
                                            onClick={() => {
                                                if (window.confirm('Are you sure you want to delete this product?')) {
                                                    handleAction('DELETE', `/api/products/${product._id}`);
                                                }
                                            }}
                                            className="p-3 text-white/40 hover:text-red-500 hover:bg-red-500/5 rounded-lg transition-all"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </FadeInUp>
        </main>
    );
};

const InputField = ({ label, type = 'text', value, onChange, placeholder }) => (
    <div className="space-y-2">
        <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/60 font-mono pl-1">{label}</label>
        <input 
            type={type} 
            value={value}
            onChange={e => onChange(e.target.value)}
            placeholder={placeholder}
            className="w-full bg-white/5 border border-white/10 rounded-xl py-4 px-4 text-sm font-mono focus:border-neon focus:outline-none transition-all placeholder:text-white/10"
        />
    </div>
);

export default AdminDashboard;
