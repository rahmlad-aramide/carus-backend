import { Router } from 'express'

import { changePassword, editProfile, getAccount } from '../controllers'
import verifyToken from '../../helpers/verifyToken'

const router = Router()

router.get('/', verifyToken, getAccount)
router.put('/edit', verifyToken, editProfile)
router.put('/change-password', verifyToken, changePassword)
// router.put('/edit/address', verifyToken, editAddress)

export default router
