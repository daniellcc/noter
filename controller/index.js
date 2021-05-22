'use strict'

const { validRegister } = require('../config/auth-forms-validator')

module.exports = {
  renderHome: (req, res) => {
    res.render('home')
  },

  renderNotFound: (req, res) => {
    res.render('404')
  },

  register: async (req, res) => {
    if(!validRegister(req)) {
      res.locals.invalidForm = true
      return res.render('home')
    }

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