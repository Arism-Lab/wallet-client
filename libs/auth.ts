import {
    GetServerSidePropsContext,
    NextApiRequest,
    NextApiResponse,
} from 'next'
import {
    Account,
    AuthOptions,
    User as AuthUser,
    Profile,
    Session,
    getServerSession,
} from 'next-auth'
import { AdapterUser } from 'next-auth/adapters'
import { JWT } from 'next-auth/jwt'
import GoogleProvider from 'next-auth/providers/google'

type JWTParams = {
    token: JWT
    user: AuthUser | AdapterUser
    account: Account | null
    profile?: Profile
    trigger?: 'signIn' | 'signUp' | 'update'
    isNewUser?: boolean
    session?: any
}

type SessionParams = {
    session: Session
    token: JWT
    user: AdapterUser
    newSession: any
    trigger: 'update'
}

type SignInParams = {
    user: AuthUser | AdapterUser
    account: Account | null
    profile?: Profile
}

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
        async jwt({ token, account, trigger, session }: JWTParams) {
            if (trigger === 'update') {
                token = session
            } else if (account) {
                token.account = account
            }
            return token
        },
        async session({ session, token }: SessionParams) {
            if (token) {
                session['jwt'] = token.account
                session['info'] = session.user
                session['factor1'] = undefined
                session['factor2'] = undefined
                session['factor3'] = undefined
                delete session.user
            }
            return session
        },
        async signIn({ profile }: SignInParams) {
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
