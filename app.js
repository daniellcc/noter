const express = require('express')
const app = express()
const pool = require('./config/database/db')
const path = require('path')
const helmet = require('helmet')

// enviroment variables
require('dotenv').config()

// view
app.set('view engine', 'ejs')

// middlewares
app.use(express.static(path.join(__dirname, 'public')))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(helmet())

app.disable('x-powered-by')

// Store sessions
const connection = pool.getConnection((err, connection) => {
  if(err) throw err
  connection.connect()
})
const sessionStore = require('./config/database/session-store')(connection)
app.use(sessionStore)

// passport
const passport = require('passport')

require('./config/passport')(passport)
app.use(passport.initialize())
app.use(passport.session())

// routes
require('./router/index')(app) // general routes
require('./router/user')(app) // user routes
require('./router/404')(app) // 404 not found


// server listener
const PORT = process.env.PORT || 3000

app.listen(PORT, err => {
  if(err) throw (err)
  console.log('working on port ', PORT)
})
