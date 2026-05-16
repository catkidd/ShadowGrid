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
        discount: 24,
        showDiscount: true,
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
        discount: 33,
        showDiscount: true,
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
        discount: 23,
        showDiscount: true,
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
        discount: 18,
        showDiscount: true,
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
        discount: 18,
        showDiscount: true,
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
        discount: 25,
        showDiscount: true,
        specs: ['65% Layout', 'Gasket Mount', 'Hotswappable', 'Silent Linear'],
        stock: 20,
        imageURL: 'https://images.unsplash.com/photo-1541140134513-85a161dc4a00?w=800&auto=format&fit=crop&q=80',
        description: 'Premium 65% mechanical keyboard with gasket mounting. Designed for enthusiasts seeking a refined typing experience with minimal footprint.',
        rating: 4.7,
        reviewsCount: 28,
        reviews: []
    },
    {
        sku: 'SG-KB-V1',
        name: 'Velocity MK-II',
        brand: 'ShadowGrid',
        category: 'Keyboards',
        price: 129.99,
        salePrice: 129.99,
        originalPrice: 159.99,
        discount: 15,
        showDiscount: true,
        specs: ['Low Profile', 'Wireless 2.4GHz', 'Multi-device BT', 'White LED'],
        stock: 30,
        imageURL: 'https://images.unsplash.com/photo-1595225476474-87563907a212?w=800&auto=format&fit=crop&q=80',
        description: 'Sleek low-profile mechanical keyboard with dual-mode connectivity. Perfect for minimalist setups.',
        rating: 4.6,
        reviewsCount: 12,
        reviews: []
    },
    {
        sku: 'SG-MS-Q3',
        name: 'QuantumClick 3',
        brand: 'ShadowGrid',
        category: 'Mice',
        price: 59.99,
        salePrice: 59.99,
        originalPrice: 79.99,
        discount: 25,
        showInFront: true,
        specs: ['Ergonomic Grip', 'Adjustable Weights', '12 Side Buttons', 'RGB'],
        stock: 40,
        imageURL: 'https://images.unsplash.com/photo-1527814050087-37a3c71cc04c?w=800&auto=format&fit=crop&q=80',
        description: 'Versatile MMO gaming mouse with customizable weight system and extensive macro support.',
        rating: 4.5,
        reviewsCount: 45,
        reviews: []
    },
    {
        sku: 'SG-DP-U1',
        name: 'UltraWide X-34',
        brand: 'ShadowGrid',
        category: 'Displays',
        price: 749.99,
        salePrice: 749.99,
        originalPrice: 999.99,
        discount: 25,
        showInFront: true,
        specs: ['34-inch Curved', '144Hz Refresh', 'UWQHD', 'HDR10'],
        stock: 10,
        imageURL: 'https://images.unsplash.com/photo-1547119957-637f8679db1e?w=800&auto=format&fit=crop&q=80',
        description: 'Immersive 34-inch ultrawide display for ultimate productivity and cinematic gaming.',
        rating: 4.8,
        reviewsCount: 22,
        reviews: []
    },
    {
        sku: 'SG-KB-Z9',
        name: 'Zenith Zero TKL',
        brand: 'ShadowGrid',
        category: 'Keyboards',
        price: 199.99,
        salePrice: 199.99,
        originalPrice: 249.99,
        discount: 20,
        showInFront: true,
        specs: ['TKL Layout', 'Magnetic Switches', 'Rapid Trigger', 'CNC Case'],
        stock: 18,
        imageURL: 'https://images.unsplash.com/photo-1626958390898-162d3577f293?w=800&auto=format&fit=crop&q=80',
        description: 'High-end TKL keyboard featuring magnetic switches for customizable actuation points.',
        rating: 5.0,
        reviewsCount: 8,
        reviews: []
    },
    {
        sku: 'SG-MS-S1',
        name: 'SwiftStream S1',
        brand: 'ShadowGrid',
        category: 'Mice',
        price: 45.99,
        salePrice: 45.99,
        originalPrice: 59.99,
        discount: 23,
        showInFront: true,
        specs: ['Symmetrical', 'No-drag Cable', 'Huano Switches', '62g'],
        stock: 50,
        imageURL: 'https://images.unsplash.com/photo-1563330232-57114bb0823c?w=800&auto=format&fit=crop&q=80',
        description: 'Reliable symmetrical gaming mouse optimized for speed and consistency.',
        rating: 4.4,
        reviewsCount: 60,
        reviews: []
    },
    {
        sku: 'SG-DP-M2',
        name: 'MiniGrid 14',
        brand: 'ShadowGrid',
        category: 'Displays',
        price: 229.99,
        salePrice: 229.99,
        originalPrice: 299.99,
        discount: 23,
        showInFront: true,
        specs: ['14-inch Portable', '1080p IPS', 'USB-C Only', '60Hz'],
        stock: 15,
        imageURL: 'https://images.unsplash.com/photo-1586210579191-33b45e38fa2c?w=800&auto=format&fit=crop&q=80',
        description: 'Ultra-portable 14-inch secondary monitor. Powered by a single USB-C cable.',
        rating: 4.3,
        reviewsCount: 14,
        reviews: []
    },
    {
        sku: 'SG-KB-F1',
        name: 'Forge 75',
        brand: 'ShadowGrid',
        category: 'Keyboards',
        price: 159.99,
        salePrice: 159.99,
        originalPrice: 199.99,
        discount: 20,
        showInFront: true,
        specs: ['75% Layout', 'Knob Control', 'South-facing RGB', 'PC Plate'],
        stock: 12,
        imageURL: 'https://images.unsplash.com/photo-1618384881928-02685956ec94?w=800&auto=format&fit=crop&q=80',
        description: 'Enthusiast-grade 75% keyboard with programmable rotary knob and premium acoustics.',
        rating: 4.9,
        reviewsCount: 5,
        reviews: []
    },
    {
        sku: 'SG-MS-V3',
        name: 'ViperGrid V3',
        brand: 'ShadowGrid',
        category: 'Mice',
        price: 99.99,
        salePrice: 99.99,
        originalPrice: 129.99,
        discount: 23,
        showInFront: true,
        specs: ['Focus+ Sensor', 'Optical Switches Gen-3', 'HyperPolling', '63g'],
        stock: 22,
        imageURL: 'https://images.unsplash.com/photo-1527814050087-37a3c71cc04c?w=800&auto=format&fit=crop&q=80',
        description: 'Third generation Viper series with upgraded internals for the most demanding gamers.',
        rating: 4.8,
        reviewsCount: 31,
        reviews: []
    },
    {
        sku: 'SG-DP-G1',
        name: 'GlowGrid 24',
        brand: 'ShadowGrid',
        category: 'Displays',
        price: 179.99,
        salePrice: 179.99,
        originalPrice: 229.99,
        discount: 21,
        showInFront: true,
        specs: ['24-inch VA', '165Hz Refresh', '3000:1 Contrast', '1080p'],
        stock: 28,
        imageURL: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&auto=format&fit=crop&q=80',
        description: 'Budget-friendly 24-inch gaming monitor with high refresh rate and deep blacks.',
        rating: 4.2,
        reviewsCount: 52,
        reviews: []
    },
    {
        sku: 'SG-KB-C1',
        name: 'CoreCompact 60',
        brand: 'ShadowGrid',
        category: 'Keyboards',
        price: 89.99,
        salePrice: 89.99,
        originalPrice: 119.99,
        discount: 25,
        showInFront: true,
        specs: ['60% Layout', 'Detachable Cable', 'Double-shot ABS', 'Blue Switches'],
        stock: 35,
        imageURL: 'https://images.unsplash.com/photo-1601445638532-3c6f6c3aa1d6?w=800&auto=format&fit=crop&q=80',
        description: 'Essential 60% mechanical keyboard for gamers who need maximum desk space.',
        rating: 4.1,
        reviewsCount: 88,
        reviews: []
    },
    {
        sku: 'SG-MS-E1',
        name: 'EvoGlide Wireless',
        brand: 'ShadowGrid',
        category: 'Mice',
        price: 119.99,
        salePrice: 119.99,
        originalPrice: 149.99,
        discount: 20,
        showInFront: true,
        specs: ['Ergonomic Right', 'Wireless Charging', '15 Programmable', 'Scroll Clutch'],
        stock: 14,
        imageURL: 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=800&auto=format&fit=crop&q=80',
        description: 'High-performance ergonomic mouse with advanced productivity and gaming features.',
        rating: 4.7,
        reviewsCount: 19,
        reviews: []
    },
    {
        sku: 'SG-DP-O9',
        name: 'OnyxView 48',
        brand: 'ShadowGrid',
        category: 'Displays',
        price: 1299.99,
        salePrice: 1299.99,
        originalPrice: 1599.99,
        discount: 18,
        showInFront: true,
        specs: ['48-inch OLED', '120Hz Refresh', 'HDMI 2.1', 'Infinite Contrast'],
        stock: 4,
        imageURL: 'https://images.unsplash.com/photo-1593305841991-05c297ba4575?w=800&auto=format&fit=crop&q=80',
        description: 'The ultimate desk-sized OLED display. Perfect for 4K gaming and professional editing.',
        rating: 4.9,
        reviewsCount: 7,
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
