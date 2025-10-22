import { Router } from 'express'

import {
  createConfiguration,
  getPointToNaira,
  updateConfiguration,
} from '../controllers'
import verifyAdmin from '../../helpers/verifyAdmin'

const router = Router()

router.post('/', verifyAdmin, createConfiguration)
router.put('/:type', verifyAdmin, updateConfiguration)
router.get('/point-to-naira', verifyAdmin, getPointToNaira)

export default router
