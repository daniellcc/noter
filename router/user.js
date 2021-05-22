'use strict'

const dashboardCtrlr = require('../controller/dashboard')
const notesCtrlr = require('../controller/notes')
const configCtrlr = require('../controller/configuration')
const auth = require('../config/auth')

module.exports = app => {
  //dashboard
  app.get('/dashboard', auth.loggedIn, dashboardCtrlr.renderDashboard)

  //notes
  app.get('/dashboard/notes', auth.loggedIn, notesCtrlr.renderNotes)
  app.get('/dashboard/notes/add-note', auth.loggedIn, notesCtrlr.renderAddNote)
  app.get('/dashboard/notes/edit-note/:id', auth.loggedIn, notesCtrlr.renderEditNote)
  app.post('/add-note', notesCtrlr.addNote)
  app.post('/edit-note/:id', notesCtrlr.editNote)
  app.get('/delete-note/:id', notesCtrlr.deleteNote)

  //config
  app.get('/dashboard/configuration', auth.loggedIn, configCtrlr.renderConfiguration)
  app.post('/change-name', configCtrlr.changeName)
  app.post('/change-password', configCtrlr.changePassword)
  app.get('/delete-account', configCtrlr.deleteAccount)
}