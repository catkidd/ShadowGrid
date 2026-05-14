import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { API_URL } from '../lib/api';
import toast from 'react-hot-toast';
import { 
    User, Package, Shield, Key, LogOut, 
    ShieldCheck, Activity, Database, Command, 
    Settings, Terminal, Box, Users, ChevronRight,
    TrendingUp, ExternalLink
} from 'lucide-react';

const Profile = () => {
    const { user, token, logout } = useAuth();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('account');
    
    // Password state
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);

    // Orders state
    const [orders, setOrders] = useState([]);
    const [isLoadingOrders, setIsLoadingOrders] = useState(false);

    const fetchOrders = useCallback(async () => {
        setIsLoadingOrders(true);
        try {
            const response = await fetch(`${API_URL}/api/orders/my`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (!response.ok) throw new Error('Failed to fetch orders');
            const data = await response.json();
            setOrders(data);
        } catch (err) {
            toast.error(err.message);
        } finally {
            setIsLoadingOrders(false);
        }
    }, [token]);

    useEffect(() => {
        if (activeTab === 'orders' && orders.length === 0) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            fetchOrders();
        }
    }, [activeTab, orders.length, fetchOrders]);

    const handlePasswordUpdate = async (e) => {
        e.preventDefault();
        if (!currentPassword || !newPassword) {
            return toast.error('Please fill in all password fields');
        }
        if (newPassword.length < 6) {
            return toast.error('New password must be at least 6 characters');
        }
        
        setIsUpdatingPassword(true);
        try {
            const response = await fetch(`${API_URL}/api/auth/password`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ currentPassword, newPassword })
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.message || 'Failed to update password');
            
            toast.success('Password updated successfully');
            setCurrentPassword('');
            setNewPassword('');
        } catch (err) {
            toast.error(err.message);
        } finally {
            setIsUpdatingPassword(false);
        }
    };

    const handleLogout = () => {
        logout();
        toast.success('Logged out successfully.');
        navigate('/login');
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'Processing': return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20';
            case 'Shipped': return 'text-blue-400 bg-blue-400/10 border-blue-400/20';
            case 'Delivered': return 'text-green-400 bg-green-400/10 border-green-400/20';
            case 'Cancelled': return 'text-red-400 bg-red-400/10 border-red-400/20';
            default: return 'text-white/60 bg-white/5 border-white/10';
        }
    };

    if (!user) return null;

    const isAdmin = user.role === 'admin';

    if (isAdmin) {
        return (
            <div className="container mx-auto px-6 py-12 md:py-24 min-h-screen">
                {/* Admin Hero Section */}
                <div className="flex flex-col lg:flex-row gap-10 mb-16">
                    <div className="lg:w-1/3 flex flex-col items-center lg:items-start">
                        <div className="relative group mb-6">
                            <div className="absolute -inset-1 bg-gradient-to-r from-neon to-blue-500 rounded-full blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
                            <div className="relative w-32 h-32 rounded-full bg-charcoal border-2 border-neon/30 overflow-hidden flex items-center justify-center">
                                <Terminal size={48} className="text-neon animate-pulse" />
                            </div>
                            <div className="absolute -bottom-2 -right-2 bg-neon text-charcoal px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border-2 border-charcoal">
                                Superuser
                            </div>
                        </div>
                        <h2 className="text-3xl font-black uppercase tracking-tighter italic text-center lg:text-left mb-2">
                            {user.email.split('@')[0]}
                        </h2>
                        <div className="flex items-center gap-2 text-white/40 font-mono text-[10px] uppercase tracking-widest mb-6">
                            <ShieldCheck size={12} className="text-neon" />
                            System Administrator Access Level 0
                        </div>
                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-2 px-6 py-2 bg-white/5 text-white/40 hover:text-red-400 hover:bg-red-400/10 border border-white/5 hover:border-red-400/20 rounded-full transition-all text-[10px] font-bold uppercase tracking-widest"
                        >
                            <LogOut size={14} />
                            Terminate Session
                        </button>
                    </div>

                    <div className="lg:w-2/3 grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="glass-card p-6 border-l-2 border-l-neon hover:translate-y-[-4px] transition-all cursor-pointer group" onClick={() => navigate('/admin')}>
                            <div className="flex justify-between items-start mb-4">
                                <div className="p-3 bg-neon/10 rounded-xl text-neon">
                                    <Command size={20} />
                                </div>
                                <ExternalLink size={14} className="text-white/20 group-hover:text-neon transition-colors" />
                            </div>
                            <h4 className="text-sm font-bold uppercase tracking-widest mb-1">Command Console</h4>
                            <p className="text-[10px] text-white/40 font-mono uppercase tracking-wider">Access central management system</p>
                        </div>
                        
                        <div className="glass-card p-6 border-l-2 border-l-blue-500 hover:translate-y-[-4px] transition-all">
                            <div className="flex justify-between items-start mb-4">
                                <div className="p-3 bg-blue-500/10 rounded-xl text-blue-500">
                                    <Activity size={20} />
                                </div>
                                <div className="text-[10px] font-mono text-blue-500 uppercase font-bold px-2 py-1 bg-blue-500/5 rounded border border-blue-500/10">Active</div>
                            </div>
                            <h4 className="text-sm font-bold uppercase tracking-widest mb-1">System Health</h4>
                            <p className="text-[10px] text-white/40 font-mono uppercase tracking-wider">Latency: 24ms | Uptime: 99.9%</p>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                    {/* Admin Navigation */}
                    <div className="lg:col-span-4 space-y-4">
                        <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20 mb-6 flex items-center gap-2">
                            <Database size={12} />
                            Core Services
                        </h3>
                        <div className="space-y-2">
                            {[
                                { label: 'Inventory Management', icon: Box, path: '/admin' },
                                { label: 'User Directory', icon: Users, path: '/admin' },
                                { label: 'Secure Protocols', icon: Key, active: true },
                                { label: 'System Settings', icon: Settings, path: '/admin' },
                            ].map((item, i) => (
                                <button
                                    key={i}
                                    onClick={() => item.path && navigate(item.path)}
                                    className={`w-full flex items-center justify-between p-4 rounded-xl border transition-all group ${
                                        item.active 
                                        ? 'bg-neon/10 border-neon/20 text-neon' 
                                        : 'bg-white/5 border-white/5 text-white/60 hover:bg-white/10 hover:border-white/10'
                                    }`}
                                >
                                    <div className="flex items-center gap-4">
                                        <item.icon size={18} className={item.active ? 'text-neon' : 'text-white/20 group-hover:text-white transition-colors'} />
                                        <span className="text-[11px] font-black uppercase tracking-widest">{item.label}</span>
                                    </div>
                                    <ChevronRight size={14} className={item.active ? 'text-neon' : 'text-white/10 group-hover:text-white'} />
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Admin Settings Content */}
                    <div className="lg:col-span-8">
                        <div className="glass-card overflow-hidden">
                            <div className="bg-white/5 border-b border-white/5 px-8 py-6 flex items-center justify-between">
                                <h3 className="text-sm font-black uppercase tracking-widest flex items-center gap-3">
                                    <Key className="text-neon" size={16} />
                                    Security & Authentication
                                </h3>
                                <div className="text-[10px] font-mono text-white/40 uppercase tracking-widest">Modified: Today</div>
                            </div>
                            
                            <div className="p-8 space-y-10">
                                {/* Identity Info */}
                                <div className="bg-charcoal/50 border border-white/5 rounded-2xl p-6 relative overflow-hidden group">
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-neon/5 rounded-full -mr-16 -mt-16 blur-3xl group-hover:bg-neon/10 transition-colors"></div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
                                        <div>
                                            <label className="text-[10px] font-mono uppercase tracking-widest text-white/30 mb-2 block">Authorized Email</label>
                                            <p className="text-sm font-bold tracking-tight">{user.email}</p>
                                        </div>
                                        <div>
                                            <label className="text-[10px] font-mono uppercase tracking-widest text-white/30 mb-2 block">Root ID</label>
                                            <p className="text-sm font-mono text-neon uppercase tracking-tighter">{user._id.toUpperCase()}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Password Update */}
                                <div>
                                    <h4 className="text-[11px] font-black uppercase tracking-[0.2em] mb-6 text-white/60">Update Root Password</h4>
                                    <form onSubmit={handlePasswordUpdate} className="space-y-6">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-mono uppercase tracking-widest text-white/40 ml-1">Current Password</label>
                                                <input
                                                    type="password"
                                                    value={currentPassword}
                                                    onChange={(e) => setCurrentPassword(e.target.value)}
                                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs font-mono focus:border-neon focus:outline-none transition-all"
                                                    placeholder="VERIFY IDENTITY"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-mono uppercase tracking-widest text-white/40 ml-1">New Root Password</label>
                                                <input
                                                    type="password"
                                                    value={newPassword}
                                                    onChange={(e) => setNewPassword(e.target.value)}
                                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs font-mono focus:border-neon focus:outline-none transition-all"
                                                    placeholder="MIN 8 CHARACTERS"
                                                />
                                            </div>
                                        </div>
                                        <button
                                            type="submit"
                                            disabled={isUpdatingPassword}
                                            className="w-full md:w-auto px-10 py-4 bg-neon text-charcoal font-black uppercase tracking-widest text-[10px] rounded-xl hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 neon-glow"
                                        >
                                            {isUpdatingPassword ? 'Syncing...' : 'Override Password'}
                                        </button>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
    
    // Original User Profile
    return (
        <div className="container mx-auto px-6 py-12 md:py-20 min-h-[calc(100vh-80px)]">
            <h2 className="text-3xl font-black tracking-tighter uppercase italic mb-8">
                User <span className="text-neon">Profile</span>
            </h2>

            <div className="flex flex-col md:flex-row gap-8">
                {/* Sidebar */}
                <div className="w-full md:w-64 flex flex-col gap-2">
                    <button
                        onClick={() => setActiveTab('account')}
                        className={`flex items-center gap-3 px-4 py-3 rounded-lg font-bold uppercase tracking-widest text-xs transition-all ${
                            activeTab === 'account' 
                            ? 'bg-neon text-charcoal neon-glow' 
                            : 'bg-white/5 text-white/60 hover:bg-white/10 hover:text-white'
                        }`}
                    >
                        <User size={16} />
                        Account Detail
                    </button>
                    <button
                        onClick={() => setActiveTab('orders')}
                        className={`flex items-center gap-3 px-4 py-3 rounded-lg font-bold uppercase tracking-widest text-xs transition-all ${
                            activeTab === 'orders' 
                            ? 'bg-neon text-charcoal neon-glow' 
                            : 'bg-white/5 text-white/60 hover:bg-white/10 hover:text-white'
                        }`}
                    >
                        <Package size={16} />
                        Order History
                    </button>
                </div>

                {/* Content Area */}
                <div className="flex-1">
                    {activeTab === 'account' && (
                        <div className="glass-card p-6 md:p-8 space-y-10 animate-fade-in">
                            {/* Profile Info */}
                            <div>
                                <h3 className="text-xl font-black uppercase tracking-widest mb-6 flex items-center gap-2">
                                    <Shield className="text-neon" size={20} />
                                    Account Info
                                </h3>
                                <div className="bg-white/5 border border-white/10 rounded-lg p-4 font-mono text-sm">
                                    <p className="text-white/40 uppercase tracking-widest text-[10px] mb-1">Email Address</p>
                                    <p className="text-neon">{user.email}</p>
                                    
                                    <p className="text-white/40 uppercase tracking-widest text-[10px] mt-4 mb-1">Account Role</p>
                                    <p className="text-white uppercase tracking-widest">{user.role || 'User'}</p>
                                </div>
                            </div>

                            {/* Change Password */}
                            <div>
                                <h3 className="text-xl font-black uppercase tracking-widest mb-6 flex items-center gap-2">
                                    <Key className="text-neon" size={20} />
                                    Change Password
                                </h3>
                                <form onSubmit={handlePasswordUpdate} className="space-y-4 max-w-md">
                                    <div>
                                        <label htmlFor="currentPassword" className="block text-[10px] font-mono uppercase tracking-widest text-white/60 mb-2">Current Password</label>
                                        <input
                                            id="currentPassword"
                                            name="currentPassword"
                                            type="password"
                                            value={currentPassword}
                                            onChange={(e) => setCurrentPassword(e.target.value)}
                                            className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-sm font-mono focus:border-neon focus:outline-none transition-all"
                                            placeholder="••••••••"
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="newPassword" className="block text-[10px] font-mono uppercase tracking-widest text-white/60 mb-2">New Password</label>
                                        <input
                                            id="newPassword"
                                            name="newPassword"
                                            type="password"
                                            value={newPassword}
                                            onChange={(e) => setNewPassword(e.target.value)}
                                            className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-sm font-mono focus:border-neon focus:outline-none transition-all"
                                            placeholder="••••••••"
                                        />
                                    </div>
                                    <button
                                        type="submit"
                                        disabled={isUpdatingPassword}
                                        className="px-6 py-3 bg-neon text-charcoal font-black uppercase tracking-widest text-xs rounded-lg hover:scale-[1.02] transition-transform disabled:opacity-50"
                                    >
                                        {isUpdatingPassword ? 'Updating...' : 'Update Password'}
                                    </button>
                                </form>
                            </div>

                            <hr className="border-white/10" />

                            {/* Logout Action */}
                            <div>
                                <button
                                    onClick={handleLogout}
                                    className="flex items-center gap-2 px-6 py-3 bg-red-500/10 text-red-400 border border-red-500/20 rounded-lg font-bold uppercase tracking-widest text-xs hover:bg-red-500/20 hover:border-red-500/40 transition-all"
                                >
                                    <LogOut size={16} />
                                    Secure Logout
                                </button>
                            </div>
                        </div>
                    )}

                    {activeTab === 'orders' && (
                        <div className="animate-fade-in">
                            <h3 className="text-xl font-black uppercase tracking-widest mb-6 flex items-center gap-2">
                                <Package className="text-neon" size={20} />
                                Your Orders
                            </h3>

                            {isLoadingOrders ? (
                                <div className="space-y-6">
                                    {[1, 2, 3].map(i => (
                                        <div key={i} className="glass-card p-6 border-l-4 border-l-white/10 animate-pulse">
                                            <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-6">
                                                <div className="w-24 h-8 bg-white/5 rounded" />
                                                <div className="w-24 h-8 bg-white/5 rounded" />
                                                <div className="w-24 h-8 bg-white/5 rounded" />
                                                <div className="w-20 h-6 bg-white/5 rounded-full" />
                                            </div>
                                            <div className="bg-charcoal/50 rounded-lg p-4 space-y-3">
                                                <div className="w-20 h-4 bg-white/5 rounded mb-3" />
                                                <div className="w-full h-8 bg-white/5 rounded" />
                                                <div className="w-full h-8 bg-white/5 rounded" />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : orders.length === 0 ? (
                                <div className="glass-card p-12 text-center text-white/40 font-mono text-sm uppercase tracking-widest">
                                    No orders found in your secure history.
                                </div>
                            ) : (
                                <div className="space-y-6">
                                    {orders.map((order) => (
                                        <div key={order._id} className="glass-card p-6 border-l-4 border-l-neon">
                                            <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-6">
                                                <div>
                                                    <p className="text-[10px] font-mono text-white/40 uppercase tracking-widest mb-1">Order ID</p>
                                                    <p className="font-mono text-sm font-bold">{order._id.slice(-8).toUpperCase()}</p>
                                                </div>
                                                <div>
                                                    <p className="text-[10px] font-mono text-white/40 uppercase tracking-widest mb-1">Date</p>
                                                    <p className="font-mono text-sm">{new Date(order.createdAt).toLocaleDateString()}</p>
                                                </div>
                                                <div>
                                                    <p className="text-[10px] font-mono text-white/40 uppercase tracking-widest mb-1">Total</p>
                                                    <p className="font-mono text-sm font-bold text-neon">${order.total.toFixed(2)}</p>
                                                </div>
                                                <div>
                                                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${getStatusColor(order.status)}`}>
                                                        {order.status}
                                                    </span>
                                                </div>
                                            </div>
                                            
                                            <div className="bg-charcoal/50 rounded-lg p-4 space-y-3">
                                                <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest border-b border-white/5 pb-2 mb-3">Line Items</p>
                                                {order.items.map((item, idx) => (
                                                    <div key={idx} className="flex justify-between items-center text-sm">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-8 h-8 rounded bg-white/5 overflow-hidden">
                                                                <img src={item.imageURL} alt={item.name} className="w-full h-full object-cover" />
                                                            </div>
                                                            <span className="font-bold uppercase tracking-wide text-xs">{item.name}</span>
                                                        </div>
                                                        <span className="font-mono text-white/60 text-xs">x{item.quantity}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Profile;
