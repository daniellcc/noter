'use strict'

const pool = require('../config/db')
const bcrypt = require('bcrypt')

module.exports = {
  renderConfiguration: (req, res) => {
    res.locals.name = req.user.name
    res.render('user/configuration')
  },

  changeName: (req, res) => {
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

  changePassword: (req, res) => {
    const { password, new_password } = req.body
    const id = req.user.id

    pool.getConnection((err, connection) => {
      if(err) throw err
      connection.query(
        'SELECT * FROM users WHERE userID = ?', id,
        async (err, result) => {
          if (err) throw err

          const user = result[0]
          const validPassword = await bcrypt.compare(password, user.password)

          if (validPassword) {
            const encryptedPassword = await bcrypt.hash(new_password, 10)

            connection.query(
              'UPDATE users SET password = ? WHERE userID = ?', [encryptedPassword, id],
              (err, result) => {
                if (err) throw err
                res.redirect('/logout')
              }
            )
          }
          else {
            res.locals.wrongPassword = true
            await res.render('user/configuration')
          }
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