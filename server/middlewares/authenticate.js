const User = require('../models/User'); 

// define the auth middleware
let authenticate = (req, res, next) => {
    // get token
    let token = req.header('x-auth');

    User.findByToken(token)
    .then(user => {

        if (!user) {
            res.status(404)
                .send({
                    message: 'No users exists'
                });
        }

        req.user = user;
        req.token = token;
        next();
    })
    .catch(err => {
        res.status(401)
            .send({
                message: 'Authentication is required',
                error: err
            });
    });
}

module.exports = authenticate;