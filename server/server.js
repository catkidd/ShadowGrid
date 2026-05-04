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
    { _id: '1', name: 'ShadowBlade X1', brand: 'ShadowGrid', category: 'Input', price: 189.99, specs: ['Optical Switches', 'Aluminum Frame'], stock: 15, imageURL: 'https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?auto=format&fit=crop&q=80&w=800' },
    { _id: '2', name: 'NeonPulse Pro', brand: 'ShadowGrid', category: 'Input', price: 79.99, specs: ['26,000 DPI', 'Lightweight 58g'], stock: 25, imageURL: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&q=80&w=800' },
    { _id: '3', name: 'GridVision 27Q', brand: 'ShadowGrid', category: 'Output', price: 499.99, specs: ['27-inch IPS', '175Hz Refresh'], stock: 8, imageURL: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&q=80&w=800' }
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
