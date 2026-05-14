    User, Package, Key, LogOut, 
    ShoppingBag, CreditCard, Calendar, ChevronRight,
    Mail, Shield, ArrowRight, X, ExternalLink,
    MapPin, Box
} from 'lucide-react';
import { useState } from 'react';

const UserProfileView = ({ 
    user, 
    orders, 
    isLoadingOrders, 
    activeTab, 
    setActiveTab, 
    handleLogout, 
    handlePasswordUpdate, 
    currentPassword, 
    setCurrentPassword, 
    newPassword, 
    setNewPassword, 
    isUpdatingPassword,
    getStatusColor 
}) => {
    const [selectedOrder, setSelectedOrder] = useState(null);
    
    const totalSpent = orders.reduce((acc, order) => acc + order.total, 0);
    const memberSince = new Date(user.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

    const metrics = [
        { label: 'Total Orders', value: orders.length, icon: Package, color: 'text-neon' },
        { label: 'Total Investment', value: `$${totalSpent.toFixed(2)}`, icon: CreditCard, color: 'text-blue-400' },
        { label: 'Member Since', value: memberSince, icon: Calendar, color: 'text-purple-400' },
    ];

    return (
        <div className="container mx-auto px-6 py-12 md:py-20 min-h-screen">
            {/* User Hero Section */}
            <div className="flex flex-col lg:flex-row gap-12 mb-16">
                <div className="lg:w-1/3 flex flex-col items-center lg:items-start">
                    <div className="relative group mb-6">
                        <div className="absolute -inset-1 bg-gradient-to-r from-neon to-purple-500 rounded-full blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>
                        <div className="relative w-32 h-32 rounded-full bg-charcoal border border-white/10 flex items-center justify-center overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-tr from-neon/10 to-transparent"></div>
                            <User size={48} className="text-white/20" />
                        </div>
                    </div>
                    <h2 className="text-3xl font-black uppercase tracking-tighter italic mb-2 text-center lg:text-left">
                        {user.email.split('@')[0]}
                    </h2>
                    <p className="text-white/40 font-mono text-[10px] uppercase tracking-[0.2em] mb-8">Verified Customer Profile</p>
                    
                    <div className="flex flex-col gap-3 w-full max-w-xs">
                        <button
                            onClick={() => setActiveTab('account')}
                            className={`flex items-center justify-between px-6 py-4 rounded-xl font-bold uppercase tracking-widest text-[10px] transition-all ${
                                activeTab === 'account' 
                                ? 'bg-neon text-charcoal neon-glow' 
                                : 'bg-white/5 text-white/60 hover:bg-white/10 hover:text-white'
                            }`}
                        >
                            <div className="flex items-center gap-3">
                                <Shield size={14} />
                                Security Settings
                            </div>
                            <ChevronRight size={14} />
                        </button>
                        <button
                            onClick={() => setActiveTab('orders')}
                            className={`flex items-center justify-between px-6 py-4 rounded-xl font-bold uppercase tracking-widest text-[10px] transition-all ${
                                activeTab === 'orders' 
                                ? 'bg-neon text-charcoal neon-glow' 
                                : 'bg-white/5 text-white/60 hover:bg-white/10 hover:text-white'
                            }`}
                        >
                            <div className="flex items-center gap-3">
                                <ShoppingBag size={14} />
                                Order History
                            </div>
                            <ChevronRight size={14} />
                        </button>
                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-3 px-6 py-4 mt-4 bg-red-500/5 text-red-400/60 hover:text-red-400 hover:bg-red-500/10 border border-red-500/10 rounded-xl transition-all text-[10px] font-bold uppercase tracking-widest"
                        >
                            <LogOut size={14} />
                            Terminate Session
                        </button>
                    </div>
                </div>

                <div className="lg:w-2/3">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                        {metrics.map((metric, i) => (
                            <div key={i} className="glass-card p-6 flex flex-col gap-4 group hover:border-white/20 transition-all">
                                <div className={`p-3 rounded-xl bg-white/5 w-fit ${metric.color}`}>
                                    <metric.icon size={20} />
                                </div>
                                <div>
                                    <p className="text-[10px] font-mono uppercase tracking-widest text-white/40 mb-1">{metric.label}</p>
                                    <p className="text-xl font-black italic tracking-tight">{metric.value}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Content Section */}
                    <div className="glass-card min-h-[400px] overflow-hidden">
                        {activeTab === 'account' ? (
                            <div className="p-8 space-y-12 animate-fade-in">
                                <div>
                                    <h3 className="text-sm font-black uppercase tracking-[0.2em] mb-8 flex items-center gap-3">
                                        <Mail className="text-neon" size={16} />
                                        Identity Verification
                                    </h3>
                                    <div className="bg-white/5 border border-white/5 rounded-2xl p-6">
                                        <label className="text-[10px] font-mono uppercase tracking-widest text-white/30 mb-2 block">Primary Email</label>
                                        <p className="text-sm font-bold tracking-wide text-white/80">{user.email}</p>
                                    </div>
                                </div>

                                <div>
                                    <h3 className="text-sm font-black uppercase tracking-[0.2em] mb-8 flex items-center gap-3">
                                        <Key className="text-neon" size={16} />
                                        Update Credentials
                                    </h3>
                                    <form onSubmit={handlePasswordUpdate} className="space-y-6 max-w-md">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-mono uppercase tracking-widest text-white/40 ml-1">Current Password</label>
                                            <input
                                                type="password"
                                                value={currentPassword}
                                                onChange={(e) => setCurrentPassword(e.target.value)}
                                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs font-mono focus:border-neon focus:outline-none transition-all placeholder:text-white/5"
                                                placeholder="••••••••"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-mono uppercase tracking-widest text-white/40 ml-1">New Secure Password</label>
                                            <input
                                                type="password"
                                                value={newPassword}
                                                onChange={(e) => setNewPassword(e.target.value)}
                                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs font-mono focus:border-neon focus:outline-none transition-all placeholder:text-white/5"
                                                placeholder="MIN 8 CHARACTERS"
                                            />
                                        </div>
                                        <button
                                            type="submit"
                                            disabled={isUpdatingPassword}
                                            className="w-full flex items-center justify-center gap-3 py-4 bg-neon text-charcoal font-black uppercase tracking-widest text-[10px] rounded-xl hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 neon-glow"
                                        >
                                            {isUpdatingPassword ? 'Syncing...' : (
                                                <>
                                                    Update Identity
                                                    <ArrowRight size={14} />
                                                </>
                                            )}
                                        </button>
                                    </form>
                                </div>
                            </div>
                        ) : (
                            <div className="p-8 animate-fade-in">
                                <h3 className="text-sm font-black uppercase tracking-[0.2em] mb-8 flex items-center gap-3">
                                    <ShoppingBag className="text-neon" size={16} />
                                    Transaction Ledger
                                </h3>
                                
                                {isLoadingOrders ? (
                                    <div className="space-y-4">
                                        {[1, 2].map(i => <div key={i} className="h-24 bg-white/5 rounded-xl animate-pulse" />)}
                                    </div>
                                ) : orders.length === 0 ? (
                                    <div className="h-48 flex flex-col items-center justify-center border-2 border-dashed border-white/5 rounded-2xl">
                                        <Package size={32} className="text-white/10 mb-4" />
                                        <p className="text-[10px] font-mono uppercase tracking-widest text-white/30">No transactions recorded</p>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        {orders.map(order => (
                                            <div 
                                                key={order._id} 
                                                onClick={() => setSelectedOrder(order)}
                                                className="glass-card p-4 border-l-2 border-l-neon flex justify-between items-center group hover:bg-white/[0.02] transition-all cursor-pointer"
                                            >
                                                <div className="flex items-center gap-4">
                                                    <div className="p-2 bg-neon/10 rounded-lg text-neon">
                                                        <Box size={16} />
                                                    </div>
                                                    <div>
                                                        <p className="text-[10px] font-mono text-white/30 uppercase tracking-widest mb-1">#{order._id.slice(-8).toUpperCase()}</p>
                                                        <p className="text-xs font-bold uppercase tracking-wide">{new Date(order.createdAt).toLocaleDateString()}</p>
                                                    </div>
                                                </div>
                                                <div className="text-right flex items-center gap-6">
                                                    <div className="hidden md:block">
                                                        <p className="text-[10px] font-mono text-white/20 uppercase tracking-widest mb-1">Items</p>
                                                        <p className="text-xs font-bold">{order.items.length}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-xs font-black text-neon mb-1">${order.total.toFixed(2)}</p>
                                                        <span className={`text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded border ${getStatusColor(order.status)}`}>
                                                            {order.status}
                                                        </span>
                                                    </div>
                                                    <ChevronRight size={14} className="text-white/10 group-hover:text-neon group-hover:translate-x-1 transition-all" />
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

            {/* Detailed Order Modal */}
            {selectedOrder && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8 animate-fade-in">
                    <div className="absolute inset-0 bg-black/90 backdrop-blur-md" onClick={() => setSelectedOrder(null)}></div>
                    <div className="relative w-full max-w-2xl glass-card border-neon/20 overflow-hidden shadow-2xl shadow-neon/10 animate-in zoom-in-95 duration-300">
                        {/* Modal Header */}
                        <div className="bg-white/5 border-b border-white/5 px-6 py-5 flex items-center justify-between">
                            <div>
                                <h3 className="text-sm font-black uppercase tracking-widest flex items-center gap-3">
                                    <ShoppingBag className="text-neon" size={16} />
                                    Order Specification
                                </h3>
                                <p className="text-[10px] font-mono text-white/40 uppercase tracking-widest mt-1">Ref: {selectedOrder._id.toUpperCase()}</p>
                            </div>
                            <button 
                                onClick={() => setSelectedOrder(null)}
                                className="p-2 hover:bg-white/5 rounded-full text-white/40 hover:text-white transition-all"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Modal Content */}
                        <div className="p-6 md:p-8 max-h-[70vh] overflow-y-auto custom-scrollbar">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
                                <div className="space-y-4">
                                    <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30 flex items-center gap-2">
                                        <MapPin size={12} /> Shipping Node
                                    </h4>
                                    <div className="text-xs space-y-1 text-white/70">
                                        <p className="font-bold text-white text-sm">{selectedOrder.shippingAddress.fullName}</p>
                                        <p>{selectedOrder.shippingAddress.address}</p>
                                        <p>{selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.postalCode}</p>
                                        <p className="uppercase tracking-widest text-[10px] pt-1">{selectedOrder.shippingAddress.country}</p>
                                    </div>
                                </div>
                                <div className="space-y-4 text-right md:text-left">
                                    <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30 flex items-center gap-2 md:justify-start justify-end">
                                        <CreditCard size={12} /> Payment Protocol
                                    </h4>
                                    <div className="text-xs space-y-1 text-white/70">
                                        <p className="font-bold text-white text-sm uppercase">{selectedOrder.paymentMethod || 'Secure Card'}</p>
                                        <p>Transaction ID: SG-{selectedOrder._id.slice(-6).toUpperCase()}</p>
                                        <div className="pt-2">
                                            <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full border ${getStatusColor(selectedOrder.status)}`}>
                                                {selectedOrder.status}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-6">
                                <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30">Provisioned Hardware</h4>
                                <div className="space-y-4">
                                    {selectedOrder.items.map((item, i) => (
                                        <div key={i} className="flex items-center gap-4 p-3 bg-white/5 rounded-xl border border-white/5">
                                            <div className="w-16 h-16 rounded-lg bg-charcoal overflow-hidden border border-white/5 flex-shrink-0">
                                                <img src={item.imageURL} alt={item.name} className="w-full h-full object-cover opacity-80" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-xs font-bold truncate uppercase tracking-wide">{item.name}</p>
                                                <p className="text-[10px] font-mono text-white/40 mt-1">QTY: {item.quantity} × ${item.price.toFixed(2)}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-sm font-black text-neon">${(item.price * item.quantity).toFixed(2)}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Modal Footer */}
                        <div className="bg-white/5 border-t border-white/5 px-8 py-6 flex items-center justify-between">
                            <div className="text-[10px] font-mono text-white/40 uppercase tracking-widest">
                                Timestamp: {new Date(selectedOrder.createdAt).toLocaleString()}
                            </div>
                            <div className="flex items-center gap-4">
                                <p className="text-[10px] font-mono text-white/40 uppercase tracking-widest">Total Investment</p>
                                <p className="text-2xl font-black italic tracking-tighter text-neon shadow-neon/20 shadow-lg">${selectedOrder.total.toFixed(2)}</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserProfileView;
