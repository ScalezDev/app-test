module.exports = (() => {
  const localDetails = {
    appAddress: 'https://nimrod-chatbot.localtunnel.me',
    apiKey: '1147408bd932ee445da9cf6d46d11cec',
    apiSecret: '3d7bf0fae44459a85480462bbe07bd6d',
  };

  const previewDetails = {
    appAddress: 'https://app.scalez.io',
    apiKey: 'e34ddc0e70ee8a47b6e145f44d1f3076',
    apiSecret: 'f92252a21e57b7c183b202b60cff333a',
  };

  const globalDetails = {
    scopes: 'read_products,write_script_tags,read_themes,write_themes',
  };
  let details;
  const init = (isLocal) => {
    details = {
      ...globalDetails,
      ...(isLocal ? localDetails : previewDetails),
    };
    console.log(details);
  };

  return {
    ...details,
    init,
  };
})();
