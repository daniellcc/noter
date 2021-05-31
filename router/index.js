'use strict'
const { validRegister, emailTaked }  = require('../config/validators/auth-forms-validator')

const ctrlr = require('../controller/index')
const auth = require('../config/validators/auth')

module.exports = app => {

  app.get('/', auth.checkLogged, ctrlr.renderHome)
  app.get('/logout', ctrlr.logout)
  app.post('/login', ctrlr.login)
  app.post('/register', validRegister, emailTaked ,ctrlr.register)
}