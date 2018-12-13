const path = require('path');
const request = require('request');
const cookie = require('cookie');
const cors = require('cors');
const bodyParser = require('body-parser');
const express = require('express');
const db = require('./src/db/database-module');

const app = express();

const { appAddress, databaseCred } = require('./config');

app.set('views', path.join(__dirname, 'src/admin-panel/views'));
app.set('view engine', 'ejs');

app.use(bodyParser.json());

app.use(cors());

// app.get('/', (req, res) => res.redirect('/admin-panel'));

app.use('/shopify', require('./src/shopify-auth'));

app.use('/', require('./src/admin-panel'));

app.use('/chat', require('./src/chat'));

app.get('/addChat', (req, res) => {
  request.post(
    {
      url: `https://${
        cookie.parse(req.headers.cookie).shop
      }/admin/script_tags.json`,
      headers: {
        'X-Shopify-Access-Token': cookie.parse(req.headers.cookie).access_token,
      },
      json: {
        script_tag: {
          event: 'onload',
          src: `${appAddress}/chat/client/main.js`,
        },
      },
    },
    (response) => {
      res.send(response);
    },
  );
});

/* eslint-disable no-console */
db.connect(databaseCred)
  .then(() => {
    console.log('Connected to the database!');
    app.listen(3000, () => {
      console.log('Example app listening on port 3000!');
    });
  })
  .catch((error) => {
    console.error('database connection failed:');
    console.error(error.errmsg);
  });
