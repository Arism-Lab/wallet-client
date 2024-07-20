export const getLocalUsers = (): LocalUser[] => {
    try {
        return JSON.parse(window.localStorage.getItem('localUsers')!).sort(
            (a: LocalUser, b: LocalUser) =>
                new Date(b.lastLogin).getTime() -
                new Date(a.lastLogin).getTime()
        )
    } catch {
        return []
    }
}

export const storeLocalUser = (localUser: LocalUser): void => {
    const localUsers: LocalUser[] = getLocalUsers()

    const index = localUsers.findIndex(
        (e) => e.info.email === localUser.info.email
    )

    if (index !== -1) localUsers[index] = localUser
    else localUsers.push(localUser)

    window.localStorage.setItem('localUsers', JSON.stringify(localUsers))
}

export const storeLocalUsers = (localUsers: LocalUser[]): void => {
    window.localStorage.setItem('localUsers', JSON.stringify(localUsers))
}

export const removeLocalUser = (email: string): void => {
    const localUsers: LocalUser[] = getLocalUsers()

    const index = localUsers.findIndex((m) => m.info.email === email)

    localUsers.splice(index, 1)

    window.localStorage.setItem('localUsers', JSON.stringify(localUsers))
}
