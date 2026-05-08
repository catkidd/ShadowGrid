import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, ArrowRight, ShieldCheck, UserPlus, Eye, EyeOff } from 'lucide-react';
import FadeInUp from '../components/FadeInUp';

const Signup = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (password !== confirmPassword) {
            return setError('Access protocols do not match.');
        }

        setIsSubmitting(true);

        try {
            const apiUrl = import.meta.env.VITE_API_URL || (import.meta.env.DEV ? 'http://localhost:5000' : 'https://shadowgrid-x8m6.onrender.com');
            console.log('Attempting signup connection to:', apiUrl);
            const response = await fetch(`${apiUrl}/api/auth/signup`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();

            if (response.ok) {
                login(data.user, data.token);
                navigate('/');
            } else {
                setError(data.message || 'Registration failed');
            }
        } catch {
            setError('Connection error. Registration portal offline.');
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
                    
                    <h1 className="text-3xl font-black uppercase tracking-tighter mb-2 italic">Create Account</h1>
                    <p className="text-white/40 font-mono text-xs uppercase tracking-widest mb-10">Join the ShadowGrid member network</p>

                    {error && (
                        <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-lg mb-8 text-xs font-mono uppercase tracking-wider flex items-center gap-3">
                            <ShieldCheck size={16} />
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/60 font-mono pl-1">Email Address</label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={18} />
                                <input 
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
                            <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/60 font-mono pl-1">Password</label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={18} />
                                <input 
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
                            <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/60 font-mono pl-1">Confirm Password</label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={18} />
                                <input 
                                    type="password" 
                                    required
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    placeholder="VERIFY PASSWORD"
                                    className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-sm font-mono focus:border-neon focus:outline-none transition-all placeholder:text-white/10"
                                />
                            </div>
                        </div>

                        <button 
                            disabled={isSubmitting}
                            className={`w-full py-5 rounded-xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-3 transition-all duration-300 ${
                                isSubmitting ? 'bg-white/5 text-white/20' : 'bg-neon text-charcoal hover:bg-white neon-glow'
                            }`}
                        >
                            {isSubmitting ? 'Creating Account...' : (
                                <>
                                    Create Account
                                    <ArrowRight size={16} />
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-12 pt-8 border-t border-white/5 text-center">
                        <p className="text-white/40 text-xs font-mono uppercase tracking-widest">
                            Already Registered? <Link to="/login" className="text-neon hover:text-white transition-colors ml-2 underline underline-offset-4">Sign In</Link>
                        </p>
                    </div>
                </div>
            </FadeInUp>
        </main>
    );
};

export default Signup;
