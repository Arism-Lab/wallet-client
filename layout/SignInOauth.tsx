'use client'

import { useSession } from 'next-auth/react'
import { useEffect } from 'react'

import Login from '@components/Login'
import { deriveNetworkFactor } from '@helpers/networkFactor'
import {
	constructPrivateFactor,
	verifyPrivateKey,
} from '@helpers/privateFactor'
import { storeUser } from '@helpers/wallet'
import { useAppDispatch } from '@store'
import { signInOauthActions as actions } from '@store/actions'

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
					actions
				))!

				const deviceFactor: Point = localUsers.find(
					(e) => e.info.email === sessionUser.info.email
				)!.deviceFactor

				await dispatch(actions.emitDeviceFactorStep1(deviceFactor.y))

				const privateFactor: Point = constructPrivateFactor(
					networkFactor,
					deviceFactor
				)

				await dispatch(actions.emitPrivateFactorStep1(privateFactor.y))

				const verifiedPrivateKey = await verifyPrivateKey(
					sessionUser.info.email,
					privateFactor.y
				)
				if (verifiedPrivateKey) {
					const lastLogin = new Date().toISOString()

					await update({
						...sessionUser,
						factor1: networkFactor,
						factor2: deviceFactor,
					})
					await storeUser({ deviceFactor, info: sessionUser.info, lastLogin })

					await dispatch(actions.emitVerifyStep('success'))
				}
			} catch (error) {}
		})()
	}, [])

	return <Login method="signInOauth" />
}

export default SignInOauth
