const mysql = require('mysql')

const dbEnv = require('./db_env')()

const pool = mysql.createPool({...dbEnv, connectionLimit: 100})

module.exports = pool 
