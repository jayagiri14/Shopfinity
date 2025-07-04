const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    image: {
        type: Buffer,
        // required: true
    },
    name: {
        type: String,
    },
    price: {
        type: Number,
        // required: true
    },
    discount: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true // This adds createdAt and updatedAt fields
});

const product = mongoose.model('product', productSchema);

module.exports = product;
