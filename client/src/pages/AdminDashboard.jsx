import { useState, useEffect, useMemo, useCallback } from 'react';
import { API_URL } from '../lib/api';
import { useAuth } from '../context/AuthContext';
import { 
    Plus, Edit, Trash2, LayoutDashboard, Package, 
    Save, X, ShoppingCart, TrendingUp, Box, 
    Search, ChevronRight, Users
} from 'lucide-react';
import toast from 'react-hot-toast';
import FadeInUp from '../components/FadeInUp';

const AdminDashboard = () => {
    const { token, isAdmin, loading: authLoading } = useAuth();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editingProduct, setEditingProduct] = useState(null);
    const [isCreating, setIsCreating] = useState(false);
    const [activeTab, setActiveTab] = useState('overview'); // overview, products, orders
    const [searchQuery, setSearchQuery] = useState('');

    const [formData, setFormData] = useState({
        name: '', brand: '', category: '', price: '', originalPrice: '', discount: '', sku: '', stock: '', imageURL: '', description: '', specs: ''
    });

    const [orders, setOrders] = useState([]);
    const [ordersLoading, setOrdersLoading] = useState(false);

    const [users, setUsers] = useState([]);
    const [usersLoading, setUsersLoading] = useState(false);


    const fetchProducts = useCallback(async () => {
        try {
            const response = await fetch(`${API_URL}/api/products`);
            const data = await response.json();
            setProducts(Array.isArray(data) ? data : []);
        } catch {
            toast.error('Error connecting to the server. Please check your connection.');
        } finally {
            setLoading(false);
        }
    }, []);

    const fetchOrders = useCallback(async () => {
        setOrdersLoading(true);
        try {
            const response = await fetch(`${API_URL}/api/orders`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.ok) {
                const data = await response.json();
                setOrders(Array.isArray(data) ? data : []);
            }
        } catch {
            toast.error('Failed to fetch orders.');
        } finally {
            setOrdersLoading(false);
        }
    }, [token]);

    const fetchUsers = useCallback(async () => {
        setUsersLoading(true);
        try {
            const response = await fetch(`${API_URL}/api/users`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.ok) {
                const data = await response.json();
                setUsers(Array.isArray(data) ? data : []);
            }
        } catch {
            toast.error('Failed to fetch users.');
        } finally {
            setUsersLoading(false);
        }
    }, [token]);

    useEffect(() => {
        if (!authLoading && isAdmin) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            fetchProducts();
            fetchOrders();
            fetchUsers();
        }
    }, [authLoading, isAdmin, fetchProducts, fetchOrders, fetchUsers]);

    const metrics = useMemo(() => {
        const totalStock = products.reduce((sum, p) => sum + (p.stock || 0), 0);
        const totalRevenue = orders.reduce((sum, o) => o.status !== 'Cancelled' ? sum + o.total : sum, 0);
        return {
            revenue: totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2 }),
            orders: orders.length,
            stock: totalStock,
            products: products.length,
            users: users.length
        };
    }, [products, orders, users]);

    const filteredProducts = useMemo(() => {
        return products.filter(p => 
            p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.category.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [products, searchQuery]);

    const handleAction = async (method, url, body = null) => {
        try {
            const response = await fetch(`${API_URL}${url}`, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: body ? JSON.stringify(body) : null
            });

            if (response.ok) {
                toast.success('Operation completed successfully');
                fetchProducts();
                resetForm();
            } else {
                const errData = await response.json();
                toast.error(errData.message || 'Operation failed');
            }
        } catch {
            toast.error('Connection to server lost');
        }
    };

    const handleUpdateOrderStatus = async (orderId, status) => {
        try {
            const response = await fetch(`${API_URL}/api/orders/${orderId}/status`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ status })
            });
            if (response.ok) {
                toast.success(`Order status updated to ${status}`);
                fetchOrders();
            } else {
                const err = await response.json();
                toast.error(err.message || 'Failed to update status');
            }
        } catch {
            toast.error('Connection to server lost');
        }
    };

    const handleUpdateUserRole = async (userId, role) => {
        try {
            const response = await fetch(`${API_URL}/api/users/${userId}/role`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ role })
            });
            if (response.ok) {
                toast.success(`User role updated to ${role}`);
                fetchUsers();
            } else {
                const err = await response.json();
                toast.error(err.message || 'Failed to update user role');
            }
        } catch {
            toast.error('Connection to server lost');
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const payload = {
            ...formData,
            price: parseFloat(formData.price),
            salePrice: formData.salePrice ? parseFloat(formData.salePrice) : parseFloat(formData.price),
            originalPrice: formData.originalPrice ? parseFloat(formData.originalPrice) : parseFloat(formData.price),
            stock: parseInt(formData.stock),
            specs: typeof formData.specs === 'string' ? formData.specs.split(',').map(s => s.trim()) : formData.specs
        };

        if (editingProduct) {
            handleAction('PUT', `/api/products/${editingProduct._id}`, payload);
        } else {
            handleAction('POST', '/api/products', payload);
        }
    };

    const resetForm = () => {
        setFormData({ name: '', brand: '', category: '', price: '', salePrice: '', originalPrice: '', sku: '', stock: '', imageURL: '', description: '', specs: '' });
        setEditingProduct(null);
        setIsCreating(false);
    };

    if (authLoading || (!isAdmin && !token)) return <div className="min-h-screen flex items-center justify-center text-neon font-mono uppercase tracking-[0.3em]">Authenticating...</div>;

    return (
        <main className="container mx-auto px-6 py-12 min-h-screen">
            <FadeInUp>
                {/* Header Area */}
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-6">
                    <div>
                        <h1 className="text-4xl font-black uppercase tracking-tighter italic flex items-center gap-4">
                            <LayoutDashboard className="text-neon" size={32} />
                            Admin Console
                        </h1>
                        <p className="text-white/40 font-mono text-xs uppercase tracking-widest mt-2">Manage your e-commerce operations</p>
                    </div>
                    
                    <div className="flex items-center gap-4">
                        <div className="flex bg-white/5 border border-white/10 rounded-lg p-1">
                            {[
                                { id: 'overview', label: 'Overview', icon: TrendingUp },
                                { id: 'products', label: 'Inventory', icon: Box },
                                { id: 'orders', label: 'Orders', icon: ShoppingCart },
                                { id: 'users', label: 'Users', icon: Users },
                            ].map(tab => (
                                <button
                                    key={tab.id}
                                    onClick={() => {
                                        setActiveTab(tab.id);
                                        resetForm();
                                    }}
                                    className={`flex items-center gap-2 px-4 py-2 rounded-md text-[10px] font-bold uppercase tracking-widest transition-all ${activeTab === tab.id ? 'bg-neon text-charcoal shadow-lg' : 'text-white/40 hover:text-white'}`}
                                >
                                    <tab.icon size={14} />
                                    {tab.label}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Dashboard Overview */}
                {activeTab === 'overview' && (
                    <div className="space-y-10">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
                            <MetricCard label="Total Revenue" value={`$${metrics.revenue}`} icon={TrendingUp} color="text-emerald-400" />
                            <MetricCard label="Total Orders" value={metrics.orders} icon={ShoppingCart} color="text-neon" />
                            <MetricCard label="Total Inventory" value={metrics.stock} icon={Box} color="text-orange-400" />
                            <MetricCard label="Product Range" value={metrics.products} icon={Package} color="text-purple-400" />
                            <MetricCard label="Total Users" value={metrics.users} icon={Users} color="text-blue-400" />
                        </div>
                        
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            <div className="glass-card p-8">
                                <h3 className="text-lg font-bold uppercase tracking-widest mb-6 flex items-center gap-3">
                                    <ShoppingCart className="text-neon" size={20} />
                                    Recent Activity
                                </h3>
                                <div className="space-y-4">
                                    {orders.slice(0, 3).map(order => (
                                        <div key={order._id} className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/5 hover:border-white/10 transition-all">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-full bg-neon/10 flex items-center justify-center text-neon text-xs font-bold">
                                                    {order.user?.email?.charAt(0).toUpperCase() || 'U'}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-bold">{order.user?.email || 'Guest'}</p>
                                                    <p className="text-[10px] text-white/40 uppercase font-mono">{order._id.slice(-8).toUpperCase()} • {new Date(order.createdAt).toLocaleDateString()}</p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-sm font-bold">${order.total.toFixed(2)}</p>
                                                <p className={`text-[10px] uppercase font-bold ${order.status === 'Delivered' ? 'text-emerald-400' : order.status === 'Cancelled' ? 'text-red-400' : 'text-orange-400'}`}>{order.status}</p>
                                            </div>
                                        </div>
                                    ))}
                                    {orders.length === 0 && !ordersLoading && (
                                        <p className="text-white/30 font-mono text-xs uppercase text-center py-4">No orders yet.</p>
                                    )}
                                </div>
                                <button 
                                    onClick={() => setActiveTab('orders')}
                                    className="w-full mt-6 py-3 border border-white/10 rounded-xl text-[10px] font-bold uppercase tracking-widest text-white/40 hover:text-white hover:bg-white/5 transition-all flex items-center justify-center gap-2"
                                >
                                    View All Orders <ChevronRight size={14} />
                                </button>
                            </div>

                            <div className="glass-card p-8 text-center flex flex-col items-center justify-center">
                                <TrendingUp className="text-neon mb-4 opacity-20" size={64} />
                                <h3 className="text-xl font-bold uppercase tracking-widest mb-2">Performance Analytics</h3>
                                <p className="text-white/40 text-xs font-mono max-w-xs uppercase leading-relaxed">Advanced data visualization for revenue trends and customer behavior is currently in development.</p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Inventory Management */}
                {activeTab === 'products' && (
                    <div className="space-y-8">
                        {/* Actions & Filters */}
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                            <div className="relative flex-1 max-w-md">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={18} />
                                <input 
                                    type="text" 
                                    placeholder="Search inventory by name, brand, or category..." 
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-xs font-mono focus:border-neon focus:outline-none transition-all"
                                />
                            </div>
                            <button 
                                onClick={() => setIsCreating(true)}
                                className="bg-neon text-charcoal px-8 py-3 rounded-xl font-black uppercase tracking-widest text-xs flex items-center gap-2 hover:bg-white transition-all shadow-lg"
                            >
                                <Plus size={16} /> Create Product
                            </button>
                        </div>

                        {/* Product Form Modal (Overlay or Inline) */}
                        {(isCreating || editingProduct) && (
                            <div className="glass-card p-8 border-neon/30 animate-in fade-in slide-in-from-top-4 duration-500">
                                <div className="flex items-center justify-between mb-8">
                                    <h2 className="text-2xl font-bold uppercase tracking-widest flex items-center gap-3">
                                        <Package className="text-neon" size={24} />
                                        {editingProduct ? 'Update Product Information' : 'Register New Inventory Item'}
                                    </h2>
                                    <button onClick={resetForm} className="text-white/40 hover:text-white transition-colors">
                                        <X size={24} />
                                    </button>
                                </div>

                                <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                    <div className="lg:col-span-1 space-y-6">
                                        <div className="aspect-square rounded-2xl overflow-hidden bg-white/5 border border-white/10 flex items-center justify-center group relative">
                                            {formData.imageURL ? (
                                                <img src={formData.imageURL} alt="Preview" className="w-full h-full object-cover" />
                                            ) : (
                                                <Package size={48} className="text-white/10" />
                                            )}
                                        </div>
                                        <InputField label="Product Image URL" value={formData.imageURL} onChange={v => setFormData({...formData, imageURL: v})} placeholder="https://..." />
                                    </div>

                                    <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <InputField label="Product Title" value={formData.name} onChange={v => setFormData({...formData, name: v})} placeholder="e.g. ShadowBlade X1" />
                                        <InputField label="Brand" value={formData.brand} onChange={v => setFormData({...formData, brand: v})} placeholder="e.g. ShadowGrid" />
                                        <InputField label="Category" value={formData.category} onChange={v => setFormData({...formData, category: v})} placeholder="Keyboards / Mice / Displays" />
                                        <InputField label="SKU (Unique)" value={formData.sku} onChange={v => setFormData({...formData, sku: v})} placeholder="e.g. SG-KB-001" />
                                        <InputField label="Inventory Count" type="number" value={formData.stock} onChange={v => setFormData({...formData, stock: v})} placeholder="0" />
                                        <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-4">
                                            <InputField label="Sale Price ($)" type="number" value={formData.salePrice} onChange={v => setFormData({...formData, salePrice: v})} placeholder="0.00" />
                                            <InputField label="Original / List Price ($)" type="number" value={formData.originalPrice} onChange={v => setFormData({...formData, originalPrice: v})} placeholder="0.00" />
                                            <InputField label="Display Price ($)" type="number" value={formData.price} onChange={v => setFormData({...formData, price: v})} placeholder="0.00" />
                                        </div>
                                        <div className="md:col-span-2">
                                            <InputField label="Specifications (Comma separated)" value={Array.isArray(formData.specs) ? formData.specs.join(', ') : formData.specs} onChange={v => setFormData({...formData, specs: v})} placeholder="e.g. RGB, Mechanical, Wireless" />
                                        </div>
                                        <div className="md:col-span-2 space-y-2">
                                            <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/60 font-mono pl-1">Product Description</label>
                                            <textarea 
                                                value={formData.description}
                                                onChange={e => setFormData({...formData, description: e.target.value})}
                                                className="w-full h-32 bg-white/5 border border-white/10 rounded-xl p-4 text-sm font-mono focus:border-neon focus:outline-none transition-all resize-none"
                                                placeholder="Enter detailed product description..."
                                            />
                                        </div>
                                        <div className="md:col-span-2 flex justify-end gap-4 mt-4">
                                            <button type="button" onClick={resetForm} className="px-8 py-3 border border-white/10 rounded-xl font-bold uppercase tracking-widest text-[10px] hover:bg-white/5 transition-all text-white/60">Cancel</button>
                                            <button type="submit" className="px-10 py-3 bg-neon text-charcoal rounded-xl font-black uppercase tracking-widest text-[10px] flex items-center gap-2 hover:bg-white transition-all shadow-lg">
                                                <Save size={16} /> {editingProduct ? 'Save Changes' : 'Create Product'}
                                            </button>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        )}

                        {/* Product Table */}
                        <div className="glass-card overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="border-b border-white/5 bg-white/5">
                                            <th className="p-5 text-[10px] font-black uppercase tracking-widest text-white/40">Product Details</th>
                                            <th className="p-5 text-[10px] font-black uppercase tracking-widest text-white/40">Category</th>
                                            <th className="p-5 text-[10px] font-black uppercase tracking-widest text-white/40 text-right">Price</th>
                                            <th className="p-5 text-[10px] font-black uppercase tracking-widest text-white/40 text-center">Stock</th>
                                            <th className="p-5 text-[10px] font-black uppercase tracking-widest text-white/40 text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-white/5">
                                        {loading ? (
                                            <tr>
                                                <td colSpan="5" className="p-20 text-center text-white/20 font-mono animate-pulse uppercase tracking-[0.2em]">Synchronizing Inventory...</td>
                                            </tr>
                                        ) : filteredProducts.length === 0 ? (
                                            <tr>
                                                <td colSpan="5" className="p-20 text-center text-white/40 font-mono uppercase tracking-[0.2em]">No products found matching your search.</td>
                                            </tr>
                                        ) : (
                                            filteredProducts.map(product => (
                                                <tr key={product._id} className="hover:bg-white/[0.02] transition-colors group">
                                                    <td className="p-5">
                                                        <div className="flex items-center gap-4">
                                                            <div className="w-12 h-12 rounded-lg overflow-hidden bg-white/5 border border-white/5">
                                                                <img src={product.imageURL} alt="" className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity" />
                                                            </div>
                                                            <div>
                                                                <p className="text-sm font-bold text-white group-hover:text-neon transition-colors">{product.name}</p>
                                                                <p className="text-[10px] text-white/30 uppercase font-mono">{product.brand}</p>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="p-5">
                                                        <span className="text-[10px] font-bold uppercase tracking-widest px-3 py-1 bg-white/5 rounded-full text-white/60">{product.category}</span>
                                                    </td>
                                                    <td className="p-5 text-right font-mono font-bold text-neon">${product.price.toFixed(2)}</td>
                                                    <td className="p-5 text-center font-mono">
                                                        <span className={`text-xs font-bold ${product.stock < 10 ? 'text-orange-400' : 'text-emerald-400'}`}>{product.stock}</span>
                                                    </td>
                                                    <td className="p-5 text-right">
                                                        <div className="flex items-center justify-end gap-2">
                                                            <button 
                                                                onClick={() => {
                                                                    setEditingProduct(product);
                                                                    setFormData({
                                                                        name: product.name,
                                                                        brand: product.brand,
                                                                        category: product.category,
                                                                        price: product.price,
                                                                        salePrice: product.salePrice || '',
                                                                        originalPrice: product.originalPrice || '',
                                                                        sku: product.sku || '',
                                                                        stock: product.stock,
                                                                        imageURL: product.imageURL,
                                                                        description: product.description,
                                                                        specs: product.specs || []
                                                                    });
                                                                    setIsCreating(false);
                                                                }}
                                                                className="p-2 text-white/20 hover:text-neon transition-colors"
                                                            >
                                                                <Edit size={16} />
                                                            </button>
                                                            <button 
                                                                onClick={() => {
                                                                    if (window.confirm('Delete this product from inventory?')) {
                                                                        handleAction('DELETE', `/api/products/${product._id}`);
                                                                    }
                                                                }}
                                                                className="p-2 text-white/20 hover:text-red-500 transition-colors"
                                                            >
                                                                <Trash2 size={16} />
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )}

                {/* Order Management */}
                {activeTab === 'orders' && (
                    <div className="space-y-8">
                        <div className="flex items-center justify-between">
                            <h3 className="text-xl font-bold uppercase tracking-widest">Order History</h3>
                            <div className="flex items-center gap-2 text-white/40 text-[10px] font-mono uppercase">
                                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                                Real-time monitoring active
                            </div>
                        </div>

                        <div className="glass-card overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="border-b border-white/5 bg-white/5">
                                            <th className="p-5 text-[10px] font-black uppercase tracking-widest text-white/40">Order ID</th>
                                            <th className="p-5 text-[10px] font-black uppercase tracking-widest text-white/40">Customer</th>
                                            <th className="p-5 text-[10px] font-black uppercase tracking-widest text-white/40">Date</th>
                                            <th className="p-5 text-[10px] font-black uppercase tracking-widest text-white/40">Status</th>
                                            <th className="p-5 text-[10px] font-black uppercase tracking-widest text-white/40 text-right">Total</th>
                                            <th className="p-5 text-[10px] font-black uppercase tracking-widest text-white/40 text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-white/5">
                                        {ordersLoading ? (
                                            <tr><td colSpan="6" className="p-20 text-center text-white/20 font-mono animate-pulse uppercase tracking-[0.2em]">Loading Orders...</td></tr>
                                        ) : orders.length === 0 ? (
                                            <tr><td colSpan="6" className="p-20 text-center text-white/40 font-mono uppercase tracking-[0.2em]">No orders in the system yet.</td></tr>
                                        ) : (
                                            orders.map(order => (
                                                <tr key={order._id} className="hover:bg-white/[0.02] transition-colors">
                                                    <td className="p-5 text-xs font-mono font-bold text-white">{order._id.slice(-8).toUpperCase()}</td>
                                                    <td className="p-5 text-xs font-bold text-white/80">{order.user?.email || 'Unknown'}</td>
                                                    <td className="p-5 text-xs text-white/40 font-mono">{new Date(order.createdAt).toLocaleDateString()}</td>
                                                    <td className="p-5">
                                                        <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full border ${
                                                            order.status === 'Delivered' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                                                            order.status === 'Processing' ? 'bg-neon/10 text-neon border-neon/20' :
                                                            order.status === 'Cancelled' ? 'bg-red-500/10 text-red-400 border-red-500/20' :
                                                            'bg-white/10 text-white/60 border-white/20'
                                                        }`}>
                                                            {order.status}
                                                        </span>
                                                    </td>
                                                    <td className="p-5 text-right font-mono font-bold text-white">${order.total.toFixed(2)}</td>
                                                    <td className="p-5 text-right">
                                                        <select
                                                            value={order.status}
                                                            onChange={(e) => handleUpdateOrderStatus(order._id, e.target.value)}
                                                            className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-[10px] font-mono uppercase text-white/60 focus:border-neon focus:outline-none cursor-pointer"
                                                        >
                                                            {['Processing', 'Shipped', 'Delivered', 'Cancelled'].map(s => (
                                                                <option key={s} value={s} className="bg-gray-900">{s}</option>
                                                            ))}
                                                        </select>
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )}

                {/* User Management */}
                {activeTab === 'users' && (
                    <div className="space-y-8">
                        <div className="flex items-center justify-between">
                            <h3 className="text-xl font-bold uppercase tracking-widest">User Directory</h3>
                            <div className="text-white/40 text-[10px] font-mono uppercase">
                                Access Control Management
                            </div>
                        </div>

                        <div className="glass-card overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="border-b border-white/5 bg-white/5">
                                            <th className="p-5 text-[10px] font-black uppercase tracking-widest text-white/40">User Email</th>
                                            <th className="p-5 text-[10px] font-black uppercase tracking-widest text-white/40">Registration Date</th>
                                            <th className="p-5 text-[10px] font-black uppercase tracking-widest text-white/40">Current Role</th>
                                            <th className="p-5 text-[10px] font-black uppercase tracking-widest text-white/40 text-right">Change Role</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-white/5">
                                        {usersLoading ? (
                                            <tr><td colSpan="4" className="p-20 text-center text-white/20 font-mono animate-pulse uppercase tracking-[0.2em]">Synchronizing User Database...</td></tr>
                                        ) : users.length === 0 ? (
                                            <tr><td colSpan="4" className="p-20 text-center text-white/40 font-mono uppercase tracking-[0.2em]">No users registered yet.</td></tr>
                                        ) : (
                                            users.map(user => (
                                                <tr key={user._id} className="hover:bg-white/[0.02] transition-colors">
                                                    <td className="p-5">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-xs font-bold text-white/40 border border-white/10">
                                                                {user.email.charAt(0).toUpperCase()}
                                                            </div>
                                                            <span className="text-xs font-bold text-white">{user.email}</span>
                                                        </div>
                                                    </td>
                                                    <td className="p-5 text-xs text-white/40 font-mono">{new Date(user.createdAt).toLocaleDateString()}</td>
                                                    <td className="p-5">
                                                        <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full border ${
                                                            user.role === 'admin' ? 'bg-purple-500/10 text-purple-400 border-purple-500/20' : 'bg-white/10 text-white/60 border-white/20'
                                                        }`}>
                                                            {user.role}
                                                        </span>
                                                    </td>
                                                    <td className="p-5 text-right">
                                                        <select
                                                            value={user.role}
                                                            onChange={(e) => handleUpdateUserRole(user._id, e.target.value)}
                                                            className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-[10px] font-mono uppercase text-white/60 focus:border-neon focus:outline-none cursor-pointer"
                                                        >
                                                            {['user', 'admin'].map(r => (
                                                                <option key={r} value={r} className="bg-gray-900">{r}</option>
                                                            ))}
                                                        </select>
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )}
            </FadeInUp>
        </main>
    );
};

const MetricCard = ({ label, value, icon: Icon, color }) => (
    <div className="glass-card p-6 flex items-center gap-5 group hover:border-white/20 transition-all">
        <div className={`p-4 rounded-2xl bg-white/5 border border-white/5 group-hover:scale-110 transition-transform ${color}`}>
            <Icon size={24} />
        </div>
        <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/40 font-mono mb-1">{label}</p>
            <p className="text-2xl font-black italic tracking-tighter">{value}</p>
        </div>
    </div>
);

const InputField = ({ label, type = 'text', value, onChange, placeholder }) => (
    <div className="space-y-2">
        <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/60 font-mono pl-1">{label}</label>
        <input 
            type={type} 
            value={value}
            onChange={e => onChange(e.target.value)}
            placeholder={placeholder}
            className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-sm font-mono focus:border-neon focus:outline-none transition-all placeholder:text-white/10"
        />
    </div>
);

export default AdminDashboard;
