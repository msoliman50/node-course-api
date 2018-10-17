const mongoose = require('../database/mongoose');
const Schema = mongoose.Schema;

let userSchema = Schema({
    email: {
        type: String,
        required: [true, 'Email is required'],
        trim: true,
        minlength: 7
    }
});

module.exports = mongoose.model('User', userSchema);



