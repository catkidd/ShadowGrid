import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { API_URL } from '../lib/api';
import toast from 'react-hot-toast';

// Separate View Components
import AdminProfileView from '../components/AdminProfileView';
import UserProfileView from '../components/UserProfileView';

const Profile = () => {
    const { user, token, logout } = useAuth();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('account');
    
    // Password state
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);

    // Orders state
    const [orders, setOrders] = useState([]);
    const [isLoadingOrders, setIsLoadingOrders] = useState(false);

    const fetchOrders = useCallback(async () => {
        if (!token) return;
        setIsLoadingOrders(true);
        try {
            const response = await fetch(`${API_URL}/api/orders/my`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (!response.ok) throw new Error('Failed to fetch orders');
            const data = await response.json();
            setOrders(Array.isArray(data) ? data : []);
        } catch (err) {
            toast.error(err.message);
        } finally {
            setIsLoadingOrders(false);
        }
    }, [token]);

    useEffect(() => {
        if (user && user.role !== 'admin') {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            fetchOrders();
        }
    }, [user, fetchOrders]);

    const handlePasswordUpdate = async (e) => {
        e.preventDefault();
        if (!currentPassword || !newPassword) {
            return toast.error('Please fill in all password fields');
        }
        if (newPassword.length < 8) {
            return toast.error('New password must be at least 8 characters');
        }
        
        setIsUpdatingPassword(true);
        try {
            const response = await fetch(`${API_URL}/api/auth/password`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ currentPassword, newPassword })
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.message || 'Failed to update password');
            
            toast.success('Identity credentials updated successfully');
            setCurrentPassword('');
            setNewPassword('');
        } catch (err) {
            toast.error(err.message);
        } finally {
            setIsUpdatingPassword(false);
        }
    };

    const handleLogout = () => {
        logout();
        toast.success('Session terminated successfully.');
        navigate('/login');
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'Processing': return 'text-neon bg-neon/10 border-neon/20';
            case 'Shipped': return 'text-blue-400 bg-blue-400/10 border-blue-400/20';
            case 'Delivered': return 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20';
            case 'Cancelled': return 'text-red-400 bg-red-400/10 border-red-400/20';
            default: return 'text-white/60 bg-white/5 border-white/10';
        }
    };

    if (!user) return null;

    return user.role === 'admin' ? (
        <AdminProfileView 
            user={user}
            handleLogout={handleLogout}
            handlePasswordUpdate={handlePasswordUpdate}
            currentPassword={currentPassword}
            setCurrentPassword={setCurrentPassword}
            newPassword={newPassword}
            setNewPassword={setNewPassword}
            isUpdatingPassword={isUpdatingPassword}
        />
    ) : (
        <UserProfileView 
            user={user}
            orders={orders}
            isLoadingOrders={isLoadingOrders}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            handleLogout={handleLogout}
            handlePasswordUpdate={handlePasswordUpdate}
            currentPassword={currentPassword}
            setCurrentPassword={setCurrentPassword}
            newPassword={newPassword}
            setNewPassword={setNewPassword}
            isUpdatingPassword={isUpdatingPassword}
            getStatusColor={getStatusColor}
        />
    );
};

export default Profile;
