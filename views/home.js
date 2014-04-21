/**
 * @jsx React.DOM
 */

var React = require('react');

var Home = React.createClass({
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

module.exports = Home;
