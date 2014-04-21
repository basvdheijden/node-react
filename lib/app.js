/**
 * @jsx React.DOM
 */

var React = require('react'),
    ReactRouter = require('react-router-component'),
    Pages = ReactRouter.Pages,
    Page = ReactRouter.Page,
    Link = ReactRouter.Link,
    NotFound = ReactRouter.NotFound,
    Home = require('../views/home'),
    Data = require('./data');

/**
 * Dependencies
 */
var NotFoundHandler = React.createClass({
  render: function() {
    return <p>Page not found</p>;
  }
});


/**
 * Module definition
 */
var App = React.createClass({
  mixins: [Data],

	render: function() {
		return (
			<html>
        <head>
          <link rel="stylesheet" href="/public/style.css" />
          <script src="/socket.io/socket.io.js"></script>
          <script src="/build/client.js"></script>
        </head>
        <body>
          <div className="main">
            <Pages path={this.props.path}>
              <Page path="/" handler={Home} text={this.model.get('text')} operations={this.model.get('operations')} onUpdate={this.update} />
              <NotFound handler={NotFoundHandler} />
            </Pages>
          </div>
        </body>
      </html>
		);
	}
});

module.exports = App;

if (typeof window !== 'undefined') {
  window.onload = function() {
  	React.renderComponent(App(), document);
  }
}
