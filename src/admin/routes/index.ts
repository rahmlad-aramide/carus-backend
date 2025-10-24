import { Router } from 'express'

import {
  acceptSchedule,
  cancelSchedule,
  fulfillSchedule,
  getAllAccounts,
  getAllSchedules,
  getTotalWalletAmount,
  loginAdmin,
} from '../controllers'
import {
  getDonation,
  getDonations,
} from '../controllers/admin-donation.controller'
import {
  assignAdmin,
  createAdmin,
  removeAdmin,
} from '../controllers/register-admin.controller'
import verifyAdmin from '../../helpers/verifyAdmin'

const router = Router()

router.post('/login', loginAdmin)

// Admin Management Routes
router.post('/create-admin', verifyAdmin, createAdmin)
router.patch('/assign-admin/:id', verifyAdmin, assignAdmin)
router.patch('/remove-admin/:id', verifyAdmin, removeAdmin)

router.put('/schedule/accept/:id', verifyAdmin, acceptSchedule)
router.put('/schedule/cancel/:id', verifyAdmin, cancelSchedule)
router.post('/schedule/fulfill/:id', verifyAdmin, fulfillSchedule)
router.get('/schedules', verifyAdmin, getAllSchedules)
router.get('/accounts', verifyAdmin, getAllAccounts)
router.get('/total-wallet-amount', verifyAdmin, getTotalWalletAmount)
router.get('/donations', verifyAdmin, getDonations)
router.get('/donations/:id', verifyAdmin, getDonation)

export default router
