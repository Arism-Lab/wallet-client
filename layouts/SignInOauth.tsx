'use client'

import { useSession } from 'next-auth/react'
import { useEffect } from 'react'

import Login from '@components/Login'
import { storeNewLogin } from '@helpers/deviceFactor'
import { deriveNetworkFactor } from '@helpers/networkFactor'
import { derivePrivateFactor } from '@helpers/privateFactor'
import { verifyUser } from '@helpers/userMetadata'
import { storeLocalUser } from '@libs/local'
import { useAppDispatch } from '@store'
import * as networkFactorActions from '@store/networkFactor/actions'
import * as signInOauthActions from '@store/signInOauth/actions'

const SignInOauth = ({ sessionUser, localUser }: { sessionUser: SessionUser; localUser: LocalUser }) => {
	const dispatch = useAppDispatch()
	const { update } = useSession()

	useEffect(() => {
		;(async () => {
			try {
				const networkFactor: Point = (await deriveNetworkFactor(
					sessionUser.jwt.id_token,
					sessionUser.info.email,
					false,
					dispatch,
					networkFactorActions
				))!

				const deviceFactor: Point = localUser.deviceFactor
				dispatch(signInOauthActions.emitStep1(deviceFactor.y))

				const privateFactor: Point = derivePrivateFactor([networkFactor, deviceFactor])
				dispatch(signInOauthActions.emitStep2(privateFactor.y))

				const verifiedUser = await verifyUser(sessionUser.info.email, privateFactor.y)
				if (verifiedUser) {
					const lastLogin = new Date().toISOString()

					await storeNewLogin(sessionUser, deviceFactor.y, lastLogin)

					const localUser: LocalUser = { info: sessionUser.info, deviceFactor, lastLogin }
					storeLocalUser(localUser)

					await update({ ...sessionUser, networkFactor, deviceFactor })
					dispatch(signInOauthActions.emitStep3('success'))
				}
			} catch (error) {}
		})()
	}, [])

	return <Login method="signInOauth" />
}

export default SignInOauth
