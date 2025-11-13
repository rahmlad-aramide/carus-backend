import path from 'path'
import { DataSource } from 'typeorm'

import env from './config/environment'

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: env.DB_USERNAME,
  password: String(process.env.DB_PASSWORD),
  database: process.env.DB_NAME,
  entities: [path.join(__dirname, '..', 'dist', 'src', 'entities', '*.js')],
  migrations: [
    path.join(__dirname, '..', 'dist', 'src', 'migrations', '*.js'),
  ],
  synchronize: true,
  poolSize: 10,
  ssl: {
    rejectUnauthorized: false,
  },
})
