'use client'

import { SessionProvider } from 'next-auth/react'
import { Provider } from 'react-redux'

import LostAccount from '@layouts/LostAccount'
import SignInOauth from '@layouts/SignInOauth'
import SignInOauthAndPassword from '@layouts/SignInOauthAndPassword'
import SignInPassword from '@layouts/SignInPassword'
import SignUp from '@layouts/SignUp'
import { getLocalUsers } from '@libs/local'
import { store } from '@store'

interface LoginIndicatorProps {
	userMetadata: Metadata | null
	sessionUser: SessionUser | null
	localLoginProps: { info: Info; password: string } | null
}
const LoginIndicator = ({ userMetadata, sessionUser, localLoginProps }: LoginIndicatorProps) => {
	const localUsers: LocalUser[] = getLocalUsers()

	const isFirstLogin: boolean = userMetadata === null
	const isLocalLogin: boolean = localLoginProps !== null
	const isRemoteLogin: boolean = sessionUser !== null
	const isVerifiedDevice: boolean =
		localUsers.find((e) => e.info.email === sessionUser?.info.email)?.deviceFactor !== undefined
	const enabledMfa: boolean = userMetadata?.recoveryKey !== '0'

	const LoginMethod = () => {
		if (isFirstLogin) {
			return <SignUp sessionUser={sessionUser!} />
		}
		if (isLocalLogin) {
			return <SignInPassword localUsers={localUsers} {...localLoginProps!} />
		}
		if (isVerifiedDevice) {
			return <SignInOauth sessionUser={sessionUser!} localUsers={localUsers} />
		}
		if (enabledMfa) {
			return <SignInOauthAndPassword sessionUser={sessionUser!} />
		}
		return <LostAccount />
	}

	const LoginProvider = ({ children }) => {
		if (isLocalLogin) {
			return <Provider store={store}>{children}</Provider>
		}

		return (
			<SessionProvider session={sessionUser}>
				<Provider store={store}>{children}</Provider>
			</SessionProvider>
		)
	}

	return (
		<LoginProvider>
			<LoginMethod />
		</LoginProvider>
	)
}

export default LoginIndicator
