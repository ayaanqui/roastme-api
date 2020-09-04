const Sequelize = require('sequelize');
const db = require('../database');

const Roast = db.define('roasts', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  caption: {
    type: Sequelize.STRING(200),
    allowNull: false,
  },
  image: {
    type: Sequelize.TEXT,
    allowNull: false,
  },
  description: {
    type: Sequelize.TEXT,
    allowNull: true,
  },
});

module.exports = Roast;