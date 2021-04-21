'use strict'

const userCtrlr = require('../controller/user')
const auth = require('../config/auth')
const { upload } = require('../config/uploads')

module.exports = app => {
  //dashboard
  app.get('/dashboard', auth.loggedIn, userCtrlr.renderDashboard)

  //notes
  app.get('/dashboard/notes', auth.loggedIn, userCtrlr.renderNotes)
  app.get('/dashboard/notes/add-note', auth.loggedIn, userCtrlr.renderAddNote)
  app.get('/dashboard/notes/edit-note/:id', auth.loggedIn, userCtrlr.RenderEditNote)
  app.post('/add-note', userCtrlr.addNote)
  app.post('/edit-note/:id', userCtrlr.editNote)
  app.get('/delete-note/:id', userCtrlr.deleteNote)

  // images
  app.get('/dashboard/images', auth.loggedIn, userCtrlr.renderImages)
  app.get('/dashboard/images/upload-img', auth.loggedIn, userCtrlr.renderUploadImg)
  app.post('/upload-img', upload, userCtrlr.uploadImg)
  app.get('/delete-img/:id', userCtrlr.deleteImg)

  //config
  app.get('/dashboard/configuration', auth.loggedIn, userCtrlr.renderConfiguration)
  app.post('/change-name', userCtrlr.changeName)
  app.post('/change-password', userCtrlr.changePassword)
  app.get('/delete-account', userCtrlr.deleteAccount)
}