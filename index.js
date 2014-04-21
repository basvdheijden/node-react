var express = require('express.io'),
    session = require('express-session'),
    cookieParser = require('cookie-parser'),
    app = express();

app.http().io();

var api = require('./lib/api')(app);
var Model = require('./lib/model')(api);
var text = new Model('Text');
api.set({
  type: 'Text',
  model: text.toJSON()
}, false);

setTimeout(function() {
  console.log('Changing property!');
  text.set('text', 'kip');
}, 5000);

/**
 * Configuration
 */
app.use(cookieParser());
app.use(session({
  secret: 'node-react.io',
  key: 'sid',
  cookie: {
    secure: true
  }
}));

/**
 * Static routes
 */
app.use('/build', express.static(__dirname + '/build'));
app.use('/public', express.static(__dirname + '/public'));

require('node-jsx').install();
var React = require('./lib/react');
app.use(React);

app.listen(3030);
