const express = require('express');
const cookie = require('cookie');

const router = express.Router();

const Config = require('../../config');

router.get('/', (req, res) => {
  const { apiKey } = Config;
  res.render('home', {
    title: 'Home',
    api_key: apiKey,
    shop: req.headers.cookie && cookie.parse(req.headers.cookie).shop,
  });
});

module.exports = router;
