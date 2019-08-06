import { sign } from 'jsonwebtoken'
import { config } from '../config'

const { accessTokenSecret, refreshTokenSecret } = config

interface TokenData {
  id: string
  iat: number
  exp: number
}

export interface AccessTokenData extends TokenData {
  name: string
  email: string
}

export interface RefreshTokenData extends TokenData {
  count: number
}

export const tokens = (
  id: string,
  name: string,
  email: string,
  count: number
): string[] => {
  const accessToken = sign({ id, name, email }, accessTokenSecret, {
    expiresIn: '2h',
  })
  const refreshToken = sign({ id, count }, refreshTokenSecret, {
    expiresIn: '30d',
  })

  return [accessToken, refreshToken]
}
