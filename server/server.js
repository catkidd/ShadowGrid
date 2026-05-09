const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const Product = require('./models/Product');
const User = require('./models/User');
const jwt = require('jsonwebtoken');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
    origin: ['https://shadowgrid-client.onrender.com', 'http://localhost:5173', 'http://localhost:5174', 'http://localhost:5175', 'http://localhost:3000'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
}));
app.use(express.json());

// Auth Middleware
const authenticateJWT = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (authHeader) {
        const token = authHeader.split(' ')[1];

        jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
            if (err) {
                return res.sendStatus(403);
            }
            req.user = user;
            next();
        });
    } else {
        res.sendStatus(401);
    }
};

const isAdmin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        res.status(403).json({ message: 'Access denied. Admin role required.' });
    }
};

// Database Connection
let mockProducts = [
    { 
        _id: '1', sku: 'SG-KB-X1', name: 'ShadowBlade X1', brand: 'ShadowGrid', category: 'Keyboards', price: 249.99, salePrice: 189.99, originalPrice: 249.99, specs: ['Optical Switches', 'Aluminum Frame', 'PBT Keycaps'], stock: 15, imageURL: 'https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?w=800&auto=format&fit=crop&q=80', description: 'Premium mechanical keyboard engineered for high-performance typing. Features optical switches for instantaneous response and a durable aluminum chassis.', rating: 4.8, reviewsCount: 3,
        reviews: [
            { user: "Alex_C", rating: 5, date: "2 weeks ago", comment: "Excellent build quality and very responsive.", verifiedPurchase: true },
            { user: "TechReviewer", rating: 4, date: "1 month ago", comment: "Solid performance. Highly recommended.", verifiedPurchase: true },
            { user: "User123", rating: 5, date: "2 months ago", comment: "The best keyboard in its class.", verifiedPurchase: false }
        ]
    },
    { 
        _id: '2', sku: 'SG-MS-NP', name: 'NeonPulse Pro', brand: 'ShadowGrid', category: 'Mice', price: 119.99, salePrice: 79.99, originalPrice: 119.99, specs: ['26,000 DPI', 'Lightweight 58g', 'PTFE Skates'], stock: 25, imageURL: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=800&auto=format&fit=crop&q=80', description: 'Professional ultralight gaming mouse with 26K DPI sensor. Designed for precision tracking and effortless movement.', rating: 4.7, reviewsCount: 2,
        reviews: [
            { user: "ProGamer", rating: 5, date: "1 week ago", comment: "Extremely light and precise.", verifiedPurchase: true },
            { user: "TechFan", rating: 4, date: "3 weeks ago", comment: "Great ergonomics and sensor accuracy.", verifiedPurchase: true }
        ]
    },
    { 
        _id: '3', sku: 'SG-DP-GV', name: 'GridVision 27Q', brand: 'ShadowGrid', category: 'Displays', price: 649.99, salePrice: 499.99, originalPrice: 649.99, specs: ['27-inch IPS', '175Hz Refresh', '1ms Response'], stock: 8, imageURL: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=800&auto=format&fit=crop&q=80', description: 'High-resolution 27-inch IPS gaming monitor. Delivers exceptional color accuracy and smooth motion for professional workflows and gaming.', rating: 5.0, reviewsCount: 1,
        reviews: [
            { user: "GraphicDesigner", rating: 5, date: "4 days ago", comment: "Stunning colors and very fast refresh rate.", verifiedPurchase: true }
        ]
    },
    { 
        _id: '4', sku: 'SG-MS-AZ', name: 'ApexClick Zero', brand: 'ShadowGrid', category: 'Mice', price: 159.99, salePrice: 129.99, originalPrice: 159.99, specs: ['8,000Hz Polling', 'Magnesium Shell', 'Optical Click'], stock: 12, imageURL: 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=800&auto=format&fit=crop&q=80', description: 'State-of-the-art gaming mouse with magnesium alloy construction. Features 8,000Hz polling rate for near-zero input latency.', rating: 4.9, reviewsCount: 42, reviews: []
    },
    { 
        _id: '5', sku: 'SG-DP-TF', name: 'TitanFrame 32X', brand: 'ShadowGrid', category: 'Displays', price: 1099.99, salePrice: 899.99, originalPrice: 1099.99, specs: ['32-inch OLED', '240Hz Refresh', '0.03ms Response'], stock: 5, imageURL: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&auto=format&fit=crop&q=80', description: 'Ultimate 32-inch 4K OLED display. Provides infinite contrast and industry-leading response times for a truly immersive experience.', rating: 4.9, reviewsCount: 15, reviews: []
    },
    { 
        _id: '6', sku: 'SG-KB-PT', name: 'PhantomType 65', brand: 'ShadowGrid', category: 'Keyboards', price: 199.99, salePrice: 149.99, originalPrice: 199.99, specs: ['65% Layout', 'Gasket Mount', 'Hotswappable'], stock: 20, imageURL: 'https://images.unsplash.com/photo-1541140134513-85a161dc4a00?w=800&auto=format&fit=crop&q=80', description: 'Premium 65% mechanical keyboard with gasket mounting. Designed for enthusiasts seeking a refined typing experience.', rating: 4.7, reviewsCount: 28, reviews: []
    }
];

let useMock = false;

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/shadowgrid')
    .then(() => console.log('MongoDB Connected'))
    .catch(err => {
        console.error('MongoDB Connection Error:', err.message);
        console.log('Falling back to mock data for demonstration.');
        useMock = true;
    });

// Routes

// Auth Routes
app.post('/api/auth/signup', async (req, res) => {
    const { email, password } = req.body;
    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ message: 'User already exists' });

        const user = new User({ email, password });
        await user.save();

        const token = jwt.sign(
            { id: user._id, email: user.email, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.status(201).json({ token, user: { email: user.email, role: user.role } });
    } catch (err) {
        res.status(500).json({ message: 'Signup failed', error: err.message });
    }
});

app.post('/api/auth/login', async (req, res) => {
    const { email, password } = req.body;
    
    // Mock Login Fallback (for development if DB is down)
    if (useMock && email === 'admin@shadowgrid.com' && password === 'admin_password_2026') {
        const token = jwt.sign(
            { id: 'mock_admin_id', email: 'admin@shadowgrid.com', role: 'admin' },
            process.env.JWT_SECRET || 'fallback_secret',
            { expiresIn: '24h' }
        );
        return res.json({ token, user: { email: 'admin@shadowgrid.com', role: 'admin' } });
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

        res.json({ token, user: { email: user.email, role: user.role } });
    } catch (err) {
        res.status(500).json({ message: 'Login failed', error: err.message });
    }
});

app.get('/api/auth/me', authenticateJWT, async (req, res) => {
    // Mock User Fallback
    if (useMock && req.user.id === 'mock_admin_id') {
        return res.json({ email: 'admin@shadowgrid.com', role: 'admin' });
    }

    try {
        const user = await User.findById(req.user.id).select('-password');
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.json(user);
    } catch (err) {
        res.status(500).json({ message: 'Failed to fetch user data' });
    }
});

// GET /api/products - Fetch all products
app.get('/api/products', async (req, res) => {
    try {
        if (useMock) return res.json(mockProducts);
        const products = await Product.find();
        if (products.length === 0) return res.json(mockProducts);
        res.json(products);
    } catch (err) {
        res.json(mockProducts); // Fallback on error
    }
});

// GET /api/products/:id - Fetch a single product
app.get('/api/products/:id', async (req, res) => {
    try {
        if (useMock) {
            const product = mockProducts.find(p => p._id === req.params.id);
            if (product) return res.json(product);
            return res.status(404).json({ message: 'Product not found' });
        }

        // If ID is not a valid MongoDB ObjectId, check mock products (useful if DB is empty and we loaded mock data)
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            const mockProduct = mockProducts.find(p => p._id === req.params.id);
            if (mockProduct) return res.json(mockProduct);
            return res.status(404).json({ message: 'Product not found' });
        }

        const product = await Product.findById(req.params.id);
        if (!product) {
            // Fallback to mock data if not found in DB
            const mockProduct = mockProducts.find(p => p._id === req.params.id);
            if (mockProduct) return res.json(mockProduct);
            return res.status(404).json({ message: 'Product not found' });
        }
        res.json(product);
    } catch (err) {
        const mockProduct = mockProducts.find(p => p._id === req.params.id);
        if (mockProduct) return res.json(mockProduct);
        res.status(500).json({ message: 'Server Error' });
    }
});

// POST /api/orders - Create an order and validate stock
app.post('/api/orders', async (req, res) => {
    const { items } = req.body; // Array of { productId, quantity }

    try {
        const orderSummary = [];

        for (const item of items) {
            const product = await Product.findById(item.productId);

            if (!product) {
                return res.status(404).json({ message: `Product ${item.productId} not found` });
            }

            // Stock Validator Logic
            if (product.stock < item.quantity) {
                return res.status(400).json({ 
                    message: `Insufficient stock for ${product.name}. Available: ${product.stock}`,
                    productId: product._id
                });
            }

            // Deduct stock (if this were a real order)
            // product.stock -= item.quantity;
            // await product.save();

            orderSummary.push({
                name: product.name,
                quantity: item.quantity,
                price: product.price
            });
        }

        res.status(201).json({ 
            message: 'Order processed successfully', 
            order: orderSummary,
            total: orderSummary.reduce((sum, i) => sum + (i.price * i.quantity), 0)
        });

    } catch (err) {
        res.status(500).json({ message: 'Server Error', error: err.message });
    }
});

// Admin Product Routes (Protected)
app.post('/api/products', authenticateJWT, isAdmin, async (req, res) => {
    if (useMock) {
        const newProduct = { 
            ...req.body, 
            _id: Date.now().toString(), 
            sku: req.body.sku || `SG-NEW-${Date.now()}`,
            specs: typeof req.body.specs === 'string' ? req.body.specs.split(',').map(s => s.trim()) : req.body.specs 
        };
        mockProducts.push(newProduct);
        return res.status(201).json(newProduct);
    }

    try {
        const product = new Product(req.body);
        await product.save();
        res.status(201).json(product);
    } catch (err) {
        res.status(400).json({ message: 'Failed to create product', error: err.message });
    }
});

app.put('/api/products/:id', authenticateJWT, isAdmin, async (req, res) => {
    if (useMock) {
        const index = mockProducts.findIndex(p => p._id === req.params.id);
        if (index === -1) return res.status(404).json({ message: 'Product not found' });
        
        const updatedProduct = { 
            ...mockProducts[index], 
            ...req.body,
            specs: typeof req.body.specs === 'string' ? req.body.specs.split(',').map(s => s.trim()) : req.body.specs
        };
        mockProducts[index] = updatedProduct;
        return res.json(updatedProduct);
    }

    try {
        const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!product) return res.status(404).json({ message: 'Product not found' });
        res.json(product);
    } catch (err) {
        res.status(400).json({ message: 'Failed to update product', error: err.message });
    }
});

app.delete('/api/products/:id', authenticateJWT, isAdmin, async (req, res) => {
    if (useMock) {
        const index = mockProducts.findIndex(p => p._id === req.params.id);
        if (index === -1) return res.status(404).json({ message: 'Product not found' });
        mockProducts.splice(index, 1);
        return res.json({ message: 'Product deleted successfully' });
    }

    try {
        const product = await Product.findByIdAndDelete(req.params.id);
        if (!product) return res.status(404).json({ message: 'Product not found' });
        res.json({ message: 'Product deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Failed to delete product', error: err.message });
    }
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running!`);
    console.log(`Local:            http://localhost:${PORT}`);
    console.log(`Network:          http://0.0.0.0:${PORT}`);
    console.log('Press Ctrl+C to stop');
});
