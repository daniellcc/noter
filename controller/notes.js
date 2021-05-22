'use strict'

const pool = require('../config/db')
const { validNote } = require('../config/auth-forms-validator')

module.exports = {
  renderNotes: (req, res) => {
    pool.getConnection((err, connection) => {
      if(err) throw err
      connection.query(
        'SELECT * FROM notes WHERE userID = (SELECT id FROM users WHERE id = ?)',
        req.user.id,
        (err, result) => {
          if(err) throw err
          res.render('user/notes', {notes: result})
          connection.release()
        }
      )
    })
  },

  renderAddNote: (req, res) => {
    res.locals.addNote = true
    res.render('user/notes-forms')
  },

  addNote: (req, res) => {
    if(!validNote(req)) {
      res.locals.emptyFields = true
      return module.exports.renderAddNote(req, res)
    }
    const note = req.body
    const userID = req.user.id
  
    pool.getConnection((err, connection) => {
      if(err) throw err
      connection.query(
        `INSERT INTO notes 
          SET title = ?,
          text = ?,
          userID = (SELECT id FROM users WHERE id = ?),
          date_added = (SELECT CURDATE())`,
          [note.title, note.text, userID],
        (err, result) => {
          if(err) throw err
          res.redirect('/dashboard/notes')
          connection.release()
        }
      )
    })
  },

  renderEditNote: (req, res) => {
    const noteID = req.params.id

    pool.getConnection((err, connection) => {
      if(err) throw err
      connection.query(
        'SELECT * FROM notes WHERE noteID = ?', noteID,
        (err, result) => {
          if(err) throw err
          const note = result[0]
          res.render('user/notes-forms', {
            editNote: true,
            title: note.title,
            date: note.date_added,
            text: note.text,
            id: noteID
          })
          connection.release()
        }
      )
      
    })
  },

  editNote: (req, res) => {
    if(!validNote(req)) {
      res.locals.emptyFields = true
      return module.exports.renderEditNote(req, res)
    }

    const noteID = req.params.id
    const note = req.body
    
    pool.getConnection((err, connection) => {
      if(err) throw err
      connection.query(
        `UPDATE notes
        SET title = ?, text = ?
        WHERE noteID = ?`,
        [note.title, note.text, noteID],
        (err, result) => {
          if(err) throw err
          res.redirect('/dashboard/notes')
          connection.release()
        }
      )
      
    })
  },

  deleteNote: (req, res) => {
    const noteID = req.params.id
    const userID = req.user.id

    pool.getConnection((err, connection) => {
      if(err) throw err
      connection.query(
        'DELETE FROM notes WHERE noteID = ? AND userID = ?',
        [noteID, userID],
        (err, result) => {
          if(err) throw err
          res.redirect('/dashboard/notes')
          connection.release()
        }
      )
    })
  }
}