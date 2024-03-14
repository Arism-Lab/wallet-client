import React, { useEffect, useState } from 'react'

import Login from '@components/Login'
import { constructDeviceFactorNewDevice } from '@helpers/deviceFactor'
import { deriveNetworkFactor } from '@helpers/networkFactor'
import { verifyPrivateKey } from '@helpers/privateFactor'
import { deriveRecoveryFactor } from '@helpers/recoveryFactor'
import { storeUser } from '@helpers/wallet'
import { useAppDispatch } from '@store'
import * as actions from '@store/signInOauthAndPassword/actions'
import { TA } from '@types'

const SignInOauthAndPassword = ({
	idToken,
	info,
}: {
	idToken: string
	info: TA.Info
}) => {
	const dispatch = useAppDispatch()

	const [password, setPassword] = useState<string>('')
	const [confirm, setConfirm] = useState<boolean>(false)
	const [networkFactor, setNetworkFactor] = useState<TA.Factor | undefined>()

	// Stage 1: Derive Network Factor
	useEffect(() => {
		;(async () => {
			const networkFactor: TA.Factor = (await deriveNetworkFactor(
				idToken,
				info.email,
				dispatch,
				actions
			))!
			setNetworkFactor(networkFactor)
		})()
	}, [])

	// Stage 2: Derive other Factors
	useEffect(() => {
		if (networkFactor && confirm) {
			;(async () => {
				const recoveryFactor: TA.Factor = await deriveRecoveryFactor(
					info.email,
					password
				)

				await dispatch(
					actions.emitRecoveryFactorStep1(recoveryFactor.y.toString(16))
				)

				const { privateFactor, deviceFactor } =
					await constructDeviceFactorNewDevice(recoveryFactor, networkFactor)

				await dispatch(
					actions.emitRecoveryFactorStep2([
						privateFactor.y.toString(16),
						deviceFactor.y.toString(16),
					])
				)

				const verifiedPrivateKey = await verifyPrivateKey(
					info.email,
					privateFactor.y
				)
				if (verifiedPrivateKey) {
					const lastLogin = new Date().toISOString()

					await storeUser(
						{ deviceFactor, info, lastLogin },
						{
							factor1: networkFactor,
							factor2: deviceFactor,
							factor3: recoveryFactor,
							info,
						},
						dispatch
					)

					await dispatch(actions.emitVerifyStep('success'))
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
