const validator = require('validator'),
      jwt       = require('jsonwebtoken'),
      _         = require('lodash'),
      bcrypt    = require('bcryptjs');

const mongoose = require('../database/mongoose');
const Schema = mongoose.Schema;

let userSchema = Schema({
    email: {
        type: String,
        required: [true, 'Email is required'],
        trim: true,
        unique: [true, 'Email already exist'],
        validate: {
            // validator: (value) => { // long syntax
            //     return validator.isEmail(value);
            // },
            validator: validator.isEmail, // short syntax
            message: '{VALUE} is not a valid Email'
        }
    },
    password: {
        type: String,
        required: true,
        trim: true,
        minlength: 6
    },
    tokens: [{
        access: {
            type: String,
            required: true
        },
        token: {
            type: String,
            required: true
        }
    }]
});


/*      define custom instance methods      */

// generate jwt token
userSchema.methods.generateAuthToken = function() {
    let user = this;
    // generate token
    let access = 'auth'; // token type
    let token = jwt.sign({_id: user._id, access}, process.env.JWT_SECRET).toString();

    // add token to the tokens array
    user.tokens.push({access, token});

    // save token and return
    return user.save()
        .then(() => token);
    
    /* Note */
    // token here will be passed as the parameter to the next promise
    // it's not neccessary to return a promise to make promise chain, you can return field like we did here and 
    // this will be passed as argument to the promise

};

// customize return response
userSchema.methods.toJSON = function() {
    let user = this;
    let userObject = user.toObject(); // convert the model to normal object with document properties only !

    return _.pick(userObject, ['_id', 'email']);
};

// delete user token
userSchema.methods.deleteToken = function(token) {

    let user = this;

    // normal way delete user token
    // user.tokens = user.tokens.filter(value => value.token != token);
    // return user.save();
    

    // delete user token using mongoose update operators
    return user.updateOne({
        $pull: {
            tokens: {
                token: token
            }
        }
    });

}; 


/*      define custom Model methods      */
userSchema.statics.findByToken = function(token) {
    let User = this;
    let decoded;

    try {
        decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
        return Promise.reject('Token is not valid');
    }
    
    return User.findOne({
        _id: decoded._id,
        'tokens.access': 'auth',
        'tokens.token': token
    });
    
};

userSchema.statics.findByCredentials = function(email, password) {

        let User = this;

        // get the user using email
        return User.findOne({email})
                    .then(user => {

                        if (!user) {
                            return Promise.reject('Wrong Credentials');
                        }

                        return new Promise((resolve, reject) => {
                            
                            // compare the passwords
                            bcrypt.compare(password, user.password, (err, result) => {

                                if (err || !result) {
                                    reject('Wrong Credentials');
                                }

                                resolve(user);
                            });
                        })
                    });
};


/*      mongoose middlewares        */
userSchema.pre('save', function(next) {
    let user = this;

    // only make the hashing if the password is modified
    // to avoid hashing the hashed one, ...etc
    if (user.isModified('password')) { 

        bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(user.password, salt, (err, hashed) => {
                this.password = hashed;
                next();
            });
        });
    } else {
        next();
    }

});

module.exports = mongoose.model('User', userSchema);



