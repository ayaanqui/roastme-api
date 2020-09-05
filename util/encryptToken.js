const CryptoJS = require('crypto-js');

const encryptToken = token => {
  const parsedToken = token.split('.');
  const encryptedToken = CryptoJS.HmacSHA512(parsedToken[0], parsedToken[1]).toString();
  return encryptedToken;
};

module.exports = encryptToken;