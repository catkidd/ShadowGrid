const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    brand: { type: String, required: true },
    category: { type: String, required: true, enum: ['Input', 'Output'] },
    price: { type: Number, required: true },
    specs: [{ type: String }],
    stock: { type: Number, required: true },
    imageURL: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);
