const express = require('express');
const bcrypt = require('bcrypt');
const User = require('../models/User');
const UserAuth = require('../models/UserAuth');
const cryptoJS = require('crypto-js');
const crypto = require('crypto');
const { time } = require('console');

const authRouter = express.Router();

authRouter.post('/login', (req, res) => {
  const body = req.body;

  if (!body.username || !body.password)
    return res.status(400).send({ message: 'Missing username or password field(s)' });

  User.findOne({ where: { username: body.username } })
    .then(user => {
      if (!user)
        return res.status(400).send({ message: 'Incorrect username or password' });

      bcrypt.compare(body.password, user.password, (err, result) => {
        if (err)
          console.log(err);
        if (!result)
          return res.status(400).send({ message: 'Incorrect username or password' });

        const token = crypto.randomBytes(128).toString('hex');
        const key = crypto.randomBytes(16).toString('hex');
        const userToken = `${token}.${key}`;
        const encryptedToken = cryptoJS.AES.encrypt(token, key).toString();

        UserAuth.create({ encrypted_token: encryptedToken, userId: user.id })
          .then(userAuth => res.status(200).send({ token: userToken }))
          .catch(err => console.log(err));
      });
    })
    .catch(err => console.log(err));
});

authRouter.post('/register', (req, res) => {
  const body = req.body;

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
          } else {
            return res.status(400).send({ message: 'Username or email has already been taken by another user' });
          }
        })
        .catch(err => console.log(err));
    })
    .catch(err => console.log(err));
});

module.exports = authRouter;