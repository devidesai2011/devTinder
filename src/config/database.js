const mongoose = require('mongoose');

const connectDb = async () => {
    await mongoose.connect('mongodb+srv://devidesai2011_db_user:dl0nE4WlLLWQZ3mF@namastenode.dhvmt7a.mongodb.net/devTinderDB');
}

module.exports = connectDb;

