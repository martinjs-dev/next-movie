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

        return { id: user._id, email: user.email, name: user.name, isAdmin: user.isAdmin  }
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
    async signIn({ user, account, profile }) {
      await dbConnect()

      console.log("OAuth User:", user)      
      console.log("OAuth Account:", account) 
      console.log("OAuth Profile:", profile)
  

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

    async jwt({ token, user, account, profile  }) {
      if (user) {
        const dbUser = await User.findOne({ email: user.email });
        token.id = dbUser._id;
        token.isAdmin = dbUser.isAdmin;
      }
      return token
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.isAdmin = token.isAdmin as boolean;
      }
      return session
    },
  },
  secret: process.env.NEXTAUTH_SECRET as string,
}

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }