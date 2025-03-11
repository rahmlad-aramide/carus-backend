import { Router } from 'express'

import { getScheduleById, getSchedules, schedulePickup } from '../controllers'
import verifyToken from '../../helpers/verifyToken'

const router = Router()

router.post('/pickup', verifyToken, schedulePickup)
router.get('/', verifyToken, getSchedules)
router.get('/:id', verifyToken, getScheduleById)

export default router
