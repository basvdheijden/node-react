var models = {
  text: require('../models/text')
};

var load = function(api, model, data) {
  this.api = api;
  this.type = model;
  this.modelDefinition = models[this.type.toLowerCase()];

  this.model = new this.modelDefinition(data);
  this.model.on('change', (function(model) {
    // Only if server
    if (typeof window !== 'undefined') {
      return;
    }

    this.api.set({
      type: this.type,
      model: model.toJSON()
    });
  }.bind(this)));

  return this.model;
};

module.exports = function(api) {
  return function(model, data) {
    return load(api, model, data);
  };
};
