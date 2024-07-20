import { getSession } from 'next-auth/react'

import siteMetadata from '@data/siteMetadata.json'

const TOKEN_INFO_GOOGLE_API = 'https://www.googleapis.com/oauth2/v3/tokeninfo'
const TOKEN_GOOGLE_API = 'https://oauth2.googleapis.com/token'
const BASE_URL =
    process.env.NODE_ENV === 'development'
        ? 'http://localhost:3000/api'
        : siteMetadata.siteUrl + '/api'

export const serializeParams = (params: any): string => {
    const searchParams = new URLSearchParams()
    for (const key in params) {
        searchParams.append(key, params[key])
    }
    return searchParams.toString()
}

export const deserializeParams = (
    searchParams: URLSearchParams
): Record<string, string> => {
    const params: Record<string, string> = {}
    const entries: [string, string][] = Array.from(searchParams.entries())
    for (const [key, value] of entries) {
        params[key] = value
    }
    return params
}

export const makeUrl = (url: string, params?: Record<string, string>) => {
    return params ? url + '?' + serializeParams(params) : url
}

export const fetcher = async <T>(
    method: string,
    url: string,
    params?: Record<string, any> | undefined,
    auth?: boolean | undefined
): Promise<T> => {
    const headers = { 'Content-Type': 'application/json' }
    if (auth) {
        const id_token = await deriveIdToken()
        headers['Authorization'] = 'Bearer ' + id_token
    }

    const options = { method, headers }

    if (method === 'GET') {
        options['next'] = { revalidate: 0 }
        url = makeUrl(url, params)
    } else {
        options['body'] = JSON.stringify(params)
    }

    const res = await fetch(url, options)

    const contentType = res.headers.get('content-type')
    const isJson = contentType && contentType.includes('application/json')
    const deserialized = isJson ? await res.json() : await res.text()

    return deserialized as T
}

export const verify = async (
    auth: string | null,
    email: string
): Promise<boolean> => {
    const res = await fetcher<any>(
        'GET',
        makeUrl(TOKEN_INFO_GOOGLE_API, {
            id_token: auth!.replace('Bearer ', ''),
        }),
        undefined,
        false
    )

    return res.email === email
}

export const deriveIdToken = async (): Promise<string> => {
    const jwt: JWT = await getSession().then((res: any) => res!.jwt)

    if (jwt && Date.now() < jwt.expires_at * 1000) {
        return jwt.id_token
    } else {
        const newJwt = await fetcher<any>(
            'POST',
            url(TOKEN_GOOGLE_API, {
                client_id: process.env.GOOGLE_CLIENT_ID!,
                client_secret: process.env.GOOGLE_CLIENT_SECRET!,
                grant_type: 'refresh_token',
                refresh_token: jwt.refresh_token,
            })
        )
        return newJwt.id_token
    }
}

export const GET = async <T>(
    path: string,
    params?: Record<string, any>,
    auth?: boolean
): Promise<T> => {
    return fetcher<T>('GET', `${BASE_URL}${path}`, params, auth)
}

export const POST = async <T>(
    path: string,
    params?: Record<string, any>,
    auth?: boolean
): Promise<T> => {
    return fetcher<T>('POST', `${BASE_URL}${path}`, params, auth)
}

export const PUT = async <T>(
    path: string,
    params?: Record<string, any>,
    auth?: boolean
): Promise<T> => {
    return fetcher<T>('PUT', `${BASE_URL}${path}`, params, auth)
}

export const DELETE = async <T>(
    path: string,
    params?: Record<string, any>,
    auth?: boolean
): Promise<T> => {
    return fetcher<T>('DELETE', `${BASE_URL}${path}`, params, auth)
}
