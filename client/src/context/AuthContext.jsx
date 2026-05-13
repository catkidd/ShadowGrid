import { createContext, useContext, useState, useEffect } from 'react';
import { API_URL } from '../lib/api';

const AuthContext = createContext();

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(() => localStorage.getItem('shadowgrid-token') || sessionStorage.getItem('shadowgrid-token'));
    const [loading, setLoading] = useState(true);

    const logout = () => {
        setToken(null);
        setUser(null);
        localStorage.removeItem('shadowgrid-token');
        sessionStorage.removeItem('shadowgrid-token');
    };

    useEffect(() => {
        const fetchUser = async () => {
            if (!token) {
                setLoading(false);
                return;
            }

            try {
                const response = await fetch(`${API_URL}/api/auth/me`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (response.ok) {
                    const userData = await response.json();
                    setUser(userData);
                } else {
                    // Token might be invalid or expired
                    logout();
                }
            } catch (err) {
                console.error('Auth check failed:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, [token]);

    const login = (userData, userToken, rememberMe = false) => {
        setToken(userToken);
        setUser(userData);
        if (rememberMe) {
            localStorage.setItem('shadowgrid-token', userToken);
        } else {
            sessionStorage.setItem('shadowgrid-token', userToken);
        }
    };

    return (
        <AuthContext.Provider value={{ user, token, loading, login, logout, isAdmin: user?.role === 'admin' }}>
            {children}
        </AuthContext.Provider>
    );
};
