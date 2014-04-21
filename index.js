var express = require('express.io'),
    app = express();

app.http().io();

var api = require('./lib/api')(app);
var Model = require('./lib/model')(api);
var text = new Model('Text');
api.set(text.toJSON());

//setTimeout(function() {
//  console.log('Changing property!');
//  text.set('text', 'kip');
//}, 5000);

/**
 * Static routes
 */
app.use('/build', express.static(__dirname + '/build'));
app.use('/public', express.static(__dirname + '/public'));

require('node-jsx').install();
var React = require('./lib/react');
app.use(React);

app.listen(3030);
