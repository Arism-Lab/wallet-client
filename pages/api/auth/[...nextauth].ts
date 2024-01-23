import NextAuth, { Account, User } from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import { JWT } from 'next-auth/jwt'
import { AdapterUser } from 'next-auth/adapters'

const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    }),
  ],
  session: {
    strategy: 'jwt' as const,
  },
  secret: process.env.SECRET,
  callbacks: {
    async jwt({ token, account }: { token: JWT; account: Account | null }) {
      if (account) {
        token.accessToken = account.access_token
        token.idToken = account.id_token
      }
      return token
    },
    async session({ session, token }: { session: any; token: JWT }) {
      session.token = token

      return session
    },
    async signIn({ user }: { user: User | AdapterUser }) {
      // await connectDB();
      // console.log("connected", user);
      // const u = await User.findOne({ email: user.email });
      // console.log("found", u);
      // const email = user.email;
      // const name = user.name;
      // if (!u) {
      // 	const newUser = new User({
      // 		email,
      // 		profile: {
      // 			firstName: name,
      // 		},
      // 	});
      // 	await newUser.save();
      // }
      return true
    },
  },
}

export default NextAuth(authOptions)
