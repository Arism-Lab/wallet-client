import { Session, TokenSet } from 'next-auth'
import { getSession } from 'next-auth/react'
import { useEffect, useState } from 'react'

import Loading from '@components/Loading'
import { HomeSEO } from '@components/PageSEO'
import { getKeys, initializeUser } from '@helpers/metadata'
import { checkMfa } from '@helpers/wallet'
import LostAccount from '@layout/LostAccount'
import SignInOauth from '@layout/SignInOauth'
import SignInOauthAndPassword from '@layout/SignInOauthAndPassword'
import SignInPassword from '@layout/SignInPassword'
import SignUp from '@layout/SignUp'
import { useAppDispatch, useAppSelector } from '@store'
import { storeToken } from '@store/token/actions'
import { TA } from '@types'

const Login = ({ password }: { password: string | undefined }): JSX.Element => {
	const dispatch = useAppDispatch()

	const localUsersReducer = useAppSelector((state) => state.localUsersReducer)

	const [method, setMethod] = useState<TA.LoginMethod | undefined>()
	const [info, setInfo] = useState<TA.Info | undefined>()
	const [idToken, setIdToken] = useState<string | undefined>()

	useEffect(() => {
		;(async () => {
			const {
				token: { account: token },
				user: info,
			}: Session = (await getSession()) as Session

			setInfo(info)
			setIdToken(token.id_token!)
			dispatch(storeToken(token))

			const keys = await getKeys(info.email)
			if (keys.length > 0) {
				const verifiedDevice = localUsersReducer.data.find(
					(e) => e.info.email === info.email
				)?.deviceFactor

				if (verifiedDevice) {
					setMethod('signInOauth')
				} else {
					const mfa = await checkMfa(info.email)
					if (mfa) {
						setMethod('signInOauthAndPassword')
					} else {
						setMethod('lost')
					}
				}
			} else {
				await initializeUser(info.email)
				setMethod('signUp')
			}
		})()
	}, [])

	const LoginLayout = () => {
		switch (method) {
			case 'signInOauth':
				return <SignInOauth idToken={idToken!} info={info!} />
			case 'signInPassword':
				return <SignInPassword password={password!} info={info!} />
			case 'signInOauthAndPassword':
				return <SignInOauthAndPassword idToken={idToken!} info={info!} />
			case 'signUp':
				return <SignUp idToken={idToken!} info={info!} />
			case 'lost':
				return <LostAccount />
			default:
				return <Loading />
		}
	}

	return (
		<>
			<HomeSEO />
			<LoginLayout />
		</>
	)
}

export default Login
