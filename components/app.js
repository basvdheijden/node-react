/**
 * @jsx React.DOM
 */

var React = require('react'),
	ReactAsync = require('react-async'),
	ReactRouter = require('react-router-component'),
	Pages = ReactRouter.Pages,
	Page = ReactRouter.Page,
	Link = ReactRouter.Link,
	NotFound = ReactRouter.NotFound;

var app;

/**
 * Dependencies
 */
var HomePage = React.createClass({
  update: function() {
    this.props.onUpdate(this.refs.data.getDOMNode().value);
  },

	render: function() {
		return (
      <textarea ref="data" value={this.props.data} onChange={this.update} autoFocus={true} />
    );
	}
});

/**
 * Module definition
 */
var App = React.createClass({
  mixins: [ReactAsync.Mixin],
  io: false,

  getInitialStateAsync: function(cb) {
    if (app) {
      console.log(app.get('data'));
      return cb(null, {
        data: app.get('data')
      });
    }

    this.io.on('connect', function(data) {
      cb(null, {
        data: data
      });
    });

    this.io.emit('data');
  },

  componentWillMount: function() {
    if (!app) {
      this.io = io.connect();
      var self = this;
      this.io.on('data', function(data) {
        self.setState(data);
      });
    }
  },

  update: function(data) {
    this.setState({
      data: data
    });

    this.io.emit('data', {
      data: data
    });
  },

	render: function() {
		return (
			<html>
        <head>
          <link rel="stylesheet" href="/public/style.css" />
          <script src="/socket.io/socket.io.js"></script>
          <script src="//code.jquery.com/jquery-1.11.0.min.js"></script>
          <script src="/build/client.js"></script>
          <script src="/public/script.js"></script>

        </head>
        <body>
          <div className="main">
            <Pages path="/">
              <Page path="/" handler={HomePage} data={this.state.data} onUpdate={this.update} />
            </Pages>
          </div>
        </body>
      </html>
		);
	}
});

module.exports = function(e) {
  if (e) {
    app = e;
  }
  return App;
};

if (typeof window !== 'undefined') {
  window.onload = function() {
  	React.renderComponent(App(), document);
  }
}
