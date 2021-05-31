'use strict'

module.exports = {
  renderHome: (req, res) => {
    res.render('home')
  },

  renderNotFound: (req, res) => {
    res.render('404')
  },

  register: async (req, res) => {
    const pool = require('../config/db')
    const bcrypt = require('bcrypt')
    const user = req.body
    user.password = await bcrypt.hash(req.body.password, 10)

    pool.getConnection((err, connection) => {
      if(err) throw err

      connection.query(
        'INSERT INTO users SET ?', user,
        (err, result) => {
          if(err) throw err
          res.redirect('/')
          connection.release()
        }
      )
    })
  },

  login: (req, res, next) => {
    const passport = require('passport')
    
    passport.authenticate('local', (err, user) => {
      if(err) return next(err)

      if(!user) {
        res.locals.invalidUser = true
        return res.render('home')
      }
      
      req.logIn(user, err => {
        if(err) return next(err)
        return res.redirect('/dashboard')
      })
    })(req, res, next)
  },
 
  logout: (req, res) => {
    req.session.destroy()
    req.logout()
    res.redirect('/')
  }
}