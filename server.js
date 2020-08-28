const express = require('express');
const app = require('./app');
const db = require('./database/');

// Relations
require('./models/relations');

// db.sync({ force: true })
db.sync()
  .then(res => {
    const port = 3001;
    const host = 'localhost';

    app.listen(port, () => {
      console.log(`\nServer running on http://${host}:${port}/\n\n`);
    });
  })
  .catch(err => console.log(err));