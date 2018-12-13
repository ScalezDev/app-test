const Guid = require('guid');
const DialogFlowApi = require('./dialogflow-api');
const db = require('../../db/database-module');

const ChatServer = (() => {
  const liveBots = {};
  const intents = {};

  const createNewBot = (merchantId) => {
    const newBot = {
      merchantId,
      conversation: [],
      collectedData: { height: {}, weight: {}, braSize: {} },
    };

    const botId = Guid.create().value;

    liveBots[botId] = newBot;

    return botId;
  };

  const submitQuery = (botId, query) => {
    const bot = liveBots[botId];
    bot.conversation.push(query.message);
    return new Promise((resolve, reject) => {
      DialogFlowApi.sendQuery(botId, query.message)
        .then((response) => {
          const { handleParameters, options, endOfConversation } =
            intents[response.intentName] || {};
          bot.conversation.push(response.text);
          bot.collectedData = handleParameters
            ? { ...bot.collectedData, ...handleParameters(response.data) }
            : bot.collectedData;
          resolve({
            message: response.text,
            options: options || [],
            isRunning: true,
            startCalculating: endOfConversation,
          });
        })
        .catch(reject);
    });
  };

  const startConversation = (shopId) => {
    // TODO merchantId = DB.getMerchantByShop(shop).id;
    const botId = createNewBot(shopId);
    return new Promise((resolve, reject) => {
      DialogFlowApi.sendQuery(botId, 'Hello')
        .then((response) => {
          liveBots[botId].conversation.push(response.text);
          resolve({
            botId,
            message: response.text,
            options: [],
          });
        })
        .catch(reject);
    });
  };

  const getCalculation = (botId) => {
    const { merchantId, collectedData, conversation } = liveBots[botId];
    const { height, weight, braSize } = collectedData;
    db.addConversation(merchantId, conversation);
    return new Promise((resolve, reject) => {
      resolve({
        message: `You are ${height.value} ${height.unit} tall and weigh ${
          weight.value
        } ${weight.unit}.
        Your bra is ${braSize.band}${braSize.cup}, Correct?`,
        // options: ['Yes', 'No'],
        isRunning: false,
      });
    });
  };

  const init = () => {
    DialogFlowApi.init();

    // welcome
    intents['63d8e6b6-53c7-438b-be0a-6317b41e7761'] = {};

    // get height
    intents['b8851e84-3c8e-4584-996f-9b042366e8b9'] = {
      handleParameters: (data) => ({
        height: {
          unit: data['unit-length'].structValue.fields.unit.stringValue,
          value: data['unit-length'].structValue.fields.amount.numberValue,
        },
      }),
    };

    // get weight
    intents['dbbbd00d-11a0-4c0e-b38e-0b04a965435b'] = {
      handleParameters: (data) => ({
        weight: {
          unit: data['unit-weight'].structValue.fields.unit.stringValue,
          value: data['unit-weight'].structValue.fields.amount.numberValue,
        },
      }),
    };

    // get small bra
    intents['a3c13a1a-2ac4-46d9-bceb-51e53206b1e6'] = {
      endOfConversation: true,
      handleParameters: (data) => ({
        braSize: {
          cup: data['bra-small-cup'].stringValue,
          band: data.number.numberValue,
        },
      }),
    };

    // get large bra
    intents['31edcd94-38bf-4c2c-a468-3564e1c8cc5c'] = {
      options: ['US', 'UK', 'Australia'],
      handleParameters: (data) => ({
        braSize: {
          cup: data['bra-large-cup'].stringValue,
          band: data.number.numberValue,
        },
      }),
    };

    // get bra system
    intents['2ec7179f-e6bc-43c5-a217-63904a384d0e'] = {
      endOfConversation: true,
      handleParameters: (data) => ({
        braSystem: data['bra-system'].stringValue,
      }),
    };
  };

  return {
    init,
    startConversation,
    submitQuery,
    getCalculation,
  };
})();

module.exports = ChatServer;
