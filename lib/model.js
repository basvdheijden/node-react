var load = function(api, model, data) {
  this.api = api;
  this.type = model;
  this.modelDefinition = require('../models/' + this.type.toLowerCase());

  this.model = new this.modelDefinition(data);
  this.model.on('change', (function(model) {
    this.api.set(model.toJSON());
  }.bind(this)));

  return this.model;
};

module.exports = function(api) {
  return function(model, data) {
    return load(api, model, data);
  };
};
