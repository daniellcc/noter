module.exports = {

  validRegister(req) {
    if(!req.body.name.trim() || !req.body.email.trim() || !req.body.password.trim())
      return false
    
    else
      return true
  },

  validNote(req) {
    if(!req.body.title.trim() || !req.body.text.trim())
        return false

    else
      return true
  }
}