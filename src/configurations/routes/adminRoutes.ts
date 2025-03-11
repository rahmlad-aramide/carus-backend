import { Router } from 'express'

import { createConfiguration } from '../controllers'
import verifyAdmin from '../../helpers/verifyAdmin'

const router = Router()

router.post('/', verifyAdmin, createConfiguration)

export default router
