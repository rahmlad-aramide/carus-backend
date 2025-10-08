import { Router } from 'express'

import {
  deleteScheduleById,
  getScheduleById,
  getSchedules,
  schedulePickup,
  updatePickupSchedule,
} from '../controllers'
import verifyToken from '../../helpers/verifyToken'

const router = Router()

router.get('/', verifyToken, getSchedules)
router.get('/:id', verifyToken, getScheduleById)
router.put('/:id', verifyToken, updatePickupSchedule)
router.post('/pickup', verifyToken, schedulePickup)
router.delete('/:id', verifyToken, deleteScheduleById)

export default router
