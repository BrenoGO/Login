const Sequelize = require('sequelize');
require('dotenv').config({
  path: process.env.NODE_ENV === 'test' ? '.env.test' : '.env',
});

module.exports = {
  host: process.env.MYSQL_HOST,
  username: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
  port: process.env.MYSQL_PORT,
  dialect: 'mysql',
  logging: process.env.NODE_ENV ? false : log => console.log(log),
  operatorsAliases: Sequelize.Op,
  dialectOptions: {
    dateStrings: true,
    typeCast(field, next) { // for reading from database
      if (field.type === 'DATETIME') {
        return field.string();
      }
      return next();
    },
  },
  timezone: '-03:00',
  pool: {
    max: 30,
    min: 0,
    acquire: 1000000,
    idle: 10000,
  },
};
