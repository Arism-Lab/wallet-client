const nodesProduction: ArismNode[] = [
    {
        id: 1,
        url: 'https://node1-arismlab.onrender.com',
    },
    {
        id: 2,
        url: 'https://node2-arismlab.onrender.com',
    },
    {
        id: 3,
        url: 'https://node3-arismlab.onrender.com',
    },
]

const nodesDevelopment: ArismNode[] = [
    {
        id: 1,
        url: 'http://127.0.0.1:3001',
    },
    {
        id: 2,
        url: 'http://127.0.0.1:3002',
    },
    {
        id: 3,
        url: 'http://127.0.0.1:3003',
    },
]

export const NODES = process.env.NODE_ENV === 'production' ? nodesProduction : nodesDevelopment

export const NODES_LENGTH = 3

export const GENERATION_THRESHOLD = 3

export const DERIVATION_THRESHOLD = 2

// export const NODES_LENGTH = NODES.length

// export const GENERATION_THRESHOLD = Math.floor(NODES_LENGTH / 4) * 3 + 1

// export const DERIVATION_THRESHOLD = Math.floor(NODES_LENGTH / 2) + 1
