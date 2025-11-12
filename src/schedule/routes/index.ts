import { Router } from 'express'

import {
  deleteScheduleById,
  getScheduleById,
  getSchedules,
  schedulePickup,
  updatePickupSchedule,
} from '../controllers'
import verifyToken from '../../helpers/verifyToken'
import upload from '../../utils/multer'

const router = Router()

router.get('/', verifyToken, getSchedules)
router.get('/:id', verifyToken, getScheduleById)
router.put('/:id', verifyToken, updatePickupSchedule)
router.post('/pickup', verifyToken, upload.single('image'), schedulePickup)
router.delete('/:id', verifyToken, deleteScheduleById)

export default router
