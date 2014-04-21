var _ = require('lodash'),
    EventEmitter = require('events').EventEmitter,
    util = require('util'),
    noop = function() {};

var API = function(app) {
  if (app) {
    this.app = app;
  }

  this.server = (typeof window === 'undefined');

  this.io = false;
  this.connect = function() {
    if (!this.server && !this.io) {
      this.io = io.connect();
      this.io.on('data', function(data) {
        this.emit('data', data);
      }.bind(this));
    }

    return this;
  };

  this.query = function(type, cb) {
    this.connect();

    this.io.on(type, function(data) {
      (cb || noop)(null, data)
    });

    this.io.emit(type);

    return this;
  };

  this.get = function(cb) {
    if (this.server) {
      (cb || noop)(null, this.app.get.call(this.app, 'data'));
    }
    else {
      this.query('connect', cb);
    }

    return this;
  };

  this.set = function(data, cb) {
    if (this.server) {
      this.get(function(oldData) {
        (cb || noop)(null, this.app.set.call(this.app, 'data', _.merge(data, oldData)));
      }.bind(this));
    }
    else {
      this.connect();
      this.io.emit('data', data);
    }

    return this;
  };

  return this;
};

util.inherits(API, EventEmitter);

var instance = null;
var getInstance = function(app){
  if (instance === null) {
    instance = new API(app);
  }

  return instance;
};

module.exports = getInstance;
