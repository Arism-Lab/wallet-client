'use client'

import { SessionProvider } from 'next-auth/react'
import { Provider } from 'react-redux'

import { C } from '@common'
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
	const user: string = localLoginProps?.info.email ?? sessionUser?.info.email ?? ''
	const localUser: LocalUser | null = getLocalUsers().find(({ info }) => info.email === user)!
	const devicePublicKey: string | null = !localUser ? null : C.getPublicKeyFromPrivateKey(localUser.deviceFactor.y)

	const isFirstLogin: boolean = !userMetadata
	const isLocalLogin: boolean = !!localLoginProps && !!localUser
	const isVerifiedDevice: boolean = !!userMetadata?.devices?.some(({ publicKey }) => publicKey === devicePublicKey)
	const enabledMfa: boolean = userMetadata?.recoveryKey !== '0'

	const LoginProvider = ({ children }) => {
		if (isLocalLogin) {
			return <Provider store={store}>{children}</Provider>
		}

		return (
			<SessionProvider session={sessionUser as any}>
				<Provider store={store}>{children}</Provider>
			</SessionProvider>
		)
	}

	const LoginMethod = () => {
		if (isFirstLogin) {
			return <SignUp sessionUser={sessionUser!} />
		}
		if (isLocalLogin) {
			return <SignInPassword localUser={localUser} {...localLoginProps!} />
		}
		if (isVerifiedDevice) {
			return <SignInOauth sessionUser={sessionUser!} localUser={localUser} />
		}
		if (enabledMfa) {
			return <SignInOauthAndPassword sessionUser={sessionUser!} />
		} else {
			return <LostAccount />
		}
	}

	return (
		<LoginProvider>
			<LoginMethod />
		</LoginProvider>
	)
}

export default LoginIndicator
