import { Link } from 'react-router-dom';
import { ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const NavProfile = () => {
    const { user } = useAuth();
    if (!user) return null;

    return (
        <Link 
            to="/profile"
            className="hidden md:flex items-center gap-2 px-3 py-1 bg-white/5 border border-white/10 rounded-full hover:border-neon/50 transition-all group"
            title="Profile"
        >
            <ShieldCheck size={14} className="text-neon" />
            <span className="text-[10px] font-mono uppercase tracking-widest group-hover:text-neon transition-colors">{user.email.split('@')[0]}</span>
        </Link>
    );
};

export default NavProfile;
