import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children }) => {
    const { isAdmin, loading } = useAuth();
    if (loading) return <div className="min-h-screen flex items-center justify-center text-neon font-mono uppercase tracking-[0.3em]">Checking Authorization...</div>;
    if (!isAdmin) return <Navigate to="/login" replace />;
    return children;
};


export default ProtectedRoute;
