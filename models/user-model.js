const mongoose = require('mongoose');



const userSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    cart: [{
       product:{ type: mongoose.Schema.Types.ObjectId,
        ref: 'product'},
        
        quantity:{type:Number,
            default:0
        }

    }],
    isadmin: {
        type: Boolean,
        default: false
    }
});

const User = mongoose.model('User', userSchema);

module.exports = User;