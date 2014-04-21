var debug = require('debug')('model');

var models = {
  text: require('../models/text')
};

var load = function(api, model, data) {
  if (!model) {
    throw new Error('Modek type must be set when initializing a model.');
  }

  this.api = api;
  this.type = model;
  this.modelDefinition = models[this.type.toLowerCase()];

  this.model = new this.modelDefinition(data);

  this.model.on('change', (function(model) {
    // Only if server
    if (typeof window !== 'undefined') {
      return;
    }

    debug('Data changed in backend. Broadcasting.. kip?');
    this.api.app.io.broadcast('data', model.toJSON());
  }.bind(this)));

  return this.model;
};

module.exports = function(api) {
  return function(model, data) {
    return load(api, model, data);
  };
};
