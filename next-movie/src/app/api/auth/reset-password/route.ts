import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import User from "../../../../models/User"
import dbConnect from "../../../../lib/mongodb"

export const POST = async (req: Request) => {
  await dbConnect()
  const { token, newPassword } = await req.json()

  try {
    const { userId } = jwt.verify(token, process.env.PASSWORD_RESET_SECRET as string) as { userId: string }
    const user = await User.findById(userId)

    if (!user) {
      return NextResponse.json({ error: "Utilisateur introuvable" }, { status: 404 })
    }

    const hashedPassword = await bcrypt.hash(newPassword, 12)
    user.password = hashedPassword
    await user.save()

    return NextResponse.json({ message: "Mot de passe réinitialisé avec succès." })
  } catch (error) {
    return NextResponse.json({ error: "Lien de réinitialisation invalide ou expiré" }, { status: 400 })
  }
}
