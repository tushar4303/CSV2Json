import * as multer from 'multer';

export const upload = multer({
  dest: './uploads/',
  limits: { fileSize: 1024 * 1024 * 5 }, // 5MB
  fileFilter(req, file, cb) {
    if (!file?.originalname?.match(/\.(csv)$/)) {
      return cb(new Error('Only CSV files are allowed!'));
    }
    cb(null, true);
  }
});