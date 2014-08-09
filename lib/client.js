var util = require('util'),
    requestRoot = require('request'),
    request = requestRoot,
    _ = require('lodash'),
    to_json = require('xmljson').to_json,
    package = require('../package.json'),
    auth = require('./auth'),
    defaultConfig = {
      apiKey: null,
      apiSecret: null,
      apiUrl: null,
      endpoints: {
        createSession: '/session/create'
      }
    };

var Client = function(c) {
  this.c = _.cloneDeep(defaultConfig);
  this.config(c);
};

Client.prototype.config = function(c) {
  _.extend(this.c, c);

  if ("request" in this.c) {
    request = requestRoot.defaults(this.c.request);
  }
  console.log("CONFIG: "+JSON.stringify(this.c));
  return this.c;
};

Client.prototype.createSession = function(opts, cb) {
  request.post({
    // TODO: only works while apiUrl is always up to the domain, without the ending slash
    url: this.c.apiUrl + this.c.endpoints.createSession,
    form: opts,
    headers: {
      'User-Agent': 'OpenTok-Node-SDK/' + package.version,
      'X-OPENTOK-AUTH' : auth.getAuthToken('session.create', this.c)
    }
  }, function(err, resp, body) {
    if (err) return cb(new Error('The request failed: '+err));

    // handle client errors
    if (resp.statusCode === 403) {
      return cb(new Error('An authentcation error occurred: (' + resp.statusCode + ') ' + body));
    }

    // handle server errors
    if (resp.statusCode === 500) {
      return cb(new Error('A server error occurred: (' + resp.statusCode + ') ' + body));
    }

    to_json(body, function(err, json) {
      if (err) return cb(new Error('Could not parse XML: '+err));
      cb(null, json);
    });
  });
};

Client.prototype.startArchive = function() {
};

Client.prototype.stopArchive = function() {
};

Client.prototype.getArchive = function() {
};

Client.prototype.listArchives = function() {
};

Client.prototype.deleteArchive = function() {
};

module.exports = Client;
