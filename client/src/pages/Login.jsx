import { useState } from 'react';
import { API_URL } from '../lib/api';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Zap, Mail, Lock, ArrowRight, Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';
import FadeInUp from '../components/FadeInUp';
import { ButtonLoader } from '../components/Loader';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

            try {
                const response = await fetch(`${API_URL}/api/auth/login`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, password })
                });

            const data = await response.json();

            if (response.ok) {
                toast.success('Login successful. Welcome back.');
                login(data.user, data.token, rememberMe);
                navigate(data.user.role === 'admin' ? '/admin/dashboard' : '/');
            } else {
                toast.error(data.message || 'Invalid credentials.');
            }
        } catch {
            toast.error('Connection error. Server offline.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <main className="container mx-auto px-6 py-24 min-h-[80vh] flex items-center justify-center">
            <FadeInUp className="w-full max-w-md">
                <div className="glass-card p-10 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4">
                        <Zap className="text-neon animate-pulse" size={24} />
                    </div>
                    
                    <h1 className="text-3xl font-black uppercase tracking-tighter mb-2 italic">Login</h1>
                    <p className="text-white/40 font-mono text-xs uppercase tracking-widest mb-10">Login to your account</p>


                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <label htmlFor="email" className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/60 font-mono pl-1">Email Address</label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={18} />
                                <input 
                                    id="email"
                                    name="email"
                                    type="email" 
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="yourname@email.com"
                                    className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-sm font-mono focus:border-neon focus:outline-none transition-all placeholder:text-white/10"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="password" className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/60 font-mono pl-1">Password</label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={18} />
                                <input 
                                    id="password"
                                    name="password"
                                    type={showPassword ? "text" : "password"} 
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-12 pr-12 text-sm font-mono focus:border-neon focus:outline-none transition-all placeholder:text-white/10"
                                />
                                <button 
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-white/20 hover:text-white transition-colors"
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>

                        <div className="flex items-center justify-between">
                            <label htmlFor="rememberMe" className="flex items-center gap-3 cursor-pointer group select-none">
                                <div className="relative">
                                    <input 
                                        id="rememberMe"
                                        name="rememberMe"
                                        type="checkbox" 
                                        className="hidden peer"
                                        checked={rememberMe}
                                        onChange={() => setRememberMe(!rememberMe)}
                                    />
                                    <div className="w-5 h-5 border border-white/10 rounded bg-white/5 peer-checked:bg-neon peer-checked:border-neon transition-all flex items-center justify-center">
                                        <Zap size={10} className={`text-charcoal transition-opacity ${rememberMe ? 'opacity-100' : 'opacity-0'}`} fill="currentColor" />
                                    </div>
                                </div>
                                <span className="text-[10px] font-bold uppercase tracking-widest text-white/40 group-hover:text-white/60 transition-colors">Remember Me</span>
                            </label>
                            
                            <Link to="/contact" className="text-[10px] font-bold uppercase tracking-widest text-white/20 hover:text-neon transition-colors">Forgot Password?</Link>
                        </div>

                        <button 
                            disabled={isSubmitting}
                            className={`w-full py-5 rounded-xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-3 transition-all duration-300 ${
                                isSubmitting ? 'bg-white/5 text-white/20' : 'bg-neon text-charcoal hover:bg-white neon-glow'
                            }`}
                        >
                            {isSubmitting ? (
                                <>
                                    <ButtonLoader />
                                    Verifying...
                                </>
                            ) : (
                                <>
                                    Login
                                    <ArrowRight size={16} />
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-12 pt-8 border-t border-white/5 text-center">
                        <p className="text-white/40 text-xs font-mono uppercase tracking-widest">
                            New Member? <Link to="/signup" className="text-neon hover:text-white transition-colors ml-2 underline underline-offset-4">Sign Up</Link>
                        </p>
                    </div>
                </div>
            </FadeInUp>
        </main>
    );
};

export default Login;
