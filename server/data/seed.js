const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('../models/Product');

dotenv.config();

const products = [
    {
        name: 'ShadowBlade X1',
        brand: 'ShadowGrid',
        category: 'Input',
        price: 189.99,
        specs: ['Optical Switches', 'Aluminum Frame', 'RGB Backlit', 'PBT Keycaps'],
        stock: 15,
        imageURL: 'https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?auto=format&fit=crop&q=80&w=800'
    },
    {
        name: 'NeonPulse Pro',
        brand: 'ShadowGrid',
        category: 'Input',
        price: 79.99,
        specs: ['26,000 DPI', 'Lightweight 58g', 'Paracord Cable', 'PTFE Feet'],
        stock: 25,
        imageURL: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&q=80&w=800'
    },
    {
        name: 'GridVision 27Q',
        brand: 'ShadowGrid',
        category: 'Output',
        price: 499.99,
        specs: ['27-inch IPS', '1440p Resolution', '175Hz Refresh', '1ms GtG'],
        stock: 8,
        imageURL: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&q=80&w=800'
    },
    {
        name: 'GhostType Silent',
        brand: 'ShadowGrid',
        category: 'Input',
        price: 159.99,
        specs: ['Silent Linear Switches', 'Gasket Mount', 'Hotswappable', '65% Layout'],
        stock: 12,
        imageURL: 'https://images.unsplash.com/photo-1595225405011-5114ad010245?auto=format&fit=crop&q=80&w=800'
    },
    {
        name: 'ApexVertical',
        brand: 'ShadowGrid',
        category: 'Input',
        price: 89.99,
        specs: ['Ergonomic Vertical Design', 'Wireless 2.4G', 'Customizable Side Buttons', 'Rechargeable'],
        stock: 20,
        imageURL: 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?auto=format&fit=crop&q=80&w=800'
    },
    {
        name: 'StudioPro 32U',
        brand: 'ShadowGrid',
        category: 'Output',
        price: 899.99,
        specs: ['32-inch 4K', 'HDR 600', '99% DCI-P3', 'USB-C PD 90W'],
        stock: 5,
        imageURL: 'https://images.unsplash.com/photo-1547119957-637f8679db1e?auto=format&fit=crop&q=80&w=800'
    },
    {
        name: 'TactileNeo K3',
        brand: 'ShadowGrid',
        category: 'Input',
        price: 129.99,
        specs: ['Low Profile Switches', 'Bluetooth 5.0', 'Mac/Win Compatible', 'Slim Aluminum Body'],
        stock: 18,
        imageURL: 'https://images.unsplash.com/photo-1587829741301-dc798b83dadc?auto=format&fit=crop&q=80&w=800'
    },
    {
        name: 'ShadowFlow Mousepad',
        brand: 'ShadowGrid',
        category: 'Input',
        price: 34.99,
        specs: ['900x400mm', 'Micro-textured Surface', 'Anti-slip Base', 'Stitched Edges'],
        stock: 50,
        imageURL: 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?auto=format&fit=crop&q=80&w=800'
    }
];

const seedDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/shadowgrid');
        await Product.deleteMany({});
        await Product.insertMany(products);
        console.log('Database Seeded Successfully');
        process.exit();
    } catch (err) {
        console.error('Error seeding database:', err);
        process.exit(1);
    }
};

seedDB();
