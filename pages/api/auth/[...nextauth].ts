import { storeToken, wipeSession, wipeToken } from '@libs/storage'
import NextAuth, { Account, User } from 'next-auth'
import { AdapterUser } from 'next-auth/adapters'
import { JWT } from 'next-auth/jwt'
import GoogleProvider from 'next-auth/providers/google'

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
                token.account = account
            }
            return token
        },
        async session({ session, token }: { session: any; token: JWT }) {
            session.token = token
            return session
        },
        async signIn({ user }: { user: User | AdapterUser }) {
            return true
        },
    },
}

export default NextAuth(authOptions)
