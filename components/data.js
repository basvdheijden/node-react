var ReactAsync = require('react-async'),
    api = require('./api')();

module.exports = {
  mixins: [ReactAsync.Mixin],

  getInitialStateAsync: function(cb) {
    api.get(function(err, data) {
      cb(err, data);
    });
  },

  componentWillMount: function() {
    api.on('data', function(data) {
      this.setState(data);
    }.bind(this));

    api.connect();
  },

  update: function(data) {
    api.set(data);
    this.setState(data);
  }
};
