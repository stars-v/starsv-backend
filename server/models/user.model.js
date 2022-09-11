const mongoose = require('mongoose')

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add a full name']
    },
    phone: {
        type: String,
        required: [true, 'Please add a phone number'],
        unique: true
    },
    password: {
        type: String,
        required: [true, 'Please add a password']
    },
    profilePhoto: {
        type: String
    },
    confirmed: {
        type: Boolean,
        default: false
    }
},
    {
        timestamps: true,
    }
)


const User = mongoose.model('User', userSchema)

module.exports = User
