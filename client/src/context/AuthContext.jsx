import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('shadowgrid-token'));
    const [loading, setLoading] = useState(true);

    const logout = () => {
        setToken(null);
        setUser(null);
        localStorage.removeItem('shadowgrid-token');
    };

    useEffect(() => {
        const fetchUser = async () => {
            if (!token) {
                setLoading(false);
                return;
            }

            try {
                const apiUrl = import.meta.env.VITE_API_URL || (import.meta.env.DEV ? 'http://localhost:5000' : 'https://shadowgrid-x8m6.onrender.com');
                const response = await fetch(`${apiUrl}/api/auth/me`, {
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

    const login = (userData, userToken) => {
        setToken(userToken);
        setUser(userData);
        localStorage.setItem('shadowgrid-token', userToken);
    };

    return (
        <AuthContext.Provider value={{ user, token, loading, login, logout, isAdmin: user?.role === 'admin' }}>
            {children}
        </AuthContext.Provider>
    );
};
