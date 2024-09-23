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
  console.log('eeeeeeeeeeeeeeeeeeeeeee')

  if (existingUser) {
    if(existingUser.emailVerified){
      console.log(existingUser.emailVerified)
      return NextResponse.json({ error: "Veuillez vérifier votre adresse mail. Cet email est déjà utilisé.", action: "Email déjà utilisé ! Renvoyer le le lien de vérification ?"  }, { status: 400 })
    }else{
      return NextResponse.json({ error: "Cet email est déjà utilisé." }, { status: 400 })
    }
    
  }

  const hashedPassword = await bcrypt.hash(password, 12)
  const user = new User({
    name,
    email,
    password: hashedPassword,
    emailVerified: false,
  })
  await user.save()

  const token = jwt.sign({ userId: user._id }, process.env.EMAIL_VERIFICATION_SECRET as string, { expiresIn: "24h" })
  console.log("Token de vérification généré:", token)

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
    subject: 'Vérification de votre e-mail - Next Movie',
    html: `<!DOCTYPE html>
  <html lang="fr">
  
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <meta http-equiv="X-UA-Compatible" content="ie=edge">
      <title>Vérification Email</title>
      <style>
          body {
              font-family: Arial, sans-serif;
              background-color: #f4f4f4;
              margin: 0;
              padding: 0;
          }
  
          .email-container {
              width: 100%;
              max-width: 600px;
              margin: 0 auto;
              background-color: #ffffff;
              border-radius: 8px;
              overflow: hidden;
          }
  
          .header {
              background-color: #5900ff;
              color: #ffffff;
              text-align: center;
              padding: 20px;
          }
  
          .header h1 {
              margin: 0;
              font-size: 28px;
          }
  
          .body-content {
              padding: 30px;
              color: #333333;
          }
  
          .body-content h2 {
              color: #5900ff;
              font-size: 24px;
          }
  
          .body-content p {
              font-size: 16px;
              line-height: 1.6;
          }
  
          .cta-button {
              display: inline-block;
              margin-top: 20px;
              padding: 12px 24px;
              background-color: #5900ff;
              color: #ffffff;
              text-decoration: none;
              font-weight: bold;
              border-radius: 5px;
          }
  
          .cta-button:hover {
              background-color: #e65c00;
          }
  
          .footer {
              background-color: #333333;
              color: #ffffff;
              text-align: center;
              padding: 20px;
              font-size: 14px;
          }
  
          .footer p {
              margin: 0;
          }
      </style>
  </head>
  
  <body>
      <div class="email-container">
          <!-- Header -->
          <div class="header">
              <h1>Next Movie</h1>
          </div>
  
          <!-- Body Content -->
          <div class="body-content">
              <h2>Vérifiez votre adresse e-mail</h2>
              <p>Bonjour,</p>
              <p>Merci de vous être inscrit à <strong>Next Movie</strong> ! Veuillez confirmer votre adresse e-mail en cliquant sur le bouton ci-dessous.</p>
              <a href="${process.env.NEXTAUTH_URL}/api/auth/verify-email?token=${token}" class="cta-button">Vérifier mon e-mail</a>
              <p>Si vous n'avez pas créé de compte, vous pouvez ignorer cet e-mail en toute sécurité.</p>
              <p>Cordialement,<br>L'équipe Next Movie</p>
          </div>
  
          <!-- Footer -->
          <div class="footer">
              <p>&copy; 2024 Next Movie. Tous droits réservés.</p>
              <p>Vous avez reçu cet e-mail car vous vous êtes inscrit sur notre site. Si ce n'était pas vous, veuillez nous contacter immédiatement.</p>
          </div>
      </div>
  </body>
  
  </html>`,
  }

  await transporter.sendMail(mailOptions)
  console.log("Email envoyé à:", user.email)

  return NextResponse.json({ message: "Compte créé. Vérifiez votre email pour continuer." })
}
