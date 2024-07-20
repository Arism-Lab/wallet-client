import { NextRequest, NextResponse } from 'next/server'

import { deserializeParams } from '@libs/api'
import * as service from '@services/metadata'

export const GET = async (req: NextRequest) => {
    const { user } = deserializeParams(req.nextUrl.searchParams)

    const res = await service.find(user)

    return NextResponse.json(res)
}

export const POST = async (req: NextRequest) => {
    const body = await req.json()

    try {
        const res = await service.initialize(
            body,
            req.headers.get('Authorization')!
        )
        return NextResponse.json(res)
    } catch {
        return NextResponse.error()
    }
}
