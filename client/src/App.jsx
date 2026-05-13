import { BrowserRouter as Router } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { SearchProvider } from './context/SearchProvider';
import { CartProvider } from './context/CartContext';
import ScrollToTop from './components/ScrollToTop';
import Layout from './components/Layout';
import AnimatedRoutes from './components/AnimatedRoutes';

const App = () => (
    <AuthProvider>
        <SearchProvider>
            <CartProvider>
                <Router>
                    <ScrollToTop />
                    <Toaster 
                        position="top-right"
                        toastOptions={{
                            style: {
                                background: '#0D0D0D',
                                color: '#FFFFFF',
                                border: '1px solid rgba(255, 255, 255, 0.1)',
                                borderRadius: '12px',
                                fontFamily: 'monospace',
                                fontSize: '11px',
                                textTransform: 'uppercase',
                                letterSpacing: '0.1em',
                                padding: '16px',
                            },
                            success: {
                                iconTheme: {
                                    primary: '#00FFAA',
                                    secondary: '#0D0D0D',
                                },
                                style: {
                                    border: '1px solid rgba(0, 255, 170, 0.2)',
                                }
                            },
                            error: {
                                iconTheme: {
                                    primary: '#FF4444',
                                    secondary: '#0D0D0D',
                                },
                                style: {
                                    border: '1px solid rgba(255, 68, 68, 0.2)',
                                }
                            }
                        }}
                    />
                    <Layout>
                        <AnimatedRoutes />
                    </Layout>
                </Router>
            </CartProvider>
        </SearchProvider>
    </AuthProvider>
);

export default App;
