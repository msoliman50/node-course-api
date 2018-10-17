const mongoose = require('mongoose');

// database values
const dbUrI = process.env.MONGODB_URI;


// configure Mongoose
mongoose.Promise = global.Promise;

// connect to databse
mongoose.connect(dbUrI, {useNewUrlParser: true});


module.exports = mongoose;

