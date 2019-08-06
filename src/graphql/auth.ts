import { RequestWithUser } from '../utils/RequestWithUser'
import { AuthenticationError } from 'apollo-server-core'
import { User, UserModel } from '../models/user.model'
import { InstanceType } from 'typegoose'

export const authenticate = async (
  req: RequestWithUser
): Promise<InstanceType<User>> => {
  if (!req.userId) {
    throw new AuthenticationError('Ikke logget ind')
  }
  const user = await UserModel.findById(req.userId)
  if (!user) {
    throw new AuthenticationError('Ikke logget ind')
  }

  return user
}
