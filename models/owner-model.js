const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const OwnerSchema = new Schema({
    name: {
        type: String,
        // required: true,
        trim: true
    },
    email: {
        type: String,
        // required: true,
        // unique: true,
        trim: true
    },
    password: {
        type: String,
        // required: true,
        trim: true
    },
    products: {
        type: Array,
        default:[]
    },
    picture:{
        type: String,
    }
});

const Owner = mongoose.model('Owner', OwnerSchema);

module.exports = Owner;