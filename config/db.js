const mysql = require('mysql')

let dbConfig

if(process.env.NODE_ENV == 'development') {
  dbConfig = {
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'app',
    connectionLimit: 100
  }
}
else {
  dbConfig = {
    host: process.env.DB_HOST,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    connectionLimit: 100
  } 
}

const pool = mysql.createPool(dbConfig)

module.exports = pool