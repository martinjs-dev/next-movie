import { NextResponse } from "next/server"
import jwt from "jsonwebtoken"
import User from "../../../../models/User"
import dbConnect from "../../../../lib/mongodb"

export const GET = async (req: Request) => {
  await dbConnect()

  const token = new URL(req.url).searchParams.get('token')

  if (!token) {
    return NextResponse.json({ error: "Token manquant" }, { status: 400 })
  }

  try {
    const { userId } = jwt.verify(token, process.env.EMAIL_VERIFICATION_SECRET as string) as { userId: string }
    const user = await User.findById(userId)
    if (!user) {
      return NextResponse.json({ error: "Utilisateur introuvable" }, { status: 404 })
    }

    user.emailVerified = true
    await user.save()

    return NextResponse.json({ message: "Email vérifié." })
  } catch (error) {
    return NextResponse.json({ error: "Lien de vérification invalide ou expiré" }, { status: 400 })
  }
}
