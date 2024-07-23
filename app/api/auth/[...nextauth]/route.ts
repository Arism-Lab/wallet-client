import { NextRequest, NextResponse } from 'next/server'
import NextAuth from 'next-auth/next'

import { authOptions } from '@libs/auth'

const auth = (req, res) => {
    return NextAuth(req, res, authOptions(req))
}

export { auth as GET, auth as POST }
