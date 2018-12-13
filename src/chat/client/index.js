const express = require('express');
const path = require('path');
const fs = require('fs');

const router = express.Router();

const mainJs = fs.readFileSync(path.join(__dirname, 'main.js'), 'utf8');

const Config = require('../../../config').getDetails();

router.use('/assets', express.static(path.join(__dirname, '/assets/')));
router.use('/main.js', (req, res) => {
  const { appAddress } = Config;
  const { id } = req.query;
  if (id) {
    const out = mainJs
      .replace('@SHOP_ID', id)
      .replace('@APP_ADDRESS', appAddress);

    res.setHeader('content-type', 'text/javascript');
    res.write(out);
    res.end();
  } else {
    res.status(400).send('No Shop ID');
  }
});

module.exports = router;
