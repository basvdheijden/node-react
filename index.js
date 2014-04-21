var url = require('url'),
  	express = require('express.io'),
    _ = require('lodash'),
	  ReactAsync = require('react-async');

require('node-jsx').install();

var app = express();
var api = require('./components/api')(app);

api.set({
  text: 'Start typing..',
  operations: 5
});

var ReactApp = require('./components/app')(app);
var render = function(req, res, next) {
	var path = url.parse(req.url).pathname;

	console.log('Request :: ' + path);

	ReactAsync.renderComponentToStringWithAsyncState(new ReactApp({
		path: path
	}), function(err, markup, data) {
		if (err) {
			return next(err);
		}

		res.send(ReactAsync.injectIntoMarkup(markup, data));
	});
};

app.http().io();

app.io.route('data', function(req) {
  api.set(req.data);
  req.io.broadcast('data', req.data);
});

app.io.route('connect', function(req) {
  req.io.emit('connect', api.get());
});

app.use('/build', express.static(__dirname + '/build'));
app.use('/public', express.static(__dirname + '/public'));
app.use(render);

app.listen(3030);
