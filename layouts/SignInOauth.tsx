'use client'

import { useSession } from 'next-auth/react'
import { useEffect } from 'react'

import Login from '@components/Login'
import { deriveNetworkFactor } from '@helpers/networkFactor'
import { constructPrivateFactor, verifyPrivateKey } from '@helpers/privateFactor'
import { storeUser } from '@helpers/wallet'
import { useAppDispatch } from '@store'
import * as networkFactorActions from '@store/networkFactor/actions'
import * as signInOauthActions from '@store/signInOauth/actions'

const SignInOauth = ({
	sessionUser,
	localUsers,
}: {
	sessionUser: SessionUser
	localUsers: LocalUser[]
}) => {
	const dispatch = useAppDispatch()
	const { update } = useSession()

	useEffect(() => {
		;(async () => {
			try {
				const networkFactor: Point = (await deriveNetworkFactor(
					sessionUser.jwt.id_token,
					sessionUser.info.email,
					dispatch,
					networkFactorActions
				))!

				const deviceFactor: Point = localUsers.find(
					(e) => e.info.email === sessionUser.info.email
				)!.deviceFactor

				await dispatch(signInOauthActions.emitStep1(deviceFactor.y))

				const privateFactor: Point = constructPrivateFactor(networkFactor, deviceFactor)

				await dispatch(signInOauthActions.emitStep2(privateFactor.y))

				const verifiedPrivateKey = await verifyPrivateKey(sessionUser.info.email, privateFactor.y)
				if (verifiedPrivateKey) {
					const lastLogin = new Date().toISOString()

					await update({
						...sessionUser,
						factor1: networkFactor,
						factor2: deviceFactor,
					})
					await storeUser({ deviceFactor, info: sessionUser.info, lastLogin })

					await dispatch(signInOauthActions.emitStep3('success'))
				}
			} catch (error) {}
		})()
	}, [])

	return <Login method="signInOauth" />
}

export default SignInOauth
