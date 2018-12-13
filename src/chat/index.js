const express = require('express');

const router = express.Router();

router.use('/client', require('./client'));
router.use('/server', require('./server'));

module.exports = router;
