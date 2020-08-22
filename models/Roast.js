const Sequelize = require('sequelize');
const db = require('../database');

const Roast = db.define('roasts', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  title: {
    type: Sequelize.STRING(100),
    allowNull: false,
  },
  caption: {
    type: Sequelize.STRING(200),
    allowNull: false,
  },
  description: {
    type: Sequelize.TEXT,
    allowNull: true,
  },
  timestamp: {
    type: Sequelize.DATE,
    allowNull: false,
  },
});

module.exports = Roast;