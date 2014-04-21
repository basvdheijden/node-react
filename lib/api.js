var EventEmitter = require('events').EventEmitter,
    util = require('util'),
    debug = require('debug')('api'),
    noop = function() {};

/**
 * In memory datastore.
 */
var dataStore = {
  data: {}
};

//setInterval(function() {
//
//}, 2000)

var API = function(app) {
  if (app) {
    this.app = app;
    this.app.io.route('data', function(req) {
      debug('Route data received.');
      this._get(function(err, data) {
        data.model.set(req.data);
        req.io.broadcast('data', req.data);
        debug('Set new data & broadcasted.');
      });
    }.bind(this));

    this.app.io.route('connect', function(req) {
      debug('Connection opened.');
      this.get(function(data) {
        req.io.emit('connect', data);
        debug('Returning new data to connection.');
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
    debug('api._get called');
    if (this.server) {
      (cb || noop)(null, dataStore.data);
    }
    else {
      this.query('connect', cb);
    }

    return this;
  };

  this.get = function(cb) {
    debug('api.get called');
    return this._get(function(err, data) {
      if (!Object.keys(data).length) {
        return (cb || noop)(err, {});
      }

      return (cb || noop)(err, {
        type: data.type,
        model: data.model.toJSON()
      });
    });
  };

  this.set = function(data, cb) {
    debug('api.set called');
    if (this.server) {
      this._get(function(err, oldData) {
        if (!Object.keys(oldData).length) {
          debug('Data not set. replacing.');
          dataStore.data = data;
        }
        else {
          dataStore.data.model.set(data);
        }

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
