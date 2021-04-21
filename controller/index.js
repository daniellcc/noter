'use strict'

module.exports = {
  renderHome: (req, res) => {
    res.render('home')
  },

  renderNotFound: (req, res) => {
    res.render('404')
  },

  register: async (req, res) => {
    const bcrypt = require('bcrypt')
    const pool = require('../config/db')

    const hashedPass = await bcrypt.hash(req.body.password, 10)
    const user = req.body
    user.password = hashedPass

    pool.getConnection((err, connection) => {
      if(err) throw err

      connection.query(
        'INSERT INTO users SET ?', user,
        (err, result) => {
          if(err) throw err
          res.redirect('/')
        }
      )
      connection.release()
    })
  },

  login: (req, res) => {
    const passport = require('passport')
    
    passport.authenticate('local', {
      failureRedirect: '/',
      successRedirect: '/dashboard'
    })
    
    (req, res)
  },

  logout: (req, res) => {
    req.session.destroy()
    req.logout()
    res.redirect('/')
  }
}