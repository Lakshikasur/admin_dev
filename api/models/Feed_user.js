module.exports = {
  _config: {
    actions: false,
    shortcuts: false,
    rest: false
  },

  attributes: {
    id: {
      type: 'integer',
      primaryKey: true
    },
    notification_id: {
      type: 'integer'

    },
    user_id: {
      type: 'integer'
    },
    date_time: {
      type: 'string'

    },
    status:{
      type:'strings'

    },



  }
}
