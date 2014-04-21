var Backbone = require('backbone');

var Text = Backbone.Model.extend({
  defaults: {
    text: 'Start typing..',
    operations: 5
  }
});

module.exports = Text;
