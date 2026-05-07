const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    user: { type: String, required: true },
    rating: { type: Number, required: true },
    date: { type: String, required: true },
    comment: { type: String, required: true },
    verifiedPurchase: { type: Boolean, default: true }
});

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    brand: { type: String, required: true },
    category: { type: String, required: true, enum: ['Input', 'Output'] },
    price: { type: Number, required: true },
    specs: [{ type: String }],
    stock: { type: Number, required: true },
    imageURL: { type: String, required: true },
    description: { type: String, default: '' },
    rating: { type: Number, default: 0 },
    reviewsCount: { type: Number, default: 0 },
    reviews: [reviewSchema]
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);
