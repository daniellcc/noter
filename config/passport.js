const LocalStrategy = require('passport-local').Strategy
const pool = require('./db')

module.exports = passport => {
  passport.use(new LocalStrategy(
    { usernameField: 'email'},
    (email, password, done) => {
      const bcrypt = require('bcrypt')

      pool.getConnection((err, connection) => {
        if(err) throw err

        connection.query(
          `SELECT * FROM users WHERE email = "${email}"`,
          async (err, result) => {
            if(err) throw err

            if(!result.length) return done(null, false)

            const user = result[0]
            const validPass = await bcrypt.compare(password, user.password)

            if(!validPass) return done(null, false)

            return done(null, user)
          }
        )
        connection.release()
      })
    }
  ))

  passport.serializeUser((user, done) => {
    return done(null, user.id)
  })

  passport.deserializeUser((id, done) => {
    pool.getConnection((err, connection) => {
      if(err) throw err

      connection.query(
        'SELECT * FROM users WHERE id = ?', id,
        (err, result) => {
          if(err) throw err

          const user = result[0];
          return done(err, user)
        }
      )
      connection.release()
    })
  })
}