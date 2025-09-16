import * as Sentry from '@sentry/node'

import env from './config/environment/index'
Sentry.init({
  dsn: 'https://01c7dc98a8e0749f6e417433d1d60c9b@o4510017484881920.ingest.us.sentry.io/4510017487634432',
  // Setting this option to true will send default PII data to Sentry.
  // For example, automatic IP address collection on events
  sendDefaultPii: true,
  environment: env.ENVIRONMENT,
  enableLogs: true,
})

import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import express from 'express'
import session from 'express-session'
import passport from 'passport'
import path from 'path'
import 'reflect-metadata'

import { AppDataSource } from './data-source'
import mainRoutes from './routes'
import adminRoutes from './routes/adminRoutes'

const startServer = async () => {
  const app: express.Application = express()

  AppDataSource.initialize()
    .then(() => {
      console.log('Data Source Initialized')
    })
    .catch((err) => {
      console.error('Error during Data Source Initialization', err)
      throw err
    })

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
  app.get('/', (_req, res) => res.send(`CARUS RECYCLING SERVER`))
  app.get('/debug-sentry', function mainHandler(_req, _res) {
    throw new Error("Test Sentry error! It's nothing to worry about!")
  })

  app.use('/v1', mainRoutes)
  app.use('/v1/admin', adminRoutes)
  app.set('view engine', 'pug')
  app.set('views', path.join(__dirname + '../views'))
  const server = app.listen(env.PORT, () => {
    console.log(`Server is running at: http://localhost:${env.PORT}`)
  })

  Sentry.setupExpressErrorHandler(app)

  server.on('listening', () => {
    const used = process.memoryUsage()
    console.log('Memory Usage:')
    console.log(`  Heap Total: ${Math.round(used.heapTotal / 1024 / 1024)} MB`)
    console.log(`  Heap Used: ${Math.round(used.heapUsed / 1024 / 1024)} MB`)
    console.log(`  RSS: ${Math.round(used.rss / 1024 / 1024)} MB`)
  })
}

startServer()
