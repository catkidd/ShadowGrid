const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    user: { type: String, required: true },
    rating: { type: Number, required: true },
    date: { type: String, required: true },
    comment: { type: String, required: true },
    verifiedPurchase: { type: Boolean, default: true }
});

const productSchema = new mongoose.Schema({
    sku: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    brand: { type: String, required: true },
    category: { type: String, required: true, enum: ['Keyboards', 'Mice', 'Displays'] },
    price: { type: Number, required: true }, // List Price / Original Price
    salePrice: { type: Number }, // Current Selling Price
    originalPrice: { type: Number }, // Deprecated in favor of list/sale price but keeping for compatibility
    specs: [{ type: String }],
    stock: { type: Number, required: true },
    imageURL: { type: String, required: true },
    description: { type: String, default: '' },
    rating: { type: Number, default: 0 },
    reviewsCount: { type: Number, default: 0 },
    reviews: [reviewSchema]
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);
