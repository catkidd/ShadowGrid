const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('../models/Product');

dotenv.config({ path: require('path').join(__dirname, '../.env') });

const products = [
    {
        sku: 'SG-KB-X1',
        name: 'ShadowBlade X1',
        brand: 'ShadowGrid',
        category: 'Keyboards',
        price: 189.99,
        salePrice: 189.99,
        originalPrice: 249.99,
        specs: ['Optical Switches', 'Aluminum Frame', 'PBT Keycaps', 'RGB Backlit'],
        stock: 15,
        imageURL: 'https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?w=800&auto=format&fit=crop&q=80',
        description: 'Premium mechanical keyboard engineered for high-performance typing. Features optical switches for instantaneous response and a durable aluminum chassis.',
        rating: 4.8,
        reviewsCount: 3,
        reviews: [
            { user: 'Alex_C', rating: 5, date: '2 weeks ago', comment: 'Excellent build quality and very responsive.', verifiedPurchase: true },
            { user: 'TechReviewer', rating: 4, date: '1 month ago', comment: 'Solid performance. Highly recommended.', verifiedPurchase: true },
            { user: 'User123', rating: 5, date: '2 months ago', comment: 'The best keyboard in its class.', verifiedPurchase: false }
        ]
    },
    {
        sku: 'SG-MS-NP',
        name: 'NeonPulse Pro',
        brand: 'ShadowGrid',
        category: 'Mice',
        price: 79.99,
        salePrice: 79.99,
        originalPrice: 119.99,
        specs: ['26,000 DPI', 'Lightweight 58g', 'PTFE Skates', 'Paracord Cable'],
        stock: 25,
        imageURL: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=800&auto=format&fit=crop&q=80',
        description: 'Professional ultralight gaming mouse with 26K DPI sensor. Designed for precision tracking and effortless movement.',
        rating: 4.7,
        reviewsCount: 2,
        reviews: [
            { user: 'ProGamer', rating: 5, date: '1 week ago', comment: 'Extremely light and precise.', verifiedPurchase: true },
            { user: 'TechFan', rating: 4, date: '3 weeks ago', comment: 'Great ergonomics and sensor accuracy.', verifiedPurchase: true }
        ]
    },
    {
        sku: 'SG-DP-GV',
        name: 'GridVision 27Q',
        brand: 'ShadowGrid',
        category: 'Displays',
        price: 499.99,
        salePrice: 499.99,
        originalPrice: 649.99,
        specs: ['27-inch IPS', '175Hz Refresh', '1ms Response', '1440p'],
        stock: 8,
        imageURL: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=800&auto=format&fit=crop&q=80',
        description: 'High-resolution 27-inch IPS gaming monitor. Delivers exceptional color accuracy and smooth motion for professional workflows and gaming.',
        rating: 5.0,
        reviewsCount: 1,
        reviews: [
            { user: 'GraphicDesigner', rating: 5, date: '4 days ago', comment: 'Stunning colors and very fast refresh rate.', verifiedPurchase: true }
        ]
    },
    {
        sku: 'SG-MS-AZ',
        name: 'ApexClick Zero',
        brand: 'ShadowGrid',
        category: 'Mice',
        price: 129.99,
        salePrice: 129.99,
        originalPrice: 159.99,
        specs: ['8,000Hz Polling', 'Magnesium Shell', 'Optical Click', '80g Weight'],
        stock: 12,
        imageURL: 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=800&auto=format&fit=crop&q=80',
        description: 'State-of-the-art gaming mouse with magnesium alloy construction. Features 8,000Hz polling rate for near-zero input latency.',
        rating: 4.9,
        reviewsCount: 42,
        reviews: []
    },
    {
        sku: 'SG-DP-TF',
        name: 'TitanFrame 32X',
        brand: 'ShadowGrid',
        category: 'Displays',
        price: 899.99,
        salePrice: 899.99,
        originalPrice: 1099.99,
        specs: ['32-inch OLED', '240Hz Refresh', '0.03ms Response', '4K UHD'],
        stock: 5,
        imageURL: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&auto=format&fit=crop&q=80',
        description: 'Ultimate 32-inch 4K OLED display. Provides infinite contrast and industry-leading response times for a truly immersive experience.',
        rating: 4.9,
        reviewsCount: 15,
        reviews: []
    },
    {
        sku: 'SG-KB-PT',
        name: 'PhantomType 65',
        brand: 'ShadowGrid',
        category: 'Keyboards',
        price: 149.99,
        salePrice: 149.99,
        originalPrice: 199.99,
        specs: ['65% Layout', 'Gasket Mount', 'Hotswappable', 'Silent Linear'],
        stock: 20,
        imageURL: 'https://images.unsplash.com/photo-1541140134513-85a161dc4a00?w=800&auto=format&fit=crop&q=80',
        description: 'Premium 65% mechanical keyboard with gasket mounting. Designed for enthusiasts seeking a refined typing experience with minimal footprint.',
        rating: 4.7,
        reviewsCount: 28,
        reviews: []
    }
];

const seedDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('MongoDB Connected for product seeding...');

        await Product.deleteMany({});
        console.log('Existing products cleared.');

        await Product.insertMany(products);
        console.log(`${products.length} products seeded successfully!`);

        mongoose.connection.close();
        process.exit(0);
    } catch (err) {
        console.error('Error seeding products:', err.message);
        process.exit(1);
    }
};

seedDB();
