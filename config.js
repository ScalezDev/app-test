module.exports = (() => {
  const details = {
    apiKey: '1147408bd932ee445da9cf6d46d11cec',
    apiSecret: '3d7bf0fae44459a85480462bbe07bd6d',
    scopes: 'read_products,write_script_tags,read_themes,write_themes',
    databaseCred: {
      server: 'ds127704.mlab.com',
      port: '27704',
      database: 'scalez-data',
      username: 'server',
      password: 'alphabeta123',
    },
  };

  const init = (isLocal) => {
    details['appAddress'] = isLocal
      ? 'https://nimrod-chatbot.localtunnel.me'
      : 'https://app.scalez.io';
  };

  return {
    ...details,
    init,
  };
})();
