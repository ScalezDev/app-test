const dialogflow = require('dialogflow');

const Config = require('../../../config').getDetails();

const DialogFlowApi = (() => {
  const PROJECT_ID = Config.dialogFlowProjectId;
  const LANGUAGE_CODE = 'en-US';
  let sessionClient;

  const init = () => {
    sessionClient = new dialogflow.SessionsClient();
  };

  const sendQuery = (sessionId, query) => {
    const sessionPath = sessionClient.sessionPath(PROJECT_ID, sessionId);

    const request = {
      session: sessionPath,
      queryInput: {
        text: {
          text: query,
          languageCode: LANGUAGE_CODE,
        },
      },
    };
    return new Promise((resolve, reject) => {
      sessionClient
        .detectIntent(request)
        .then((responses) => {
          if (!responses) {
            reject(new Error('No response.'));
          } else {
            const [resp] = responses;
            resolve({
              intentName: resp.queryResult.intent.name.split('/').reverse()[0],
              text: resp.queryResult.fulfillmentText,
              data: resp.queryResult.parameters.fields,
            });
          }
        })
        .catch((error) => {
          reject(error);
        });
    });
  };
  return {
    init,
    sendQuery,
  };
})();

module.exports = DialogFlowApi;
