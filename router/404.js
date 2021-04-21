'use strict'

const ctrlr = require('../controller/index')

module.exports = app => {
  app.get('*', ctrlr.renderNotFound)
}