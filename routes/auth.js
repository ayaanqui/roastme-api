const express = require('express');
const bcrypt = require('bcrypt');
const User = require('../models/User');
const UserAuth = require('../models/UserAuth');
const authRouter = express.Router();

authRouter.post('/register', (req, res) => {
  const body = req.body;

  console.log(req.body);

  if (!body.username || !body.email || !body.password)
    return res.status(400).send({ message: 'Missing field(s)' });

  User.findOne({ where: { username: body.username } })
    .then(uUsername => {
      User.findOne({ where: { email: body.email } })
        .then(uEmail => {
          if (!uUsername && !uEmail) {
            const saltRounds = 12;

            bcrypt.hash(body.password, saltRounds, (err, hashedPassword) => {
              if (err)
                return res.status(400).send({ message: 'Error, Could not create account' });

              User.create({
                username: body.username,
                email: body.email,
                password: hashedPassword,
              })
                .then(newUser => {
                  return res.status(200).send({ message: 'Account created successfully!' });
                })
                .catch(err => console.log(err));
            });
          }
        })
        .catch(err => console.log(err));
    })
    .catch(err => console.log(err));
});

module.exports = authRouter;