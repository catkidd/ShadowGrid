const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const Product = require('./models/Product');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Database Connection
const mockProducts = [
    { 
        _id: '1', name: 'ShadowBlade X1', brand: 'ShadowGrid', category: 'Keyboards', price: 189.99, originalPrice: 249.99, specs: ['Optical Switches', 'Aluminum Frame', 'PBT Keycaps'], stock: 15, imageURL: 'https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?w=800', description: 'The ShadowBlade X1 is meticulously engineered for the absolute edge in competitive scenarios. Featuring custom-tuned optical switches that actuate at the speed of light, housed within an aerospace-grade aluminum chassis for zero flex.', rating: 4.8, reviewsCount: 3,
        reviews: [
            { user: "Alex_C", rating: 5, date: "2 weeks ago", comment: "The optical switches are insanely fast. Best keyboard I've ever owned.", verifiedPurchase: true },
            { user: "TechNinja99", rating: 4, date: "1 month ago", comment: "Build quality is top tier. The software needs a bit of polishing though.", verifiedPurchase: true },
            { user: "ProGamer_X", rating: 5, date: "2 months ago", comment: "Absolutely zero flex. This thing is a tank.", verifiedPurchase: false }
        ]
    },
    { 
        _id: '2', name: 'NeonPulse Pro', brand: 'ShadowGrid', category: 'Mice', price: 79.99, originalPrice: 119.99, specs: ['26,000 DPI', 'Lightweight 58g', 'PTFE Skates'], stock: 25, imageURL: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=800', description: 'Achieve pixel-perfect tracking with the NeonPulse Pro. Weighing in at a mere 58 grams, this ultralight peripheral glides effortlessly on pure PTFE skates. Equipped with our proprietary 26K DPI sensor for flawless precision.', rating: 4.7, reviewsCount: 2,
        reviews: [
            { user: "AimBot_Real", rating: 5, date: "1 week ago", comment: "Super light. My tracking improved immediately.", verifiedPurchase: true },
            { user: "CasualDave", rating: 4, date: "3 weeks ago", comment: "Great mouse, but the shape takes a few days to get used to.", verifiedPurchase: true }
        ]
    },
    { 
        _id: '3', name: 'GridVision 27Q', brand: 'ShadowGrid', category: 'Displays', price: 499.99, originalPrice: 649.99, specs: ['27-inch IPS', '175Hz Refresh', '1ms Response'], stock: 8, imageURL: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=800', description: 'Immerse yourself in the Grid. The GridVision 27Q delivers stunning color accuracy through its Fast IPS panel, paired with a blazing 175Hz refresh rate and 1ms response time to ensure every frame is delivered with zero latency.', rating: 5.0, reviewsCount: 1,
        reviews: [
            { user: "Visuals_God", rating: 5, date: "4 days ago", comment: "The colors out of the box are perfect. No dead pixels. Worth every penny.", verifiedPurchase: true }
        ]
    },
    { 
        _id: '4', name: 'ApexClick Zero', brand: 'ShadowGrid', category: 'Mice', price: 129.99, originalPrice: 159.99, specs: ['8,000Hz Polling', 'Magnesium Shell', 'Optical Click'], stock: 12, imageURL: 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=800', description: 'Experience zero latency with the ApexClick Zero. Built with a ultra-strong magnesium alloy exoskeleton for the ultimate strength-to-weight ratio.', rating: 4.9, reviewsCount: 42, reviews: []
    },
    { 
        _id: '5', name: 'TitanFrame 32X', brand: 'ShadowGrid', category: 'Displays', price: 899.99, originalPrice: 1099.99, specs: ['32-inch OLED', '240Hz Refresh', '0.03ms Response'], stock: 5, imageURL: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800', description: 'The absolute pinnacle of display technology. 4K OLED resolution with infinite contrast and industry-leading motion clarity.', rating: 4.9, reviewsCount: 15, reviews: []
    },
    { 
        _id: '6', name: 'PhantomType 65', brand: 'ShadowGrid', category: 'Keyboards', price: 149.99, originalPrice: 199.99, specs: ['65% Layout', 'Gasket Mount', 'Hotswappable'], stock: 20, imageURL: 'https://images.unsplash.com/photo-1595225403330-22c6085a690e?w=800', description: 'A compact masterpiece. The PhantomType 65 offers a premium typing experience with its double-gasket mounting system and pre-lubed stabilizers.', rating: 4.7, reviewsCount: 28, reviews: []
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

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
