'use strict'

const pool = require('../config/database/db')

module.exports = {
  renderDashboard: (req, res) => {
    const userID = req.user.id
    
    pool.getConnection((err, connection) => {
      if(err) throw err
      connection.query(
        'SELECT * FROM notes WHERE userID = ? ORDER BY userID DESC LIMIT 1 ', userID,
        (err, result) => {
          if(err) throw err
          const lastNoteAdded = result[0]
          res.render('user/dashboard', { name: req.user.name, note: lastNoteAdded }) 
          connection.release()
        }
      )
    })
  }
}