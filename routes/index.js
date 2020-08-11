const express = require('express');
const router = express.Router();

router.get('', (_, res) => res.send('Hello, welcome to the RoastMe api'));

module.exports = router;