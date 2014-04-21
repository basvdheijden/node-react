var _ = require('lodash'),
    EventEmitter = require('events').EventEmitter,
    util = require('util'),
    noop = function() {};

var API = function(app) {
  if (app) {
    this.app = app;
    this.app.io.route('data', function(req) {
      this._get(function(err, data) {
        data.model.set(req.data);
        req.io.broadcast('data', req.data);
      });
    }.bind(this));

    this.app.io.route('connect', function(req) {
      this.get(function(data) {
        req.io.emit('connect', data);
      });
    }.bind(this));
  }

  this.server = (typeof window === 'undefined');
  this.req = false;
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
      (cb || noop)(null, data);
    });

    this.io.emit(type);

    return this;
  };

  this._get = function(cb) {
    if (this.server) {
      (cb || noop)(null, this.app.get.call(this.app, 'data'));
    }
    else {
      this.query('connect', cb);
    }

    return this;
  };

  this.get = function(cb) {
    return this._get(function(err, data) {
      (cb || noop)(err, {
        type: data.type,
        model: data.model.toJSON()
      });
    })
  };

  this.set = function(data, cb, opts) {
    if (this.server) {
      this._get(function(err, oldData) {
        oldData.model.set(data, opts);
        this.app.set.call(this.app, 'data', oldData);
        (cb || noop)(data);
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
