import { Router } from 'express'

import {
  acceptSchedule,
  cancelSchedule,
  fulfillSchedule,
  getAllAccounts,
  getAllSchedules,
  getTotalWalletAmount,
  loginAdmin,
  getDashboardData,
  getAllTransactions,
} from '../controllers'
import {
  getDonation,
  getDonations,
} from '../controllers/adminDonationController'
import {
  createAdmin,
  assignAdmin,
  removeAdmin,
  adminForgotPassword,
  adminResetPassword,
  viewComplaints,
  toggleUserStatus,
} from '../controllers/adminManagementController'
import verifyAdmin from '../../helpers/verifyAdmin'

const router = Router()

router.post('/login', loginAdmin)

router.get('/dashboard', verifyAdmin, getDashboardData)

// Admin Management Routes
router.post('/create-admin', verifyAdmin, createAdmin)
router.patch('/assign-admin/:id', verifyAdmin, assignAdmin)
router.patch('/remove-admin/:id', verifyAdmin, removeAdmin)
router.patch('/toggle-user-status/:id', verifyAdmin, toggleUserStatus)

// Password Reset Routes
router.post('/forgot-password', adminForgotPassword)
router.post('/reset-password/:token', adminResetPassword)

router.put('/schedule/accept/:id', verifyAdmin, acceptSchedule)
router.put('/schedule/cancel/:id', verifyAdmin, cancelSchedule)
router.post('/schedule/fulfill/:id', verifyAdmin, fulfillSchedule)
router.get('/schedules', verifyAdmin, getAllSchedules)
router.get('/accounts', verifyAdmin, getAllAccounts)
router.get('/total-wallet-amount', verifyAdmin, getTotalWalletAmount)
router.get('/donations', verifyAdmin, getDonations)
router.get('/donations/:id', verifyAdmin, getDonation)
router.get('/complaints', verifyAdmin, viewComplaints)
router.get('/transactions', verifyAdmin, getAllTransactions)

export default router
