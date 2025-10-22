import { Router } from 'express'

import { createConfiguration, updatePointToNaira } from '../controllers'
import verifyAdmin from '../../helpers/verifyAdmin'

const router = Router()

router.post('/', verifyAdmin, createConfiguration)
router.put('/point-to-naira', verifyAdmin, updatePointToNaira)

export default router
