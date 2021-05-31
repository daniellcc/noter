function loggedIn(req, res, next){
  if(req.isAuthenticated()) next()

  else res.redirect('/')
}

function checkLogged(req, res, next) {
  if(req.isAuthenticated()) res.redirect('/dashboard')

  else next()
}

module.exports = {
  loggedIn,
  checkLogged
}