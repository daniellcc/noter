'use strict'

const ctrlr = require('../controller/index')
const auth = require('../config/auth')

module.exports = app => {

  app.get('/', auth.checkLogged, ctrlr.renderHome)
  app.get('/logout', ctrlr.logout)
  app.post('/login', ctrlr.login)
  app.post('/register', ctrlr.register)
}