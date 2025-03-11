import { User as MyUser } from '../entities/user'

export {}

declare global {
  namespace Express {
    interface Request {
      user: MyUser
    }
  }
}
