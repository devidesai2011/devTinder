const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema({
    firstName: {
        type: String,
        required: true,
        minLength: 4,
        maxLength: 20
    },
    lastName: String,
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    age: {
        type: Number,
        min: 18
    },
    gender: {
        type: String,
        validate(value) {
            if (!["male", "female", "other"].includes(value)) {
                throw new Error('Invalid gender');
            }
        }
    },
    photoUrl: {
        type: String,
        default: 'https://static.vecteezy.com/system/resources/thumbnails/042/332/098/small_2x/default-avatar-profile-icon-grey-photo-placeholder-female-no-photo-images-for-unfilled-user-profile-greyscale-illustration-for-socail-media-web-vector.jpg'
    },
    about: {
        type: String,
        default: 'Hello! I am new to DevTinder. I am excited to connect with other developers and share my projects and ideas. Looking forward to making new friends and learning from this amazing community!'
    },
    skills: {
        type: [String],
    }
}, {
    timestamps: true
});

const User = mongoose.model('User', userSchema);
module.exports = User;