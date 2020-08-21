const Sequelize = require('sequelize');
const db = require('../database');

const Profile = db.define('profiles', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  fullname: {
    type: Sequelize.STRING(300),
    allowNull: true,
  },
  imageFilename: {
    type: Sequelize.STRING(40),
    allowNull: true,
  },
});

module.exports = Profile;