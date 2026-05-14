import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, adminOnly = false }) => {
    const { user, isAdmin, loading } = useAuth();
    
    if (loading) return <div className="min-h-screen flex items-center justify-center text-neon font-mono uppercase tracking-[0.3em]">Checking Authorization...</div>;
    
    if (!user) return <Navigate to="/login" replace />;
    if (adminOnly && !isAdmin) return <Navigate to="/login" replace />;
    
    return children;
};

export default ProtectedRoute;
