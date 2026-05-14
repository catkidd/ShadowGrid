import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const MobileNavAuthLinks = ({ closeMenu }) => {
    const { user, isAdmin } = useAuth();

    return (
        <>
            <Link to="/about" className="text-white/60 hover:text-neon transition-colors py-2" onClick={closeMenu}>About</Link>
            {isAdmin && <Link to="/admin/dashboard" className="text-neon hover:text-white transition-colors py-2" onClick={closeMenu}>Admin</Link>}
            {!user ? (
                <Link to="/login" className="text-white hover:text-neon transition-colors py-2" onClick={closeMenu}>Login</Link>
            ) : (
                <Link 
                    to="/profile"
                    onClick={closeMenu}
                    className="text-neon hover:text-white transition-colors py-2 uppercase text-xs font-bold tracking-widest"
                >
                    Profile ({user.email.split('@')[0]})
                </Link>
            )}
        </>
    );
};

export default MobileNavAuthLinks;
