module.exports = {

  _config: {
    actions: false,
    shortcuts: false,
    rest: false
  },

  id: {
    type: 'integer',
    autoIncrement: true,
    primaryKey: true,

  },

  attributes: {
    notification: {
      type: 'text'
    },
    /*
     users:{
     collection:"Users",
     via: 'feed_user',
     },*/

  },
  /* afterCreate: function(entry, cb) {
   // console.log(entry);
   sails.sockets.broadcast('feed', 'new_entry', entry);

   console.log(cb);
   cb();
   },*/

  datasync: function (entry,cb) {
    //  console.log(entry);
      sails.sockets.broadcast('feed', 'new_entry', entry);
      cb();




  },

  datacountsync: function (count,cb) {
   // console.log("feed");
   // console.log(count);
    sails.sockets.broadcast('count', 'new_count', count);
    cb();




  }
};
