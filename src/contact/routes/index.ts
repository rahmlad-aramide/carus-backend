import { Router } from 'express'

import { contactEmailController } from '../controllers'
import verifyToken from '../../helpers/verifyToken'

const router = Router()

router.post('/', verifyToken, contactEmailController)

export default router
