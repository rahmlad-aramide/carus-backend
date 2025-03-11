import { Router } from 'express'

import configurationRoutes from '../configurations/routes/adminRoutes'

const router = Router()

router.use('/configuration', configurationRoutes)

export default router
