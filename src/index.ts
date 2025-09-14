require('../instrument.ts')
// eslint-disable-next-line simple-import-sort/imports
import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import express from 'express'
import session from 'express-session'
import passport from 'passport'
import path from 'path'
import 'reflect-metadata'

import env from './config/environment/index'
import { AppDataSource } from './data-source'
import mainRoutes from './routes'
import adminRoutes from './routes/adminRoutes'

// eslint-disable-next-line @typescript-eslint/no-var-requires
const Sentry = require('@sentry/node')
const start = async () => {
  const app: express.Application = express()

  AppDataSource.initialize()
    .then(() => {
      console.log('Data Source Initialized')
    })
    .catch((err) => {
      console.error('Error during Data Source Initialization', err)
    })

  Sentry.setupExpressErrorHandler(app)
  app.use(cors())
  app.use(
    session({
      secret: env.SESSION_SECRET,
      resave: false,
      saveUninitialized: false,
    }),
  )
  app.use(passport.initialize())
  app.use(passport.session())
  app.use(cookieParser())
  app.use(bodyParser.json())
  app.get('/', (req, res) => res.send(`CARUS RECYCLING SERVER`))
  app.get('/debug-sentry', function mainHandler(_req, _res) {
    throw new Error('My Sentry debug error!')
  })
  app.use('/v1', mainRoutes)
  app.use('/v1/admin', adminRoutes)
  app.set('view engine', 'pug')
  app.set('views', path.join(__dirname + '../views'))
  const server = app.listen(env.PORT, () => {
    console.log(`Server is running at: http://localhost:${env.PORT}`)
  })

  server.on('listening', () => {
    const used = process.memoryUsage()
    console.log('Memory Usage:')
    console.log(`  Heap Total: ${Math.round(used.heapTotal / 1024 / 1024)} MB`)
    console.log(`  Heap Used: ${Math.round(used.heapUsed / 1024 / 1024)} MB`)
    console.log(`  RSS: ${Math.round(used.rss / 1024 / 1024)} MB`)
  })
}

start()
