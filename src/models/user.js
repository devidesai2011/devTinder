const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
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
        unique: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error('Invalid email format');
            }
        }
    },
    password: {
        type: String,
        required: true,
        validate(value) {
            if (!validator.isStrongPassword(value, { minLength: 8, minLowercase: 1, minUppercase: 1, minNumbers: 1, minSymbols: 1 })) {
                throw new Error('Password must be at least 8 characters long and include uppercase letters, lowercase letters, numbers, and symbols');
            }
        }
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
        default: 'https://static.vecteezy.com/system/resources/thumbnails/042/332/098/small_2x/default-avatar-profile-icon-grey-photo-placeholder-female-no-photo-images-for-unfilled-user-profile-greyscale-illustration-for-socail-media-web-vector.jpg',
        validate(value) {
            if (!validator.isURL(value)) {
                throw new Error('Invalid URL format');
            }
        }
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

userSchema.methods.getJWT = async function () {
    const user = this;
    const token = await jwt.sign({ _id: this._id }, "DEV@Tinder$007", {
        expiresIn: '7d'
    });

    return token;
}

userSchema.methods.comparePassword = async function (password) {
    const user = this;
    const isPasswordValid = await bcrypt.compare(password, this.password);

    return isPasswordValid;
}

const User = mongoose.model('User', userSchema);
module.exports = User;