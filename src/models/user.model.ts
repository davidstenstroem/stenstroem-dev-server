import { prop, Typegoose, pre } from 'typegoose'

@pre<User>('save', function(next): void {
  if (this.createdAt) {
    this.createdAt = new Date()
  }
  this.updatedAt = new Date()
  next()
})
export class User extends Typegoose {
  @prop({ default: Date.now })
  createdAt: Date

  @prop({ default: Date.now })
  updatedAt: Date

  @prop({ default: 0 })
  count: number

  @prop({ default: '' })
  email: string

  @prop({ default: '' })
  name: string

  @prop()
  salt: string

  @prop()
  hash: string
}

export const UserModel = new User().getModelForClass(User)
