import { Router } from 'express'

import { getConfigurations, getLocationDetails } from '../controllers'
import verifyToken from '../../helpers/verifyToken'

const router = Router()

router.get('/', verifyToken, getConfigurations)
router.get('/location', verifyToken, getLocationDetails)

export default router
