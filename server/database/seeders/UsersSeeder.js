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
                    token: jwt.sign({_id, access: 'auth'}, process.env.JWT_SECRET)
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

let seedOneWithToken = (email) => {

    // prepare token data
    let _id = ObjectId().toString();
    let access = 'auth';
    let token = jwt.sign({_id, access}, process.env.JWT_SECRET);

    // create new user instance
    let user = new User({
        _id,
        email,
        password: '123456',
        tokens: [{access, token}]
    });

    user.save();

    return {token, _id};
};

let seedWithIds = (num, ids) => {

    let users = [];
    for (let i = 1; i <= num; i++) {
        let user = new User({
            _id: ids[i],
            email: `test${ids[i]}@example.com`,
            password: '1234567',
        });

        users.push(user);
    }

    User.insertMany(users);
};


module.exports = {
    seed,
    seedWithOutToken,
    seedOneWithToken,
    seedWithIds
}