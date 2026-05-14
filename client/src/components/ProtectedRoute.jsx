import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Loader from './Loader';

const ProtectedRoute = ({ children, adminOnly = false }) => {
    const { user, isAdmin, loading } = useAuth();
    
    if (loading) return <Loader fullScreen text="Verifying Access" />;
    
    if (!user) return <Navigate to="/login" replace />;
    if (adminOnly && !isAdmin) return <Navigate to="/login" replace />;
    
    return children;
};

export default ProtectedRoute;
