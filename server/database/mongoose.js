const mongoose = require('mongoose');

// database values
const dbUrl = 'mongodb://localhost:27017/';
const dbName = 'TodoApp';

// configure Mongoose
mongoose.Promise = global.Promise;

// connect to databse
mongoose.connect(dbUrl + dbName, {useNewUrlParser: true});


module.exports = mongoose;

