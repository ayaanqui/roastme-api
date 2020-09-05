const express = require('express');
const bcrypt = require('bcrypt');
const User = require('../models/User');
const UserAuth = require('../models/UserAuth');
const cryptoJS = require('crypto-js');
const crypto = require('crypto');
const passport = require('passport');

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
        const encryptedToken = cryptoJS.HmacSHA512(token, key).toString();

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
                  return res.status(201).send({ message: 'Account created successfully!' });
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

authRouter.get('/verify', passport.authenticate('bearer', { session: false }), (req, res) => {
  if (req.user) {
    res.status(200).send({ loggedIn: true });
  }
});

authRouter.post('/logout', (req, res) => {
  const body = req.body;
  if (!body.token)
    return res.status(400).send({ message: 'Token field required' });

  const encryptToken = require('../util/encryptToken');
  const encryptedToken = encryptToken(body.token);

  UserAuth.destroy({ where: { encrypted_token: encryptedToken } })
    .then(response => {
      if (response === 1)
        return res.status(200).send({ message: 'Token deleted' })
      else
        return res.status(400).send({ message: 'Invalid token' });
    })
    .catch(err => res.status(400).send({ message: 'Could not proccess token' }));
});


// Check if email is unique
authRouter.post('/check-email', (req, res) => {
  const body = req.body;

  if (!body.email)
    return res.status(400).send({ message: 'Email field required' });

  User.findOne({ where: { email: body.email } })
    .then(user => {
      return res.status(200).send({ unique: (user) ? false : true });
    })
    .catch(_ => res.status(400).send({ message: 'Error checking email' }));
});

// Check if username is unique
authRouter.post('/check-username', (req, res) => {
  const body = req.body;

  if (!body.username)
    return res.status(400).send({ message: 'Username field required' });

  User.findOne({ where: { username: body.username } })
    .then(user => {
      return res.status(200).send({ unique: (user) ? false : true });
    })
    .catch(_ => res.status(400).send({ message: 'Error checking username' }));
});

module.exports = authRouter;