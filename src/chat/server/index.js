const express = require('express');
const request = require('request-promise');
const Guid = require('guid');

const ChatServer = require('./chat-server');
const db = require('../../db/database-module');

const router = express.Router();

ChatServer.init();

router.get('/init', (req, res) => {
  ChatServer.startConversation(req.query.shop_id).then((initialResponse) =>
    res.send(JSON.stringify(initialResponse)),
  );
});

router.post('/sendQuery', (req, res) => {
  ChatServer.submitQuery(req.query.botId, req.body).then((response) =>
    res.send(JSON.stringify(response)),
  );
});

router.get('/getCalculation', (req, res) => {
  ChatServer.getCalculation(req.query.botId).then((response) =>
    res.send(JSON.stringify(response)),
  );
});

router.post('/submitUserIdentity', async (req, res) => {
  console.log('got here', req.body.merchant_id);
  const merch = await db.findMerchant(req.body.merchant_id);
  console.log(merch);
  request
    .get({
      url: `https://${merch.domain}/admin/customers/${req.body.customer_id}.json`,
      headers: {
        'X-Shopify-Access-Token': merch.accessToken,
      },
    })
    .then((response) => {
      const { customer } = JSON.parse(response);
      const gcid = Guid.create().value;
      db.addCustomerToMarchent(merch, {
        globalCustomerId: gcid,
        inShopId: customer.id,
        firstName: customer.first_name,
        lastName: customer.last_name,
        totalSpent: customer.total_spent,
      });
      res.cookie('gcid', gcid);
      res.send();
    });
});

module.exports = router;
