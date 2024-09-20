import { Schema, model, models } from "mongoose"

interface IUser {
  name: string
  email: string
  password: string
  emailVerified: boolean
  isAdmin: boolean
  resetPasswordToken?: string
  resetPasswordExpires?: Date
  favMovies?: Array
}

const UserSchema = new Schema<IUser>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String },
  emailVerified: { type: Boolean, default: false },
  isAdmin: { type: Boolean, default: false },
  resetPasswordToken: { type: String },
  resetPasswordExpires: { type: Date },
  favMovies: { type: Array },
})

const User = models.User || model<IUser>("User", UserSchema)

export default User
