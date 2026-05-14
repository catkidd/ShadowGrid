import { useState } from 'react';
import { API_URL } from '../lib/api';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, ArrowRight, UserPlus, Eye, EyeOff, Users, ChevronRight } from 'lucide-react';
import toast from 'react-hot-toast';
import FadeInUp from '../components/FadeInUp';

const Signup = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [role, setRole] = useState('user');
    const [showPassword, setShowPassword] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            return toast.error('Passwords do not match.');
        }

        setIsSubmitting(true);

        try {
            const response = await fetch(`${API_URL}/api/auth/signup`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password, role })
            });

            const data = await response.json();

            if (response.ok) {
                toast.success('Account created successfully. Welcome to ShadowGrid.');
                login(data.user, data.token);
                navigate('/');
            } else {
                toast.error(data.message || 'Sign up failed');
            }
        } catch {
            toast.error('Connection error. Registration server offline.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <main className="container mx-auto px-6 py-24 min-h-[80vh] flex items-center justify-center">
            <FadeInUp className="w-full max-w-md">
                <div className="glass-card p-10 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4">
                        <UserPlus className="text-neon animate-pulse" size={24} />
                    </div>
                    
                    <h1 className="text-3xl font-black uppercase tracking-tighter mb-2 italic">Sign Up</h1>
                    <p className="text-white/40 font-mono text-xs uppercase tracking-widest mb-10">Create your ShadowGrid account</p>


                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <label htmlFor="signupEmail" className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/60 font-mono pl-1">Email Address</label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={18} />
                                <input 
                                    id="signupEmail"
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
                            <label htmlFor="signupPassword" className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/60 font-mono pl-1">Password</label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={18} />
                                <input 
                                    id="signupPassword"
                                    name="password"
                                    type={showPassword ? "text" : "password"} 
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="MIN 8 CHARACTERS"
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

                        <div className="space-y-2">
                            <label htmlFor="signupConfirmPassword" className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/60 font-mono pl-1">Confirm Password</label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={18} />
                                <input 
                                    id="signupConfirmPassword"
                                    name="confirmPassword"
                                    type="password" 
                                    required
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    placeholder="VERIFY PASSWORD"
                                    className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-sm font-mono focus:border-neon focus:outline-none transition-all placeholder:text-white/10"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="signupRole" className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/60 font-mono pl-1">Account Type</label>
                            <div className="relative">
                                <Users className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={18} />
                                <select 
                                    id="signupRole"
                                    name="role"
                                    value={role}
                                    onChange={(e) => setRole(e.target.value)}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-sm font-mono focus:border-neon focus:outline-none transition-all text-white/60 cursor-pointer appearance-none"
                                >
                                    <option value="user" className="bg-[#0D0D0D] text-white">Standard User</option>
                                    <option value="admin" className="bg-[#0D0D0D] text-white">Administrator</option>
                                </select>
                                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-white/20">
                                    <ChevronRight size={16} className="rotate-90" />
                                </div>
                            </div>
                        </div>

                        <button 
                            disabled={isSubmitting}
                            className={`w-full py-5 rounded-xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-3 transition-all duration-300 ${
                                isSubmitting ? 'bg-white/5 text-white/20' : 'bg-neon text-charcoal hover:bg-white neon-glow'
                            }`}
                        >
                            {isSubmitting ? 'Signing Up...' : (
                                <>
                                    Sign Up
                                    <ArrowRight size={16} />
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-12 pt-8 border-t border-white/5 text-center">
                        <p className="text-white/40 text-xs font-mono uppercase tracking-widest">
                            Already Registered? <Link to="/login" className="text-neon hover:text-white transition-colors ml-2 underline underline-offset-4">Login</Link>
                        </p>
                    </div>
                </div>
            </FadeInUp>
        </main>
    );
};

export default Signup;
