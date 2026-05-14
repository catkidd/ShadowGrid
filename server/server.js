const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const Product = require('./models/Product');
const User = require('./models/User');
const Order = require('./models/Order');
const Subscriber = require('./models/Subscriber');
const jwt = require('jsonwebtoken');
const rateLimit = require('express-rate-limit');

dotenv.config();

if (!process.env.MONGODB_URI) {
    console.error('CRITICAL ERROR: MONGODB_URI is not defined in environment variables.');
    console.error('Please ensure you have added MONGODB_URI to your Render Environment Variables.');
    process.exit(1);
}


const app = express();
const PORT = process.env.PORT || 5000;

// Sanitize CLIENT_URL (remove trailing slash if present)
const CLIENT_URL = process.env.CLIENT_URL ? process.env.CLIENT_URL.replace(/\/$/, '') : null;

// ─── Root Route ──────────────────────────────────────────────────────────────
app.get('/', (req, res) => res.send('ShadowGrid API is Online. Database Connectivity: Verified.'));

// ─── Middleware ───────────────────────────────────────────────────────────────
app.use(cors({
    origin: (origin, callback) => {
        const allowed = [
            CLIENT_URL,
            'http://localhost:5173',
            'http://localhost:5174',
            'http://localhost:5175',
            'http://localhost:3000'
        ].filter(Boolean);
        
        // Allow requests with no origin (like mobile apps or curl) or if origin is in allowed list
        if (!origin || allowed.includes(origin.replace(/\/$/, ''))) {
            return callback(null, true);
        }
        
        console.warn(`Blocked CORS request from origin: ${origin}`);
        return callback(new Error(`CORS: origin '${origin}' is not permitted`));
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
}));
app.use(express.json());

// Health Check Endpoint
app.get('/api/health', (req, res) => res.json({ status: 'ok', timestamp: new Date() }));

// ─── Auth Middleware ──────────────────────────────────────────────────────────
const authenticateJWT = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.sendStatus(401);
    const token = authHeader.split(' ')[1];
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
};

const isAdmin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') return next();
    res.status(403).json({ message: 'Access denied. Admin role required.' });
};

// ─── Database Connection ──────────────────────────────────────────────────────
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('MongoDB Connected'))
    .catch(err => {
        console.error('MongoDB Connection Error:', err.message);
        process.exit(1); // Hard fail — do not run with no DB
    });

// ═════════════════════════════════════════════════════════════════════════════
// AUTH ROUTES
// ═════════════════════════════════════════════════════════════════════════════

const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 10, // Limit each IP to 10 requests per `window` (here, per 15 minutes)
    message: { message: 'Too many authentication attempts from this IP, please try again after 15 minutes' },
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

// POST /api/auth/signup
app.post('/api/auth/signup', authLimiter, async (req, res) => {
    const { email, password, role } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required' });
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return res.status(400).json({ message: 'Invalid email format' });
    }

    if (password.length < 8) {
        return res.status(400).json({ message: 'Password must be at least 8 characters long' });
    }

    try {
        const existing = await User.findOne({ email });
        if (existing) return res.status(400).json({ message: 'User already exists' });

        const user = new User({ 
            email, 
            password, 
            role: role && ['user', 'admin'].includes(role) ? role : 'user' 
        });
        await user.save();

        const token = jwt.sign(
            { id: user._id, email: user.email, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );
        res.status(201).json({ token, user: { id: user._id, email: user.email, role: user.role } });
    } catch (err) {
        res.status(500).json({ message: 'Signup failed', error: err.message });
    }
});

// ═════════════════════════════════════════════════════════════════════════════
// USER MANAGEMENT ROUTES (Admin Only)
// ═════════════════════════════════════════════════════════════════════════════

// GET /api/users — Admin: list all users
app.get('/api/users', authenticateJWT, isAdmin, async (req, res) => {
    try {
        const users = await User.find().select('-password').sort({ createdAt: -1 });
        res.json(users);
    } catch (err) {
        res.status(500).json({ message: 'Failed to fetch users', error: err.message });
    }
});

// PUT /api/users/:id/role — Admin: update user role
app.put('/api/users/:id/role', authenticateJWT, isAdmin, async (req, res) => {
    const { role } = req.body;
    if (!['user', 'admin'].includes(role)) {
        return res.status(400).json({ message: 'Invalid role. Must be "user" or "admin"' });
    }

    try {
        const user = await User.findByIdAndUpdate(
            req.params.id,
            { role },
            { new: true }
        ).select('-password');
        
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.json(user);
    } catch (err) {
        res.status(500).json({ message: 'Failed to update user role', error: err.message });
    }
});

// POST /api/auth/login
app.post('/api/auth/login', authLimiter, async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required' });
    }

    try {
        const user = await User.findOne({ email });
        if (!user || !(await user.comparePassword(password))) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        const token = jwt.sign(
            { id: user._id, email: user.email, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );
        res.json({ token, user: { id: user._id, email: user.email, role: user.role } });
    } catch (err) {
        res.status(500).json({ message: 'Login failed', error: err.message });
    }
});

// GET /api/auth/me
app.get('/api/auth/me', authenticateJWT, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.json(user);
    } catch (err) {
        res.status(500).json({ message: 'Failed to fetch user data' });
    }
});

// PUT /api/auth/password
app.put('/api/auth/password', authenticateJWT, async (req, res) => {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
        return res.status(400).json({ message: 'Both current and new passwords are required' });
    }
    if (newPassword.length < 8) {
        return res.status(400).json({ message: 'New password must be at least 8 characters long' });
    }
    try {
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ message: 'User not found' });
        
        if (!(await user.comparePassword(currentPassword))) {
            return res.status(400).json({ message: 'Incorrect current password' });
        }
        
        user.password = newPassword;
        await user.save();
        res.json({ message: 'Password updated successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Failed to update password', error: err.message });
    }
});

// ═════════════════════════════════════════════════════════════════════════════
// PRODUCT ROUTES
// ═════════════════════════════════════════════════════════════════════════════

// In-memory cache for products to reduce LCP latency
let productsCache = null;
let productsCacheTimestamp = 0;
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

const clearProductsCache = () => {
    productsCache = null;
    productsCacheTimestamp = 0;
};

// GET /api/products
app.get('/api/products', async (req, res) => {
    try {
        const now = Date.now();
        if (productsCache && (now - productsCacheTimestamp < CACHE_TTL)) {
            console.log('Serving products from memory cache (Fast response)...');
            return res.json(productsCache);
        }

        console.log('Fetching products from database (Cache miss)...');
        const products = await Product.find().select('-__v').sort({ createdAt: -1 }).lean();
        console.log(`Found ${products.length} products.`);
        
        productsCache = products;
        productsCacheTimestamp = now;
        
        res.json(products);
    } catch (err) {
        console.error('Error fetching products:', err.message);
        res.status(500).json({ message: 'Failed to fetch products', error: err.message });
    }
});

// GET /api/products/:id
app.get('/api/products/:id', async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ message: 'Invalid product ID format' });
        }
        const product = await Product.findById(req.params.id).lean();
        if (!product) return res.status(404).json({ message: 'Product not found' });
        res.json(product);
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});

// POST /api/products — Admin only
app.post('/api/products', authenticateJWT, isAdmin, async (req, res) => {
    try {
        const product = new Product(req.body);
        await product.save();
        clearProductsCache(); // Invalidate cache
        res.status(201).json(product);
    } catch (err) {
        res.status(400).json({ message: 'Failed to create product', error: err.message });
    }
});

// PUT /api/products/:id — Admin only
app.put('/api/products/:id', authenticateJWT, isAdmin, async (req, res) => {
    try {
        const product = await Product.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );
        if (!product) return res.status(404).json({ message: 'Product not found' });
        clearProductsCache(); // Invalidate cache
        res.json(product);
    } catch (err) {
        res.status(400).json({ message: 'Failed to update product', error: err.message });
    }
});

// DELETE /api/products/:id — Admin only
app.delete('/api/products/:id', authenticateJWT, isAdmin, async (req, res) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);
        if (!product) return res.status(404).json({ message: 'Product not found' });
        clearProductsCache(); // Invalidate cache
        res.json({ message: 'Product deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Failed to delete product', error: err.message });
    }
});

// POST /api/products/:id/reviews — Authenticated users add a review
app.post('/api/products/:id/reviews', authenticateJWT, async (req, res) => {
    const { rating, comment } = req.body;
    
    if (!rating || rating < 1 || rating > 5) {
        return res.status(400).json({ message: 'Please provide a valid rating between 1 and 5' });
    }

    try {
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ message: 'Product not found' });

        // Check if user already reviewed
        const alreadyReviewed = product.reviews.find(
            (r) => r.user.toString() === req.user.email
        );

        if (alreadyReviewed) {
            return res.status(400).json({ message: 'You have already reviewed this product' });
        }

        const review = {
            user: req.user.email,
            rating: Number(rating),
            comment,
            verifiedPurchase: true, // We can enhance this to check order history later
            date: new Date().toISOString()
        };

        product.reviews.push(review);
        product.reviewsCount = product.reviews.length;
        product.rating = product.reviews.reduce((acc, item) => item.rating + acc, 0) / product.reviews.length;

        await product.save();
        res.status(201).json({ message: 'Review added successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Failed to add review', error: err.message });
    }
});

// ═════════════════════════════════════════════════════════════════════════════
// ORDER ROUTES
// ═════════════════════════════════════════════════════════════════════════════

// POST /api/orders — Authenticated users place an order
app.post('/api/orders', authenticateJWT, async (req, res) => {
    const { items, shippingAddress, paymentMethod } = req.body;

    if (!items || items.length === 0) {
        return res.status(400).json({ message: 'Order must contain at least one item' });
    }

    try {
        // Validate stock and build order items
        const orderItems = [];
        for (const item of items) {
            const product = await Product.findById(item._id);
            if (!product) {
                return res.status(404).json({ message: `Product not found: ${item.name}` });
            }
            if (product.stock < item.quantity) {
                return res.status(400).json({
                    message: `Insufficient stock for ${product.name}. Only ${product.stock} left.`
                });
            }
            // Deduct stock
            product.stock -= item.quantity;
            await product.save();

            orderItems.push({
                product: product._id,
                name: product.name,
                imageURL: product.imageURL,
                price: product.salePrice || product.price,
                quantity: item.quantity
            });
        }

        const total = orderItems.reduce((sum, i) => sum + i.price * i.quantity, 0);

        const order = new Order({
            user: req.user.id,
            items: orderItems,
            total,
            shippingAddress,
            paymentMethod: paymentMethod || 'Card'
        });

        await order.save();
        res.status(201).json({ message: 'Order placed successfully', order });
    } catch (err) {
        res.status(500).json({ message: 'Order failed', error: err.message });
    }
});

// GET /api/orders/my — Authenticated user's own orders
app.get('/api/orders/my', authenticateJWT, async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user.id })
            .populate('items.product', 'name imageURL')
            .sort({ createdAt: -1 });
        res.json(orders);
    } catch (err) {
        res.status(500).json({ message: 'Failed to fetch orders', error: err.message });
    }
});

// GET /api/orders — Admin: all orders
app.get('/api/orders', authenticateJWT, isAdmin, async (req, res) => {
    try {
        const orders = await Order.find()
            .populate('user', 'email')
            .populate('items.product', 'name imageURL')
            .sort({ createdAt: -1 });
        res.json(orders);
    } catch (err) {
        res.status(500).json({ message: 'Failed to fetch orders', error: err.message });
    }
});

// PUT /api/orders/:id/status — Admin: update order status
app.put('/api/orders/:id/status', authenticateJWT, isAdmin, async (req, res) => {
    const { status } = req.body;
    const validStatuses = ['Processing', 'Shipped', 'Delivered', 'Cancelled'];
    if (!validStatuses.includes(status)) {
        return res.status(400).json({ message: `Invalid status. Must be one of: ${validStatuses.join(', ')}` });
    }
    try {
        const order = await Order.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true }
        );
        if (!order) return res.status(404).json({ message: 'Order not found' });
        res.json(order);
    } catch (err) {
        res.status(500).json({ message: 'Failed to update order status', error: err.message });
    }
});

// ═════════════════════════════════════════════════════════════════════════════
// NEWSLETTER ROUTES
// ═════════════════════════════════════════════════════════════════════════════

const newsletterLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 5, // Limit each IP to 5 newsletter subscriptions per hour
    message: { message: 'Too many subscription attempts from this IP, please try again after an hour' }
});

// POST /api/newsletter/subscribe
app.post('/api/newsletter/subscribe', newsletterLimiter, async (req, res) => {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: 'Email is required' });

    try {
        const existing = await Subscriber.findOne({ email });
        if (existing) return res.status(400).json({ message: 'Email is already subscribed' });

        const subscriber = new Subscriber({ email });
        await subscriber.save();
        
        res.status(201).json({ message: 'Successfully subscribed to newsletter' });
    } catch (err) {
        if (err.name === 'ValidationError') {
            return res.status(400).json({ message: 'Invalid email format' });
        }
        res.status(500).json({ message: 'Failed to subscribe', error: err.message });
    }
});

// ─── Start Server ─────────────────────────────────────────────────────────────
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running!`);
    console.log(`Local:   http://localhost:${PORT}`);
    console.log(`Network: http://0.0.0.0:${PORT}`);
    console.log('Press Ctrl+C to stop');
});
