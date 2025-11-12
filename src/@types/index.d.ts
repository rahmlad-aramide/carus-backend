import { User as MyUser } from '../entities/user'

export {}

declare global {
  namespace Express {
    interface Request {
      user: MyUser
    }
  }
}

declare global {
  namespace Express {
    interface Request {
      file?: Express.Multer.File
      files?:
        | Express.Multer.File[]
        | { [fieldname: string]: Express.Multer.File[] | Express.Multer.File }
    }
  }
}
