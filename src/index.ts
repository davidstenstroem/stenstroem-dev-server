import { config } from './config'
import mongoose from 'mongoose'
import { genSchema } from './utils/genSchema'
import { ApolloServer } from 'apollo-server-express'
import { Context } from './utils/Context'
import express from 'express'
import cors from 'cors'
import morgan from 'morgan'
import cookieParser from 'cookie-parser'
import { RequestWithUser } from './utils/RequestWithUser'
import { verify } from 'jsonwebtoken'
import { AccessTokenData, RefreshTokenData, tokens } from './utils/tokens'
import { UserModel } from './models/user.model'
import { createServer } from 'http'

const {
  port,
  refreshTokenSecret,
  dbConnectionString,
  dbName,
  accessTokenSecret,
} = config

const start = async (): Promise<void> => {
  await mongoose.connect(dbConnectionString, {
    dbName,
    useCreateIndex: true,
    useNewUrlParser: true,
  })

  const schema = genSchema()

  const server = new ApolloServer({
    schema,
    playground: true,
    introspection: true,
    context: ({ req, res }): Context => ({
      req,
      res,
    }),
  })

  const whiteList: string[] = ['http://localhost:8080']

  const app = express()
  app.disable('x-powered-by')
  app.use(
    cors({
      credentials: true,
      origin: whiteList,
    })
  )

  app.use(morgan('dev'))
  app.use(cookieParser())

  app.use(
    async (req: RequestWithUser, res, next): Promise<void> => {
      if (!req.cookies['access-token'] && !req.cookies['refresh-token']) {
        return next()
      }

      const accessTokenCookie = req.cookies['access-token'] as string
      const refreshTokenCookie = req.cookies['refresh-token'] as string

      try {
        const data = verify(
          accessTokenCookie,
          accessTokenSecret
        ) as AccessTokenData
        req.userId = data.id
        return next()
      } catch {}

      if (!refreshTokenCookie) {
        return next()
      }

      let data

      try {
        data = verify(
          refreshTokenCookie,
          refreshTokenSecret
        ) as RefreshTokenData
      } catch {
        return next()
      }

      const user = await UserModel.findById(data.id)
      if (!user || user.count !== data.count) {
        return next()
      }

      const [accessToken, refreshToken] = tokens(
        user.id,
        user.name,
        user.email,
        user.count
      )

      res.cookie('refresh-token', refreshToken, {
        maxAge: 30 * 24 * 60 * 60 * 1000,
      })
      res.cookie('access-token', accessToken, { maxAge: 2 * 60 * 60 * 1000 })
      req.userId = user.id

      return next()
    }
  )

  server.applyMiddleware({
    app,
    cors: { credentials: true, origin: whiteList },
  })

  const httpServer = createServer(app)
  server.installSubscriptionHandlers(httpServer)

  await httpServer.listen(
    { port },
    (): void => {
      console.log(
        `Server running @ http:localhost:${port}${server.graphqlPath}`
      )
    }
  )
}

start().catch(
  (err): void => {
    console.log('Error!\n', err)
  }
)
