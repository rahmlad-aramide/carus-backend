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
} from '../controllers/adminDonationController'
import verifyAdmin from '../../helpers/verifyAdmin'

const router = Router()

router.post('/login', loginAdmin)
router.put('/schedule/accept/:id', verifyAdmin, acceptSchedule)
router.put('/schedule/cancel/:id', verifyAdmin, cancelSchedule)
router.post('/schedule/fulfill/:id', verifyAdmin, fulfillSchedule)
router.get('/schedules', verifyAdmin, getAllSchedules)
router.get('/accounts', verifyAdmin, getAllAccounts)
router.get('/total-wallet-amount', verifyAdmin, getTotalWalletAmount)
router.get('/donations', verifyAdmin, getDonations)
router.get('/donations/:id', verifyAdmin, getDonation)

export default router
