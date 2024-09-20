import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import User from "../../../../models/User"
import dbConnect from "../../../../lib/mongodb"
import nodemailer from "nodemailer"
import jwt from "jsonwebtoken"

export const POST = async (req: Request) => {
  await dbConnect()

  const { name, email, password } = await req.json()

  const existingUser = await User.findOne({ email })
  if (existingUser) {
    return NextResponse.json({ error: "Cet email est déjà utilisé." }, { status: 400 })
  }

  const hashedPassword = await bcrypt.hash(password, 12)
  const user = new User({
    name,
    email,
    password: hashedPassword,
    emailVerified: false,
  })
  await user.save()

  const token = jwt.sign({ userId: user._id }, process.env.EMAIL_VERIFICATION_SECRET as string, { expiresIn: "1h" })

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  })

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: user.email,
    subject: "Vérifiez votre email",
    text: `Cliquez sur le lien pour vérifier votre email : ${process.env.NEXTAUTH_URL}/api/auth/verify-email?token=${token}`,
  }

  await transporter.sendMail(mailOptions)

  return NextResponse.json({ message: "Compte créé. Vérifiez votre email pour continuer." })
}
