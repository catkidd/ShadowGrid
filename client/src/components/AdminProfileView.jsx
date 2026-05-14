import { 
    ShieldCheck, Activity, Database, Command, 
    Settings, Terminal, Box, Users, ChevronRight,
    Key, LogOut, ExternalLink
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AdminProfileView = ({ user, handleLogout, handlePasswordUpdate, currentPassword, setCurrentPassword, newPassword, setNewPassword, isUpdatingPassword }) => {
    const navigate = useNavigate();

    const adminActions = [
        { label: 'Inventory Management', icon: Box, tab: 'products' },
        { label: 'User Directory', icon: Users, tab: 'users' },
        { label: 'Secure Protocols', icon: Key, active: true },
        { label: 'System Settings', icon: Settings, tab: 'overview' },
    ];

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
                        <div className="absolute -bottom-2 -right-2 bg-neon text-charcoal px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border-2 border-charcoal shadow-neon/20 shadow-lg">
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
                    <div className="glass-card p-6 border-l-2 border-l-neon hover:translate-y-[-4px] transition-all cursor-pointer group shadow-xl shadow-neon/5" onClick={() => navigate('/admin/dashboard')}>
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-3 bg-neon/10 rounded-xl text-neon">
                                <Command size={20} />
                            </div>
                            <ExternalLink size={14} className="text-white/20 group-hover:text-neon transition-colors" />
                        </div>
                        <h4 className="text-sm font-bold uppercase tracking-widest mb-1">Command Console</h4>
                        <p className="text-[10px] text-white/40 font-mono uppercase tracking-wider">Access central management system</p>
                    </div>
                    
                    <div className="glass-card p-6 border-l-2 border-l-blue-500 hover:translate-y-[-4px] transition-all shadow-xl shadow-blue-500/5">
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-3 bg-blue-500/10 rounded-xl text-blue-500">
                                <Activity size={20} />
                            </div>
                            <div className="text-[10px] font-mono text-blue-500 uppercase font-bold px-2 py-1 bg-blue-500/5 rounded border border-blue-500/10 animate-pulse">Active</div>
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
                        {adminActions.map((item, i) => (
                            <button
                                key={i}
                                onClick={() => item.tab && navigate('/admin/dashboard', { state: { activeTab: item.tab } })}
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
                    <div className="glass-card overflow-hidden shadow-2xl">
                        <div className="bg-white/5 border-b border-white/5 px-8 py-6 flex items-center justify-between">
                            <h3 className="text-sm font-black uppercase tracking-widest flex items-center gap-3">
                                <Key className="text-neon" size={16} />
                                Security & Authentication
                            </h3>
                            <div className="text-[10px] font-mono text-white/40 uppercase tracking-widest">Protocol: RSA-4096</div>
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
                                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs font-mono focus:border-neon focus:outline-none transition-all placeholder:text-white/5"
                                                placeholder="VERIFY IDENTITY"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-mono uppercase tracking-widest text-white/40 ml-1">New Root Password</label>
                                            <input
                                                type="password"
                                                value={newPassword}
                                                onChange={(e) => setNewPassword(e.target.value)}
                                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs font-mono focus:border-neon focus:outline-none transition-all placeholder:text-white/5"
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
};

export default AdminProfileView;
