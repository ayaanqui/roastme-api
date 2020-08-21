const Sequelize = require('sequelize');
const db = require('../database');

const User = db.define('users', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  username: {
    type: Sequelize.STRING(30),
    allowNull: false,
    unique: true,
  },
  email: {
    type: Sequelize.TEXT,
    allowNull: false,
    unique: true,
  },
  password: {
    type: Sequelize.TEXT,
    allowNull: false,
  }
});

module.exports = User;