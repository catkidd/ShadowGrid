import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { API_URL } from '../lib/api';
import toast from 'react-hot-toast';
import { User, Package, Shield, Key, LogOut } from 'lucide-react';

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

    useEffect(() => {
        if (activeTab === 'orders' && orders.length === 0) {
            fetchOrders();
        }
    }, [activeTab]);

    const fetchOrders = async () => {
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
    };

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
