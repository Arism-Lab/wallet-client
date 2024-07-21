'use client'

import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'

import Login from '@components/Login'
import { constructDeviceFactorNewDevice } from '@helpers/deviceFactor'
import { deriveNetworkFactor } from '@helpers/networkFactor'
import { verifyPrivateKey } from '@helpers/privateFactor'
import { deriveRecoveryFactor } from '@helpers/recoveryFactor'
import { storeUser } from '@helpers/wallet'
import { useAppDispatch } from '@store'
import * as networkFactorActions from '@store/networkFactor/actions'
import * as signInOauthAndPasswordActions from '@store/signInOauthAndPassword/actions'

const SignInOauthAndPassword = ({
	sessionUser,
}: {
	sessionUser: SessionUser
}) => {
	const dispatch = useAppDispatch()
	const { update } = useSession()

	const [password, setPassword] = useState<string>('')
	const [confirm, setConfirm] = useState<boolean>(false)
	const [networkFactor, setNetworkFactor] = useState<Point | undefined>()

	// Stage 1: Derive Network Factor
	useEffect(() => {
		;(async () => {
			const networkFactor: Point = (await deriveNetworkFactor(
				sessionUser.jwt.id_token,
				sessionUser.info.email,
				dispatch,
				networkFactorActions
			))!
			setNetworkFactor(networkFactor)
		})()
	}, [])

	// Stage 2: Derive other Factors
	useEffect(() => {
		if (networkFactor && confirm) {
			;(async () => {
				const recoveryFactor: Point = await deriveRecoveryFactor(
					sessionUser.info.email,
					password
				)

				await dispatch(
					signInOauthAndPasswordActions.emitStep1(recoveryFactor.y)
				)

				const { privateFactor, deviceFactor } =
					await constructDeviceFactorNewDevice(recoveryFactor, networkFactor)

				await dispatch(
					signInOauthAndPasswordActions.emitStep2([
						privateFactor.y,
						deviceFactor.y,
					])
				)

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
						factor3: recoveryFactor,
					})
					await storeUser({ deviceFactor, info: sessionUser.info, lastLogin })

					await dispatch(signInOauthAndPasswordActions.emitStep3('success'))
				}
			})()
		}
	}, [confirm])

	return (
		<Login
			method="signInOauthAndPassword"
			setConfirm={setConfirm}
			setPassword={setPassword}
		/>
	)
}

export default SignInOauthAndPassword
