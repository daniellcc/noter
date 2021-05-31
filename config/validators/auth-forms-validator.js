const pool = require('../database/db')

module.exports = {

  validRegister(req, res, next) {
    if(!req.body.name.trim() || !req.body.email.trim() || !req.body.password.trim())
      return res.render('home', {invalidForm: true})

    next()
  },

  emailTaked(req, res, next) {
    pool.getConnection((err, connection) => {
      if(err) throw err

      connection.query(
        'SELECT email FROM users WHERE email = ?', req.body.email,
        (err, result) => {
          if(err) throw err
          if(result.length > 0)
            return res.render('home', {takedEmail: true})

          next()
        }
      )
    })
  }
}