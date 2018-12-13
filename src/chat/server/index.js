const express = require('express');
const ChatServer = require('./chat-server');

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

module.exports = router;
