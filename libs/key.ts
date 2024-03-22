export const formatKey = (key: string, long: boolean) => {
    if (long) {
        if (key.length > 100) {
            return key.slice(0, 35) + '...' + key.slice(-20)
        } else {
            return key
        }
    }
    if (key.length > 25) {
        return key.slice(0, 10) + '...' + key.slice(-8)
    }
    return key
}

export const validPrivateKey = (key: string) => {
    return key.length === 64
}
