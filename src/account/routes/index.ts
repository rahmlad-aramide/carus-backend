import { Router } from 'express'

import {
  changePassword,
  editProfile,
  getAccount,
  lodgeComplaint,
} from '../controllers'
import verifyToken from '../../helpers/verifyToken'
import upload from '../../utils/multer'

const router = Router()

router.get('/', verifyToken, getAccount)
router.put('/edit', verifyToken, upload.single('avatar'), editProfile)
router.put('/change-password', verifyToken, changePassword)
router.post('/lodge-complaint', verifyToken, lodgeComplaint)
// router.put('/edit/address', verifyToken, editAddress)

export default router
