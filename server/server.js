const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const Product = require('./models/Product');
const User = require('./models/User');
const Order = require('./models/Order');
const jwt = require('jsonwebtoken');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// ─── Middleware ───────────────────────────────────────────────────────────────
app.use(cors({
    origin: [
        'https://shadowgrid-client.onrender.com',
        'http://localhost:5173',
        'http://localhost:5174',
        'http://localhost:5175',
        'http://localhost:3000'
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
}));
app.use(express.json());

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

// POST /api/auth/signup
app.post('/api/auth/signup', async (req, res) => {
    const { email, password } = req.body;
    try {
        const existing = await User.findOne({ email });
        if (existing) return res.status(400).json({ message: 'User already exists' });

        const user = new User({ email, password });
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

// POST /api/auth/login
app.post('/api/auth/login', async (req, res) => {
    const { email, password } = req.body;
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

// ═════════════════════════════════════════════════════════════════════════════
// PRODUCT ROUTES
// ═════════════════════════════════════════════════════════════════════════════

// GET /api/products
app.get('/api/products', async (req, res) => {
    try {
        const products = await Product.find().sort({ createdAt: -1 });
        res.json(products);
    } catch (err) {
        res.status(500).json({ message: 'Failed to fetch products', error: err.message });
    }
});

// GET /api/products/:id
app.get('/api/products/:id', async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ message: 'Invalid product ID format' });
        }
        const product = await Product.findById(req.params.id);
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
        res.json({ message: 'Product deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Failed to delete product', error: err.message });
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

// ─── Start Server ─────────────────────────────────────────────────────────────
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running!`);
    console.log(`Local:   http://localhost:${PORT}`);
    console.log(`Network: http://0.0.0.0:${PORT}`);
    console.log('Press Ctrl+C to stop');
});
