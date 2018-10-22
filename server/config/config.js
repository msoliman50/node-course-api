// configure working environment
let env = process.env.NODE_ENV || 'development';

if (env === 'development' || env === 'testing') {
    
    // get environment configuration file
    let config = require('./env.json');

    // get current env config
    let envConfig = config[env];
    
    // set env variables
    for(const key of Object.keys(envConfig)) {
        process.env[key] = envConfig[key]
    }
}

module.exports = env;