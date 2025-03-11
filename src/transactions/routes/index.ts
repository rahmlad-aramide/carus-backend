import { Router } from 'express'

import { getTransactions } from '../controllers'
import verifyToken from '../../helpers/verifyToken'

const router = Router()

router.get('/', verifyToken, getTransactions)

export default router
