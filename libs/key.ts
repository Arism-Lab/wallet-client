export const formatKey = (key: string) => {
    return key.slice(0, 13) + '...' + key.slice(-10)
}
