const express = require('express');
const passport = require('passport');
const multer = require('multer');
const crypto = require('crypto');
const path = require('path');

const Roast = require('../models/Roast');
const User = require('../models/User');

const roasts = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, './public/uploads/'),
  filename: (req, file, cb) => {
    const newFilename = `${crypto.randomBytes(50).toString('hex')}${path.extname(file.originalname)}`;
    cb(null, newFilename);
  },
});
// create the multer instance that will be used to upload/save the file
const upload = multer({ storage });


// Fetch all roasts
roasts.get('/', (req, res) => {
  Roast.findAll({
    order: [
      ['id', 'DESC'],
    ]
  })
    .then(roasts => res.status(200).send(roasts))
    .catch(_ => res.status(400).send({ message: 'Error fetching roasts' }));
});

roasts.post('/',
  passport.authenticate('bearer', { session: false }),
  upload.single('image'),
  (req, res) => {
    const body = req.body;

    if (!body.caption)
      return res.status(400).send({ message: 'Title and image fields required' });

    Roast.create({
      userId: req.user.id,
      image: req.file.filename,
      caption: body.caption,
    })
      .then(newRoast => res.status(201).send(newRoast.dataValues))
      .catch(_ => res.status(400).send({ message: 'Could not create roast' }));
  }
);

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