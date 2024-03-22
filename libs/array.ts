export const deepCompare = (a: any, b: any) => {
    // number or string
    if (a === b) return true

    // State
    if (a?.state?.node && b?.state?.node) {
        return a.state.node === b.state.node
    }

    // array
    if (Array.isArray(a) && Array.isArray(b)) {
        if (a.length !== b.length) return false
        for (let i = 0; i < a.length; i++) {
            if (!deepCompare(a[i], b[i])) return false
        }
        return true
    }

    // object
    if (typeof a === 'object' && typeof b === 'object') {
        if (Object.keys(a).length !== Object.keys(b).length) return false
        for (const key in a) {
            if (!deepCompare(a[key], b[key])) return false
        }
        return true
    }

    return false
}

export const append = (arr: any[], item: any): any => {
    const index = arr.findIndex((i) => deepCompare(i, item))

    if (index === -1) {
        arr.push(item)
    } else {
        arr[index] = item
    }

    return arr
}
