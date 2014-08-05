var jwt = require('jwt-simple'),
  _ = require('underscore'),
  pkg = require('../package.json');

var DEFAULT_TOKEN_EXPIRE = 3600;

function createJwtToken(scope, expires, config, claims) {

  var tokenDetails = {
    'scope': scope,
    'iss': config.apiKey,
    'iat': Math.floor(Date.now() / 1000),
    'exp': Math.floor(Date.now() / 1000) + expires,
    'sdk':  'OpenTok-Node-SDK/' + pkg.version
  };

  if (claims) {
    tokenDetails = _.extend(tokenDetails, claims);
  }

  var token = jwt.encode(tokenDetails, config.apiSecret);
  return token;
}

exports.getAuthToken = function(scope, config, claims) {
  return createJwtToken(scope, DEFAULT_TOKEN_EXPIRE, config, claims);
};