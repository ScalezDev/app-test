const fs = require('fs');

module.exports = (() => {
  const getCredentials = () => {
    try {
      const privateKey = fs.readFileSync('./certificates/private.key');
      const certificate = fs.readFileSync('./certificates/scalez.io.crt');
      const caRoot = fs.readFileSync('./certificates/CA_root.crt');
      const caBundle = fs.readFileSync(
        './certificates/ca_bundle_certificate.crt',
      );
      return {
        key: privateKey,
        cert: certificate,
        ca: [caRoot, caBundle],
      };
    } catch (e) {
      console.log('Certificate Error:', e); //eslint-disable-line
    }
  };

  return {
    getCredentials,
  };
})();
