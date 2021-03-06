const express = require('express');
const router = express.Router();

router.get('', (_, res) => res.send('Hello, welcome to the RoastMe api'));
router.use('/auth', require('./auth'));
router.use('/roasts', require('./roasts'));

module.exports = router;