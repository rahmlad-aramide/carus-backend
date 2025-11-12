import fs from 'fs/promises'
import multer from 'multer'
import path from 'path'

const UPLOAD_DIR = process.env.UPLOAD_DIR || 'uploads/'

const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    try {
      // Ensure the upload directory exists, create it if it doesn't
      await fs.mkdir(UPLOAD_DIR, { recursive: true })
      cb(null, UPLOAD_DIR)
    } catch (error) {
      // Handle any errors during directory creation
      cb(error as Error, '')
    }
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`
    cb(
      null,
      `${file.fieldname}-${uniqueSuffix}${path.extname(file.originalname)}`,
    )
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
