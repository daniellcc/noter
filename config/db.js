const mysql = require('mysql')
require('dotenv').config()

const dbEnv = require('./db_env')()

const pool = mysql.createPool({dbEnv, connectionLimit: 100})

module.exports = pool