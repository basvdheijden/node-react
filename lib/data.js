var ReactAsync = require('react-async'),
    api = require('./api')(),
    Model = require('./model')(api);

module.exports = {
  mixins: [ReactAsync.Mixin],

  // This only happens on the server.
  getInitialStateAsync: function(cb) {
    api.get(function(err, model) {
      cb(err, model);
    }.bind(this));
  },

  // This happens both on server & client.
  componentWillMount: function() {
    // Init the model.
    this.model = new Model(this.state.type, this.state.model);

    // Listen for external changes.
    api.on('data', function(data) {
      // Update the client model.
      this.model.set(data);
      if (this.model.hasChanged()) {
        this.forceUpdate();
      }
    }.bind(this));

    api.connect();
  },

  update: function(model) {
    this.model.set(model);
    if (!this.model.hasChanged()) {
      return;
    }

    // Send the data to other clients.
    this.forceUpdate();
    api.set(this.model.toJSON());
  }
};
