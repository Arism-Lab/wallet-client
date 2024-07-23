import { GetServerSidePropsContext, NextApiRequest, NextApiResponse } from 'next'
import { NextRequest } from 'next/server'
import { AuthOptions, getServerSession } from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'

export const authOptions = (req: any): AuthOptions => {
    const login_hint = req?.query?.login_hint ?? ''
    const googleAuthParams = login_hint === '' ? { prompt: 'consent' } : { prompt: 'none', login_hint }

    return {
        providers: [
            GoogleProvider({
                clientId: process.env.GOOGLE_CLIENT_ID as string,
                clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
                authorization: {
                    params: { access_type: 'offline', ...googleAuthParams },
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
                        networkFactor: session?.networkFactor,
                        deviceFactor: session?.deviceFactor,
                        recoveryFactor: session?.recoveryFactor,
                    }
                }
                return token
            },
            async session({ session, token }) {
                if (token) {
                    session['jwt'] = token.account
                    session['info'] = session.user
                    session['networkFactor'] = token?.networkFactor
                    session['deviceFactor'] = token?.deviceFactor
                    session['recoveryFactor'] = token?.recoveryFactor
                    delete session.user
                }
                return token as any
            },
            async signIn() {
                return true
            },
        },
    }
}

export const auth = (
    ...args:
        | [GetServerSidePropsContext['req'], GetServerSidePropsContext['res']]
        | [NextApiRequest, NextApiResponse]
        | []
) => {
    return getServerSession(...args, authOptions({})) as Promise<SessionUser | null>
}
