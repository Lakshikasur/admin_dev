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
    link: {
      type: 'string'
    },
    notification_id:{
      model:'feed',
      type: 'integer'


    }

  }
}
