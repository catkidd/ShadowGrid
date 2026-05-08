const mongoose = require('mongoose');
const User = require('./models/User');
const dotenv = require('dotenv');

dotenv.config();

const seedAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/shadowgrid');
        console.log('MongoDB Connected for seeding...');

        const adminEmail = 'admin@shadowgrid.com';
        const adminPassword = 'admin_password_2026';

        const existingAdmin = await User.findOne({ email: adminEmail });
        if (existingAdmin) {
            console.log('Admin user already exists. Updating to ensure admin role...');
            existingAdmin.role = 'admin';
            await existingAdmin.save();
            console.log('Admin user updated.');
        } else {
            const adminUser = new User({
                email: adminEmail,
                password: adminPassword,
                role: 'admin'
            });
            await adminUser.save();
            console.log('Default admin account created successfully!');
            console.log('Email:', adminEmail);
            console.log('Password:', adminPassword);
        }

        mongoose.connection.close();
        process.exit(0);
    } catch (err) {
        console.error('Seeding failed:', err.message);
        process.exit(1);
    }
};

seedAdmin();
