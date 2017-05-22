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
    country_name: {
      type: 'string'
    },
    allowed: {
      type: 'string'

    },
    code: {
      type: 'string'
    }

  }
};
