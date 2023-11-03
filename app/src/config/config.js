require('dotenv').config();
env = process.env;

const config ={
    VERSION: env.VERSION,
    AUTH:    env.AUTH,
    URL:     env.URL
}
module.exports = config;
