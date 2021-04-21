const multer = require('multer')

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/uploads')
  },
  filename: (req, file, cb) => {
    cb(null, file.fieldname + '-' + Date.now())
  }
});

const upload = multer({ storage: storage, fileFilter: fileFilter}).single('img')

function fileFilter(req, file, cb) {
  const fileType = file.mimetype
  const allowedExtensions = new RegExp(/.(jpg|png|jpeg)$/gi)
  if(allowedExtensions.test(fileType))
    cb(null, true)
  else {
    cb(null,false)
    cb(new Error('no valid file'))
  }
}

function formatImgPath(path) {
  const actualPath = path.split('\\')
  actualPath.shift()
  
  const formattedPath = '/' + actualPath.join('/')
  return formattedPath
}

module.exports = {
  upload,
  formatImgPath
}