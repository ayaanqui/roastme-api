const Sequelize = require('sequelize');
const dbuser = require('./dbuser.json');

const db = new Sequelize(
  'roastme',
  dbuser.username,
  dbuser.password,
  {
    host: 'localhost',
    dialect: 'mysql'
  }
);
module.exports = db;