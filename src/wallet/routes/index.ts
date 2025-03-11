import { Router } from 'express'

import { getWallet } from '../controllers'
import verifyToken from '../../helpers/verifyToken'

const router = Router()

router.get('/', verifyToken, getWallet)

export default router
