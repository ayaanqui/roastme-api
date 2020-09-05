const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const passport = require('passport');
const cors = require('cors');
// Models
const User = require('./models/User');
const UserAuth = require('./models/UserAuth');

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());

/**
 * Passport authentication
 */
const BearerStrategy = require('passport-http-bearer').Strategy;

passport.use(new BearerStrategy(
  (token, done) => {
    const encryptToken = require('./util/encryptToken');
    const encryptedToken = encryptToken(token);

    UserAuth.findOne({ where: { encrypted_token: encryptedToken } })
      .then(userAuth => {
        if (!userAuth)
          return done(null, false, { message: 'Invalid token' });

        User.findByPk(userAuth.userId)
          .then(user => {
            if (!user)
              return done(null, false, { message: 'Invalid token' });
            return done(null, user);
          })
          .catch(err => done(err));
      })
      .catch(err => done(err));
  }
));


app.use(require('./routes'));

// catch 404 and forward to error handler
app.use((_, res) => {
  res.status(404).send('404, Endpoint is invalid');
});

// error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500).send('error');
});

module.exports = app;
