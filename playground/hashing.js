const {SHA256} = require('crypto-js');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// sha256
// let message = 'Hi I\'m Mahmoud Soliman';
// let hashed = SHA256(message);

// console.log(`Message: ${message}`);
// console.log(`Hashed: ${hashed}`);


// jwt

// let data = {
//     id: 4
// };

// let secret = '123ABC'; 

// let token = jwt.sign(data, secret);
// console.log(token);

// let verification = jwt.verify(token + 'a', secret);
// console.log(verification);

// bcrypt

let pass = '123ABC';

bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(pass, salt, (err, hashed) => {
        console.log(hashed);

        bcrypt.compare(pass + 'a', hashed, (err, res) => {
            console.log(res);
        });
    });
});
