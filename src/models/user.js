const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: String,
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    age: Number,
    gender: String,
    photoUrl: {
        type: String,
    },
    about: {
        type: String,
        default: 'Hello! I am new to DevTinder. I am excited to connect with other developers and share my projects and ideas. Looking forward to making new friends and learning from this amazing community!'
    },
    skills: {
        type: [String],
    }
});

const User = mongoose.model('User', userSchema);
module.exports = User;