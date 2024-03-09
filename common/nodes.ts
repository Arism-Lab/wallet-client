import { TA } from '@types'

export const NODES: TA.Node[] = [
    {
        id: 1,
        url: process.env.NEXT_PUBLIC_NODE1_URL!,
        // publicKey: '04bc38813a6873e526087918507c78fc3a61624670ee851ecfb4f3bef55d027b5aac4b21229f662a0aefdfdac21cf17c3261a392c74a8790db218b34e3e4c1d56a',
    },
    {
        id: 2,
        url: process.env.NEXT_PUBLIC_NODE2_URL!,
        // publicKey: '04b56541684ea5fa40c8337b7688d502f0e9e092098962ad344c34e94f06d293fb759a998cef79d389082f9a75061a29190eec0cac99b8c25ddcf6b58569dad55c',
    },
    {
        id: 3,
        url: process.env.NEXT_PUBLIC_NODE3_URL!,
        // publicKey: '044b5f33d7dd84ea0b7a1eb9cdefe33dbcc6822933cfa419c0112e9cbe33e84b267a7813bf1cbc2ee2c6fba506fa5de2af1601a093d93716a78ecec0e3e49f3a57',
    },
]

export const NODES_LENGTH = NODES.length

export const GENERATION_THRESHOLD = Math.floor(NODES_LENGTH / 4) * 3 + 1

export const DERIVATION_THRESHOLD = Math.floor(NODES_LENGTH / 2) + 1
