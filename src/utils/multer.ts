import crypto from 'crypto'
import multer from 'multer'
import path from 'path'

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/')
  },
  filename: (req, file, cb) => {
    const randomName = crypto.randomBytes(16).toString('hex')
    cb(null, `${randomName}${path.extname(file.originalname)}`)
  },
})

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png/
    const mimetype = filetypes.test(file.mimetype)
    const extname = filetypes.test(
      path.extname(file.originalname).toLowerCase(),
    )
    if (mimetype && extname) {
      return cb(null, true)
    }
    cb(
      new Error(
        `Error: File upload only supports the following filetypes - ${filetypes}`,
      ),
    )
  },
})

export default upload
