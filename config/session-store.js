const session = require('express-session')
const MySQLStore = require('express-mysql-session')(session)
const dbEnv = require('./db_env')()

module.exports = connection => {
  const sessionStore = new MySQLStore({
    createDatabaseTable: true,
    dbEnv,
    schema: {
      tableName: 'sessions',
      columnNames: {
        session_id: 'session_id',
        expires: 'expires',
        data: 'data'
      }
    }
  }, connection)

  return session({
    name: 'session',
    secret: process.env.SESSION_SECRET,
    store: sessionStore,
    resave: false,
    saveUninitialized: false
  })
}
