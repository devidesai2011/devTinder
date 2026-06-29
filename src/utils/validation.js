const validator = require('validator');

const validateSignUpData = (req) => {
    const { firstName, lastName, email, password } = req.body;

    if (!firstName || !lastName) {
        throw new Error('Name is not valid');
    } else if (firstName.length < 4 || firstName.length > 50) {
        throw new Error('First name must be between 4 and 50 characters');
    } else if (!validator.isEmail(email)) {
        throw new Error('Invalid email format');
    } else if (!validator.isStrongPassword(password, { minLength: 8, minLowercase: 1, minUppercase: 1, minNumbers: 1, minSymbols: 1 })) {
        throw new Error('Password must be at least 8 characters long and include uppercase letters, lowercase letters, numbers, and symbols');
    }
}

const validateProfileEditData = (req) => {
    const allowedFields = ['age', 'gender', 'skills', 'about'];
    const updates = Object.keys(req.body);
    const isValidOperation = updates.every((update) => allowedFields.includes(update));

    return isValidOperation;
}

module.exports = { validateSignUpData, validateProfileEditData };