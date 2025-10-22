import { Router } from 'express'

import { redeemForAirtime, redeemForCash } from '../controllers'
import verifyToken from '../../helpers/verifyToken'

const router = Router()

router.post('/airtime', verifyToken, redeemForAirtime)
router.post('/cash', verifyToken, redeemForCash)

export default router
