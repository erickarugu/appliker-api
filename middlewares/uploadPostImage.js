const multer = require('multer');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/images/posts/');
  },
  filename: (req, file, cb) => {
    let originalnameArray = file.originalname.split('.');
    cb(null, `avatar-${Date.now()}.${originalnameArray[originalnameArray.length - 1]}`);
  }
});

module.exports.upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'image/png' || file.mimetype === 'image/jpg' || file.mimetype === 'image/jpeg') {
      cb(null, true);
    } else {
      cb(null, false);
      return cb(new Error('Only png, jpg and jpeg images are allowed.'));

    }
  }
});;;