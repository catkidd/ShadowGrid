import { lazy, Suspense } from 'react';
import { useLocation, Routes, Route } from 'react-router-dom';
import FadeInUp from './FadeInUp';
import ProtectedRoute from './ProtectedRoute';
import Loader from './Loader';

// Lazy loaded page components for LCP optimization
const Home = lazy(() => import('../pages/Home'));
const ProductDetail = lazy(() => import('../pages/ProductDetail'));
const About = lazy(() => import('../pages/About'));
const PrivacyPolicy = lazy(() => import('../pages/PrivacyPolicy'));
const TermsOfService = lazy(() => import('../pages/TermsOfService'));
const Protocols = lazy(() => import('../pages/Protocols'));
const Maintenance = lazy(() => import('../pages/Maintenance'));
const ShippingReturns = lazy(() => import('../pages/ShippingReturns'));
const PaymentMethods = lazy(() => import('../pages/PaymentMethods'));
const Contact = lazy(() => import('../pages/Contact'));
const Login = lazy(() => import('../pages/Login'));
const Signup = lazy(() => import('../pages/Signup'));
const Checkout = lazy(() => import('../pages/Checkout'));
const AdminDashboard = lazy(() => import('../pages/AdminDashboard'));
const Profile = lazy(() => import('../pages/Profile'));

const AnimatedRoutes = () => {
    const location = useLocation();
    return (
        <FadeInUp key={location.pathname} className="flex-1 flex flex-col w-full h-full">
            <Suspense fallback={<Loader text="Syncing Grid" />}>
                <Routes location={location}>
                    <Route path="/" element={<Home preFilter="All" />} />
                    <Route path="/keyboards" element={<Home preFilter="Keyboards" />} />
                    <Route path="/precision" element={<Home preFilter="Mice" />} />
                    <Route path="/displays" element={<Home preFilter="Displays" />} />
                    <Route path="/product/:id" element={<ProductDetail />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/privacy" element={<PrivacyPolicy />} />
                    <Route path="/terms" element={<TermsOfService />} />
                    <Route path="/protocols" element={<Protocols />} />
                    <Route path="/maintenance" element={<Maintenance />} />
                    <Route path="/shipping" element={<ShippingReturns />} />
                    <Route path="/payments" element={<PaymentMethods />} />
                    <Route path="/contact" element={<Contact />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/signup" element={<Signup />} />
                    <Route path="/checkout" element={<Checkout />} />
                    <Route 
                        path="/profile" 
                        element={
                            <ProtectedRoute>
                                <Profile />
                            </ProtectedRoute>
                        } 
                    />
                    <Route 
                        path="/admin/dashboard" 
                        element={
                            <ProtectedRoute adminOnly>
                                <AdminDashboard />
                            </ProtectedRoute>
                        } 
                    />
                </Routes>
            </Suspense>
        </FadeInUp>
    );
};

export default AnimatedRoutes;
