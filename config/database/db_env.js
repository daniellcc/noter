require('dotenv').config()

module.exports = () => {
  if(process.env.NODE_ENV == 'development')
    return {
      host: 'localhost',
      user: 'root',
      password: '',
      database: 'app'
    }
    
  else
    return {
      host: process.env.DB_HOST,
      user: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME
    } 
  
}