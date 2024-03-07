export const URLS: Record<string, string> = {
  1: process.env.NEXT_PUBLIC_NODE1_URL ?? 'http://dead',
  2: process.env.NEXT_PUBLIC_NODE2_URL ?? 'http://dead',
  3: process.env.NEXT_PUBLIC_NODE3_URL ?? 'http://dead',
}

export const NODES_LENGTH = 5
export const GENERATION_THRESHOLD = 4
export const RECOVERY_THRESHOLD = 3
