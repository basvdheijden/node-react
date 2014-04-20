var url = require('url'),
  	express = require('express.io'),
	  ReactAsync = require('react-async');

require('node-jsx').install();

var app = express();
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

app.set('data', 'kip');

app.io.route('data', function(req) {
//  app.set('data', req.data.data);
  req.io.broadcast('data', req.data);
});

//app.io.route('a', function(req) {
//  console.log('yeah');
//  req.io.emit('b', app.get('data'));
//});

app.use('/build', express.static(__dirname + '/build'));
app.use(render);

app.listen(3030);
