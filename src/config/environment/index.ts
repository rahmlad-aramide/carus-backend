import dotenv from 'dotenv'

dotenv.config()

const env = {
  PORT: process.env.PORT,
  BASE_URL: process.env.BASE_URL,
  ENVIRONMENT: process.env.NODE_ENV,
  AUTH: {
    JWT_SECRET: process.env.JWT_SECRET,
  },
  // getDevBaseUrl() {
  //     const self = env
  //     if(self.ENVIRONMENT.development || self.ENVIRONMENT.test){
  //         self.BASE_URL = '/'
  //     }
  //     return self.BASE_URL
  // },
  DB_USERNAME: process.env.DB_USERNAME,
  SESSION_SECRET: process.env.SESSION_SECRET as string,
}

export default env
