import { NextRequest, NextResponse } from 'next/server'

import { deserializeParams } from '@libs/api'
import * as service from '@services/metadata'

export const GET = async (req: NextRequest) => {
    const { user } = deserializeParams(req.nextUrl.searchParams)

    const res = await service.findDevices(user)

    return NextResponse.json(res)
}

export const POST = async (req: NextRequest) => {
    const { user, device } = await req.json()

    try {
        const res = await service.addDevice(user, device, req.headers.get('Authorization')!)
        return NextResponse.json(res)
    } catch {
        return NextResponse.error()
    }
}

export const PUT = async (req: NextRequest) => {
    const { user, device } = await req.json()

    try {
        const res = await service.editDevice(user, device, req.headers.get('Authorization')!)
        return NextResponse.json(res)
    } catch {
        return NextResponse.error()
    }
}

export const DELETE = async (req: NextRequest) => {
    const { user, device } = await req.json()

    try {
        const res = await service.removeDevice(user, device, req.headers.get('Authorization')!)
        return NextResponse.json(res)
    } catch {
        return NextResponse.error()
    }
}
