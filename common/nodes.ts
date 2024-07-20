const nodesProduction: ArismNode[] = [
    {
        id: 1,
        url: 'https://node1-arismlab.koyeb.app',
    },
    {
        id: 2,
        url: 'https://node2-arismlab.koyeb.app',
    },
    {
        id: 3,
        url: 'https://node3-arismlab.koyeb.app',
    },
]

const nodesDevelopment: ArismNode[] = [
    {
        id: 1,
        url: 'http://127.0.0.1:3002',
    },
    {
        id: 2,
        url: 'http://127.0.0.1:3002',
    },
    {
        id: 3,
        url: 'http://127.0.0.1:3002',
    },
]

export const NODES =
    process.env.NODE_ENV === 'production' ? nodesProduction : nodesDevelopment

export const NODES_LENGTH = NODES.length

export const GENERATION_THRESHOLD = Math.floor(NODES_LENGTH / 4) * 3 + 1

export const DERIVATION_THRESHOLD = Math.floor(NODES_LENGTH / 2) + 1
