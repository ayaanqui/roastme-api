const Sequelize = require('sequelize');
const db = require('../database');

const UserAuth = db.define('user_auth', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  encrypted_token: {
    type: Sequelize.TEXT,
    allowNull: false,
  }
});

module.exports = UserAuth;