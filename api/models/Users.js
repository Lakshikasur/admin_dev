/**
 * Users.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */
//var bcrypt = require('bcryptjs');
//var salt = bcrypt.genSaltSync(10);

module.exports = {
  _config: {
    actions: false,
    shortcuts: false,
    rest: false
  },

  attributes: {
    id:{
      type: 'integer',
      autoIncrement:true,
      primaryKey: true,
    },

    password: {
      type: "string",
      required: true
    },
    email: {
      type: "string",
      required: true
    },
    type:{
      type: "integer",
      required: true
    },

    status:{
      type: "integer",
      required: true
    },

 /*   feeds:{
      collection:"Feed",
      via:"feed_user"
    },*/






    toJSON: function () {
      var obj = this.toObject();
      delete obj.password;
      return obj;
    }
  },

/*  beforeCreate : function (pwd, next, cb) {
    bcrypt.genSalt(10, function (err, salt) {
      bcrypt.hash(pwd, salt, function (err, hash) {
        pass= hash;
        next(null,pass,cb);
      })
    })
  },*/

/*  validPassword: function(password, user, cb) {
    bcrypt.compare(password, user.password, function(err, match) {
      if (err) cb(err);

      if (match) {
        cb(null, true);
      } else {
        cb(err);
      }
    });
  }*/




};

