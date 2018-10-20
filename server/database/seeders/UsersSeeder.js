const jwt           = require('jsonwebtoken'),
      {ObjectId}    = require('mongodb');

const User = require('../../models/User');

let seed = (num) => {

    for (let i = 1; i <= num; i++) {
        let _id = ObjectId().toString();

        let user = new User({
            _id,
            email: `test${_id}@example.com`,
            password: '123456',
            tokens: [
                {
                    access: 'auth',
                    token: jwt.sign({_id, access: 'auth'}, '123ABC')
                }
            ]
        });

        user.save();
    }
};

let seedWithOutToken = (num) => {
    for (let i = 1; i <= num; i++) {
        let _id = ObjectId().toString();

        let user = new User({
            _id,
            email: `test${_id}@example.com`,
            password: '123456',
        });

        user.save();
    }
};


module.exports = {
    seed,
    seedWithOutToken
}