const mysql = require('mysql')

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'app',
  connectionLimit: 99
})

module.exports = pool