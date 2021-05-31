module.exports = fields => {
  for(const field in fields) {
    if(!fields[field].trim() || !fields[field].trim())
      return false
  }
    
  return true
}