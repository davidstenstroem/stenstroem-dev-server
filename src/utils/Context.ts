import * as express from 'express'

export interface Account {
  id: string
  name: string
  email: string
}

export interface Context {
  req: express.Request
  res: express.Response
  account?: Account
}
