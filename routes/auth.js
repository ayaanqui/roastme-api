const express = require('express');
const authRouter = express.Router();

authRouter.get('/login', (req, res) => res.send("Login endpoint"));
authRouter.get('/register', (req, res) => res.send("Register endpoint"));

module.exports = authRouter;