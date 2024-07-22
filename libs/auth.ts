import { GetServerSidePropsContext, NextApiRequest, NextApiResponse } from 'next'
import { AuthOptions, getServerSession } from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'

export const authOptions: AuthOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
            authorization: {
                params: { access_type: 'offline', prompt: 'consent' },
            },
        }),
    ],
    session: {
        strategy: 'jwt' as const,
    },
    secret: process.env.SECRET as string,
    callbacks: {
        async jwt({ token, account, trigger, session }) {
            if (trigger === 'update') {
                token = session
            } else if (account) {
                token = {
                    jwt: account,
                    info: {
                        email: token.email,
                        name: token.name,
                        image: token.picture,
                    },
                    factor1: session?.factor1,
                    factor2: session?.factor2,
                    factor3: session?.factor3,
                }
            }
            return token
        },
        async session({ session, token }) {
            if (token) {
                session['jwt'] = token.account
                session['info'] = session.user
                session['factor1'] = token?.factor1
                session['factor2'] = token?.factor2
                session['factor3'] = token?.factor3
                delete session.user
            }
            return token
        },
        async signIn() {
            return true
        },
    },
}

export const auth = (
    ...args:
        | [GetServerSidePropsContext['req'], GetServerSidePropsContext['res']]
        | [NextApiRequest, NextApiResponse]
        | []
) => {
    return getServerSession(...args, authOptions) as Promise<SessionUser | null>
}
