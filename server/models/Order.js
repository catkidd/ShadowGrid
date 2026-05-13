const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    name: { type: String, required: true },
    imageURL: { type: String },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true, min: 1 }
});

const orderSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    items: [orderItemSchema],
    total: { type: Number, required: true },
    status: {
        type: String,
        enum: ['Processing', 'Shipped', 'Delivered', 'Cancelled'],
        default: 'Processing'
    },
    shippingAddress: {
        fullName: { type: String, required: true },
        address: { type: String, required: true },
        city: { type: String, required: true },
        postalCode: { type: String, required: true },
        country: { type: String, required: true }
    },
    paymentMethod: { type: String, default: 'Card' }
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
