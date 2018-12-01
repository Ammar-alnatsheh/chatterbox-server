var _ = require('lodash');

var storage = {


  _data: {},
  _id: 0,
  _firstId: 0,

  getData: function() {
    return _.values(storage._data);
  },

  setData: function(message) {
    message = this.conform(message);
    this._data[this._id] = message;
    this._id ++;
    // _data can only save 1000 message to protect the memory
    if (this._id > 1000) {
      delete this._data[this._firstId];
      this._firstId ++;
    }

  },

  conform: function( message = { } ) {
    // ensure each message object conforms to expected shape
    message.objectId = this._id;
    message.text = message.text || '';
    message.username = message.username || '';
    message.roomname = message.roomname || '';
    message.createdAt = new Date();
    return message;
  }
  
};

exports.storage = storage;