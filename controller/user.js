'use strict'

const pool = require('../config/db')
const bcrypt = require('bcrypt')
const { formatImgPath } = require('../config/uploads')

module.exports = {
  renderDashboard: (req, res) => {
    res.render('user/dashboard', { name: req.user.name })
  },

  renderNotes: (req, res) => {
    pool.getConnection((err, connection) => {
      if(err) throw err
      connection.query(
        'SELECT * FROM notes WHERE userID = (SELECT id FROM users WHERE id = ?)',
        req.user.id,
        (err, result) => {
        if(err) throw err
        res.render('user/notes', { notes: result })
      })
      connection.release()
    })
  },

  renderAddNote: (req, res) => {
    res.locals.addNote = true
    res.render('user/forms')
  },

  addNote: (req, res) => {
    const note = req.body
    const userID = req.user.id
  
    pool.getConnection((err, connection) => {
      if(err) throw err
      connection.query(
        `INSERT INTO notes 
          SET title = ?,
          text = ?,
          userID = (SELECT id FROM users WHERE id = ?)`,
          [note.title, note.text, userID],
        (err, result) => {
          if(err) throw err
          res.redirect('/dashboard/notes')
        }
      )
      connection.release()
    })
  },

  RenderEditNote: (req, res) => {
    const noteID = req.params.id

    pool.getConnection((err, connection) => {
      if(err) throw err
      connection.query(
        'SELECT * FROM notes WHERE noteID = ?', noteID,
        (err, result) => {
          if(err) throw err
          const note = result[0]
          res.locals = {
            editNote: true,
            title: note.title,
            date: note.date_added,
            text: note.text,
            id: noteID
          }
          res.render('user/forms')
        }
      )
      connection.release()
    })
  },

  editNote: (req, res) => {
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
        }
      )
      connection.release()
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
        }
      )
      connection.release()
    })
  },

  renderImages: (req, res) => {
    const userID = req.user.id

    pool.getConnection((err, connection) => {
      if(err) throw err
      connection.query(
        'SELECT * FROM images WHERE userID = (SELECT id FROM users WHERE id = ?)',
        userID,
        (err, results) => {
          if(err) throw err
          res.locals.images = results
          res.render('user/images')
        }
      )
      connection.release()
    })
  },

  renderUploadImg: (req, res) => {
    res.locals.uploadImg = true
    res.render('user/forms')
  },

  uploadImg: (req, res) => {
    const userID = req.user.id
    const file = req.file
    const path = formatImgPath(req.file.path)

    pool.getConnection((err, connection) => {
      if(err) throw err
      connection.query(
        `INSERT INTO images
        SET name = ?,
        fileName = ?,
        path = ?,
        userID = (SELECT id FROM users WHERE id = ?)`,
        [file.originalname, file.filename, path, userID],
        (err, result) => {
          if (err) throw err
          res.redirect('/dashboard/images')
        }
      )
      connection.release()
    })
  },

  deleteImg:(req, res) => {
    const imgID = req.params.id
    const userID = req.user.id

    pool.getConnection((err, connection) => {
      connection.query(
        'DELETE FROM images WHERE imgID = ? AND userID = ?',
        [imgID, userID],
        (err, result) => {
          if(err) throw err
          res.redirect('/dashboard/images')
        }
      )
      connection.release()
    })
  },

  renderConfiguration: (req, res) => {
    res.locals.name = req.user.name
    res.render('user/configuration')
  },

  changeName: (req, res) => {
    const name = req.body.name
    const id = req.user.id

    pool.getConnection((err, connection) => {
      if(err) throw err
      connection.query(
        `UPDATE users
        SET name = ?
        WHERE id = ?`,
        [name, id],
        (err, result) => {
          if(err) throw err
          res.redirect('/dashboard')
        }
      )
      connection.release()
    })
  },

  changePassword: (req, res) => {
    const { password, new_password } = req.body
    const id = req.user.id

    pool.getConnection((err, connection) => {
      if(err) throw err
      connection.query(
        'SELECT * FROM users WHERE id = ?', id,
        async (err, result) => {
          if (err) throw err

          const user = result[0]
          const validPassword = await bcrypt.compare(password, user.password)

          if (validPassword) {
            const encryptedPassword = await bcrypt.hash(new_password, 10)

            connection.query(
              'UPDATE users SET password = ? WHERE id = ?', [encryptedPassword, id],
              (err, result) => {
                if (err) throw err
                res.redirect('/logout')
              }
            )
          }
          else {
            res.locals.wrongPassword = true
            await res.render('user/configuration')
          }
        }
      )
      connection.release()
    })
  },
  
  deleteAccount: (req, res) => {
    const id = req.user.id
  }
}