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
  io: false,

  getInitialState: function(cb) {
    if (app) {
      return {
        defaultValue: app.get('data')
      };
    }

    this.io = io.connect();
    var self = this;
    this.io.on('data', function(data) {
      self.setState(data);
    });

    return {
      defaultValue: 'kip'
    }
  },

  update: function() {
    var data = this.refs.data.getDOMNode().value;

    this.setState({
      defaultValue: data
    });

    this.io.emit('data', {
      defaultValue: data
    });
  },

	render: function() {
		return (
      <textarea ref="data" value={this.state.defaultValue} onChange={this.update} />
    );
	}
});

/**
 * Module definition
 */
var App = React.createClass({
	render: function() {
		return (
			<html>
        <head>
          <link rel="stylesheet" href="/build/style.css" />
          <script src="/socket.io/socket.io.js"></script>
          <script src="//code.jquery.com/jquery-1.11.0.min.js"></script>
          <script src="/build/client.js"></script>
          <script src="/build/script.js"></script>

        </head>
        <body>
          <div className="main">
            <Pages path={this.props.path}>
              <Page path="/" handler={HomePage} />
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
