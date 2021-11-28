require('dotenv-defaults').config();

const env = process.env.NODE_ENV || 'dev';

module.exports = {
  [env]: {
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOSTNAME,
    dialect: 'postgresql',
  },
};
