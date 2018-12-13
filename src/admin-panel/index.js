const express = require('express');
const cookie = require('cookie');

const router = express.Router();

const { apiKey } = require('../../config');

router.get('/', (req, res) => {
  res.render('home', {
    title: 'Home',
    api_key: apiKey,
    shop: req.headers.cookie && cookie.parse(req.headers.cookie).shop,
  });
});

module.exports = router;
