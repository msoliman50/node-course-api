const mongoose = require('mongoose');

// database values
const dbUrI = process.env.MONGODB_URI || 'mongodb://localhost:27017/TodoApp';


// configure Mongoose
mongoose.Promise = global.Promise;

// connect to databse
mongoose.connect(dbUrI, {useNewUrlParser: true});


module.exports = mongoose;

