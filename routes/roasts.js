const express = require('express');
const passport = require('passport');
const Roast = require('../models/Roast');
const User = require('../models/User');

const roasts = express.Router();

// Fetch all roasts
roasts.get('/', (req, res) => {
  Roast.findAll()
    .then(roasts => res.status(200).send(roasts))
    .catch(_ => res.status(400).send({ message: 'Error fetching roasts' }));
});

roasts.post('/', passport.authenticate('bearer', { session: false }), (req, res) => {
  const body = req.body;

  if (!body.image || !body.caption)
    return res.status(400).send({ message: 'Title and image fields required' });

  Roast.create({
    userId: req.user.id,
    image: body.image,
    caption: body.caption,
  })
    .then(newRoast => res.status(201).send(newRoast.dataValues))
    .catch(_ => res.status(400).send({ message: 'Could not create roast' }));
});

roasts.get('/:id', (req, res) => {
  const roastId = req.params.id;
  Roast.findByPk(roastId)
    .then(roast => {
      if (roast)
        return res.status(200).send(roast);
      else
        return res.status(404).send({ message: 'Could not find roast' });
    })
    .catch(_ => res.status(400).send({ message: 'There was an error while fetching the roast' }));
});

module.exports = roasts;