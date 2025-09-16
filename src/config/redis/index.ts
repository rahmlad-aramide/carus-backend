import { createClient } from 'redis'

import env from '../environment'

const redisClient = createClient({
  username: env.REDIS_USERNAME,
  password: env.REDIS_PASSWORD,
  socket: {
    host: env.REDIS_HOST,
    port: Number(env.REDIS_PORT),
  },
})

redisClient.on('connect', () => {
  console.log('Redis Client connected successfully')
})

redisClient.on('end', (err) => {
  console.log('Redis Client disconnected.\n Error: ', JSON.stringify(err))
})

redisClient.on('error', (err) => {
  console.log(`Redis client has encountered an error. `, err)
})

redisClient.on('reconnecting', () => {
  console.log('Redis Client is reconnecting')
})

export default redisClient
