import { NextResponse } from "next/server"
import User from "../../../../models/User"
import jwt from "jsonwebtoken"
import nodemailer from "nodemailer"
import dbConnect from "../../../../lib/mongodb"

export const POST = async (req: Request) => {
  await dbConnect()
  const { email } = await req.json()

  const user = await User.findOne({ email })
  if (!user) {
    return NextResponse.json({ error: "Utilisateur introuvable" }, { status: 404 })
  }

  const token = jwt.sign({ userId: user._id }, process.env.PASSWORD_RESET_SECRET as string, { expiresIn: "1h" })

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
    subject: "Réinitialisez votre mot de passe",
    text: `Cliquez sur le lien pour réinitialiser votre mot de passe : ${process.env.NEXTAUTH_URL}/reset-password?token=${token}`,
  }

  await transporter.sendMail(mailOptions)

  return NextResponse.json({ message: "Email envoyé." })
}
