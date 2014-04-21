var url = require('url'),
  	express = require('express.io'),
    _ = require('lodash'),
	  ReactAsync = require('react-async');

require('node-jsx').install();

var app = express();
app.http().io();
var api = require('./components/api')(app);
var Model = require('./model')(api);
var text = new Model('Text');

api.set(text.toJSON());

setTimeout(function() {
  console.log('Changing property!');
  text.set('text', 'kip');
}, 5000);


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

app.use('/build', express.static(__dirname + '/build'));
app.use('/public', express.static(__dirname + '/public'));
app.use(render);

app.listen(3030);
