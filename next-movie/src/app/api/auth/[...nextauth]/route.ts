import NextAuth, { AuthOptions } from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import FacebookProvider from "next-auth/providers/facebook"
import GithubProvider from "next-auth/providers/github"
import CredentialsProvider from "next-auth/providers/credentials"
import bcrypt from "bcryptjs"
import dbConnect from "../../../../lib/mongodb"
import User from "../../../../models/User"

export const authOptions: AuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
    FacebookProvider({
      clientId: process.env.FACEBOOK_CLIENT_ID as string,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET as string,
    }),
    GithubProvider({
      clientId: process.env.GITHUB_CLIENT_ID as string,
      clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        await dbConnect()
        const user = await User.findOne({ email: credentials?.email })
        console.log(user)
        if (!user) {
          throw new Error("Email non trouvé")
        }

        const isValid = await bcrypt.compare(credentials!.password, user.password)
        if (!isValid) {
          throw new Error("Mot de passe incorrect")
        }

        return { id: user._id, email: user.email, name: user.name }
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
  },
  callbacks: {
    // Enregistre l'utilisateur dans la base de données lors de la première connexion
    async signIn({ user, account, profile }) {
      await dbConnect()

      console.log("OAuth User:", user)      // Vérifie ce qui est renvoyé ici
      console.log("OAuth Account:", account) // Vérifie ce qui est renvoyé ici
      console.log("OAuth Profile:", profile) // Vérifie ce qui est renvoyé ici
  

      const existingUser = await User.findOne({ email: user.email })
      if (!existingUser) {
        const userr = new User({
          name: user.name,
          email: user.email,
          emailVerified: true, 
        })
        await userr.save()
      }
      return true 
    },

    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
      }
      return token
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string
      }
      return session
    },
  },
  secret: process.env.NEXTAUTH_SECRET as string,
}

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }