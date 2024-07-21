'use client'

import { SessionProvider } from 'next-auth/react'
import { useEffect, useState } from 'react'
import { Provider } from 'react-redux'

import Loading from '@components/Loading'
import { initializeUser } from '@helpers/metadata'
import { checkMfa } from '@helpers/wallet'
import LostAccount from '@layouts/LostAccount'
import SignInOauth from '@layouts/SignInOauth'
import SignInOauthAndPassword from '@layouts/SignInOauthAndPassword'
import SignInPassword from '@layouts/SignInPassword'
import SignUp from '@layouts/SignUp'
import { getLocalUsers } from '@libs/local'
import { store } from '@store'

const LoginIndicator = ({ keys, password, sessionUser }) => {
	const localUsers: LocalUser[] = getLocalUsers()
	const [method, setMethod] = useState<LoginMethod | string>('')

	useEffect(() => {
		;(async () => {
			if (keys.length > 0) {
				const verifiedDevice = localUsers.find(
					(e) => e.info.email === sessionUser.info.email
				)?.deviceFactor

				if (verifiedDevice) setMethod('signInOauth')
				else if (await checkMfa(sessionUser.info.email)) setMethod('signInOauthAndPassword')
				else setMethod('lost')
			} else {
				await initializeUser(sessionUser.info.email)
				setMethod('signUp')
			}
		})()
	}, [])

	const LoginMethod = () => {
		switch (method) {
			case 'signInOauth':
				return <SignInOauth sessionUser={sessionUser} localUsers={localUsers} />
			case 'signInPassword':
				return (
					<SignInPassword password={password!} info={sessionUser.info} localUsers={localUsers} />
				)
			case 'signInOauthAndPassword':
				return <SignInOauthAndPassword sessionUser={sessionUser} />
			case 'signUp':
				return <SignUp sessionUser={sessionUser} />
			case 'lost':
				return <LostAccount />
			default:
				return <Loading />
		}
	}

	return (
		<SessionProvider session={sessionUser}>
			<Provider store={store}>
				<LoginMethod />
			</Provider>
		</SessionProvider>
	)
}

export default LoginIndicator
