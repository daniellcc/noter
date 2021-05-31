'use strict'

const pool = require('../config/database/db')
const emptyFormsValidator = require('../config/validators/empty-forms-validator')

module.exports = {
  renderConfiguration: (req, res) => {
    res.locals.name = req.user.name
    res.render('user/configuration')
  },

  changeName: (req, res) => {
    const completedForm = emptyFormsValidator(req.body)
    if(!completedForm) {
      res.locals.emptyName = true
      return module.exports.renderConfiguration(req, res)
    }

    const name = req.body.name
    const id = req.user.id
    
    pool.getConnection((err, connection) => {
      if(err) throw err
      connection.query(
        `UPDATE users SET name = ? WHERE id = ?`,
        [name, id],
        (err, result) => {
          if(err) throw err
          res.redirect('/dashboard')
          connection.release()
        }
      )
    })
  },
  
  deleteAccount: (req, res) => {
    const userID = req.user.id

    pool.getConnection((err, connection) => {
      if(err) throw err
      connection.query(`DELETE FROM notes WHERE userID = ?`, userID)
      connection.query(`DELETE FROM users WHERE id = ?`, userID)
      req.session.destroy()
      req.logout()
      res.redirect('/')
      connection.release()
    })
  }
}