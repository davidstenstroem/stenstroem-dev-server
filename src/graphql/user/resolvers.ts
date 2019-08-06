import { Resolvers, AuthPayload, User } from 'graphql-types'
import { registerSchema, loginSchema } from '@stenstroem/shared'
import { formatError } from '../../utils/formatError'
import { ValidationError } from 'yup'
import { UserModel } from '../../models/user.model'
import { randomBytes, pbkdf2Sync } from 'crypto'
import { tokens } from '../../utils/tokens'
import { RequestWithUser } from '../../utils/RequestWithUser'
import { AuthenticationError } from 'apollo-server-core'

export const resolvers: Resolvers = {
  Mutation: {
    register: async (
      root,
      { input: { email, name, password } },
      { res },
      info
    ): Promise<AuthPayload> => {
      try {
        await registerSchema.validate(
          {
            name,
            email,
            password,
          },
          {
            abortEarly: false,
          }
        )
      } catch (err) {
        return {
          formErrors: formatError(err as ValidationError),
        }
      }

      const existingUser = await UserModel.findOne({ email })
      if (existingUser) {
        return {
          formErrors: [
            { message: 'Denne mailadresse er allerede i brug', path: 'email' },
          ],
        }
      }

      const salt = randomBytes(32).toString('hex')
      const hash = pbkdf2Sync(password, salt, 10000, 512, 'sha512').toString(
        'hex'
      )
      const user = new UserModel({ name, email, salt, hash })
      await user.save()

      const [accessToken, refreshToken] = tokens(
        user.id,
        user.name,
        user.email,
        user.count
      )

      res.cookie('access-token', accessToken, {
        expires: new Date(Date.now() + 2 * 60 * 60 * 1000),
      })
      res.cookie('refresh-token', refreshToken, {
        expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      })
      return {
        user,
      }
    },

    login: async (
      parent,
      { input: { email, password } },
      { res },
      info
    ): Promise<AuthPayload> => {
      try {
        await loginSchema.validate({ email, password }, { abortEarly: false })
      } catch (err) {
        return {
          formErrors: formatError(err as ValidationError),
        }
      }

      const user = await UserModel.findOne({ email })
      if (!user) {
        return {
          formErrors: [
            { message: 'Forkert mail eller kode', path: 'email' },
            { message: 'Forkert mail eller kode', path: 'password' },
          ],
        }
      }

      const hash = pbkdf2Sync(
        password,
        user.salt,
        10000,
        512,
        'sha512'
      ).toString('hex')
      if (hash !== user.hash) {
        return {
          formErrors: [
            { message: 'Forkert mail eller kode', path: 'email' },
            { message: 'Forkert mail eller kode', path: 'password' },
          ],
        }
      }

      const [accessToken, refreshToken] = tokens(
        user.id,
        user.name,
        user.email,
        user.count
      )

      res.cookie('access-token', accessToken, {
        expires: new Date(Date.now() + 2 * 60 * 60 * 1000),
      })
      res.cookie('refresh-token', refreshToken, {
        expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      })

      return { user }
    },
  },
  Query: {
    me: async (parent, args, { req }, info): Promise<User> => {
      if (!(req as RequestWithUser).userId) {
        throw new AuthenticationError('ikke logget ind')
      }
      const user = await UserModel.findById((req as RequestWithUser).userId)
      if (!user) {
        throw new Error('User not found')
      }
      return user
    },
  },
}
