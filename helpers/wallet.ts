import axios from 'axios'
import { TA } from '@types'
import { N } from '@common'

const ping = async (url: string) => {
    const response = await axios.get(url)
    return response?.data === 'pong!'
}

export const fetchNodes = async (): Promise<TA.Node[]> => {
    const nodes: TA.Node[] = []

    for (let i = 0; i < N.NODES.length; i += 1) {
        await ping(N.NODES[i].url).then((alive) => {
            if (alive) {
                nodes.push(N.NODES[i])
            }
        })
    }

    if (N.NODES.length < N.DERIVATION_THRESHOLD)
        throw new Error('Not enough Nodes')

    return nodes
}

export const getAddress = async ({
    owner,
}: TA.GetAddressRequest): Promise<TA.GetAddressResponse | undefined> => {
    const nodes = await fetchNodes()

    for (const { url } of nodes) {
        try {
            const { data } = await axios.post<TA.GetAddressResponse>(
                `${url}/wallet`,
                { owner }
            )
            return data
        } catch {}
    }
    return undefined
}
