/**
 * @jsx React.DOM
 */

var React = require('react'),
    ReactRouter = require('react-router-component'),
    Pages = ReactRouter.Pages,
    Page = ReactRouter.Page,
    Link = ReactRouter.Link,
    NotFound = ReactRouter.NotFound;

/**
 * Dependencies
 */
var HomePage = React.createClass({
  update: function() {
    this.props.onUpdate({
      text: this.refs.data.getDOMNode().value,
      operations: ++this.props.operations
    });
  },

	render: function() {
		return (
      <div>
        <h1>{this.props.operations}</h1>
        <textarea ref="data" value={this.props.data} onChange={this.update} autoFocus={true} />
      </div>
    );
	}
});

var NotFoundHandler = React.createClass({
  render: function() {
    return <p>Page not found</p>;
  }
});


/**
 * Module definition
 */
var App = React.createClass({
  mixins: [require('./data.js')],

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
              <Page path="/" handler={HomePage} data={this.state.text} operations={this.state.operations} onUpdate={this.update} />
              <NotFound handler={NotFoundHandler} />
            </Pages>
          </div>
        </body>
      </html>
		);
	}
});

module.exports = function(e) {
  return App;
};

if (typeof window !== 'undefined') {
  window.onload = function() {
  	React.renderComponent(App(), document);
  }
}
