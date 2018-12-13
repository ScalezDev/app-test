const mongoose = require('mongoose');
const Conversation = require('./models/conversations');
const Merchant = require('./models/merchants');

// ES6 Promises
mongoose.Promise = global.Promise;

const databaseModule = (() => {
  const connect = ({ server, port, database, username, password }) =>
    new Promise((resolve, reject) => {
      // Connect to mongodb
      mongoose.connect(
        `mongodb://${username}:${password}@${server}:${port}/${database}`,
        { useNewUrlParser: true },
      );
      mongoose.connection
        .once('open', () => {
          resolve();
        })
        .on('error', (error) => {
          reject(error);
        });
    });

  const addConversation = (merchantId, messages) => {
    const msgs = messages.map((msg, i) => ({
      sender: i % 2 === 0 ? 'BOT' : 'USER',
      text: msg,
    }));
    console.log(merchantId);
    const conversation = new Conversation({
      merchantId,
      messages: msgs,
    });
    return conversation.save();
  };

  const addMerchant = (domain, accessToken) => {
    const merchant = new Merchant({
      domain,
      accessToken,
    });
    return merchant.save();
  };

  const checkIfMerchantExists = async (domain) =>
    !!(await Merchant.findOne({ domain }));

  const findMerchant = async (merchantId) =>
    (await Merchant.findOne({ _id: merchantId }));

  const addCustomerToMarchent = (merchant, customerData) => {
    merchant.customers.push(customerData);
    merchant.save();
  }
  return {
    connect,
    addConversation,
    addMerchant,
    checkIfMerchantExists,
    findMerchant,
    addCustomerToMarchent,
  };
})();

module.exports = databaseModule;
