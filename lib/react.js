var url = require('url'),
    ReactAsync = require('react-async'),
    ReactApp = require('./app');

var render = function(req, res, next) {
  var path = url.parse(req.url).pathname;

  ReactAsync.renderComponentToStringWithAsyncState(new ReactApp({
    path: path
  }), function(err, markup, data) {
    if (err) {
      return next(err);
    }

    res.send(ReactAsync.injectIntoMarkup(markup, data));
  });
};

module.exports = render;
