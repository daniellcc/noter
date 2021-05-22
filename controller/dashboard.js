'use strict'

const pool = require('../config/db')

module.exports = {
  renderDashboard: (req, res) => {
    pool.getConnection((err, connection) => {
      if(err) throw err
      connection.query(
        'SELECT * FROM notes ORDER BY userID DESC LIMIT 1',
        (err, result) => {
          if(err) throw err
          const lastNoteAdded = result[0]
          res.render('user/dashboard', { name: req.user.name, note: lastNoteAdded })
        }
      )
    })
    
  }
}