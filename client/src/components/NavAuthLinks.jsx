import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const NavAuthLinks = () => {
    const { user, isAdmin } = useAuth();
    
    return (
        <>
            <Link to="/about" className="text-white/70 hover:text-neon transition-colors text-xs font-black uppercase tracking-widest">About</Link>
            {isAdmin && <Link to="/admin/dashboard" className="text-neon hover:text-white transition-colors text-xs font-black uppercase tracking-widest">Admin</Link>}
            {!user ? (
                <Link to="/login" className="text-white/70 hover:text-neon transition-colors text-xs font-black uppercase tracking-widest">Login</Link>
            ) : null}
        </>
    );
};


export default NavAuthLinks;
