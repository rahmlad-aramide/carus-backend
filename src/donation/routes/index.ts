import { Router } from 'express'

import {
  createCampaign,
  deleteCampaign,
  getCampaign,
  getCampaigns,
  updateCampaign,
} from '../controllers/campaignController'
import { createContribution } from '../controllers/contributionController'
import verifyAdmin from '../../helpers/verifyAdmin'
import verifyToken from '../../helpers/verifyToken'

const router = Router()
const campaignPath = '/campaigns'
const campaignIdPath = '/campaigns/:id'

// User routes
router.get(campaignPath, verifyToken, getCampaigns)
router.get(campaignIdPath, verifyToken, getCampaign)
router.post('/contribute', verifyToken, createContribution)

// Admin routes
router.get(campaignPath, verifyAdmin, getCampaigns)
router.get(campaignIdPath, verifyAdmin, getCampaign)
router.post(campaignPath, verifyAdmin, createCampaign)
router.put(campaignIdPath, verifyAdmin, updateCampaign)
router.delete(campaignIdPath, verifyAdmin, deleteCampaign)

export default router
