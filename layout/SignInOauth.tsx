import React, { useEffect } from 'react'

import Login from '@components/Login'
import { deriveNetworkFactor } from '@helpers/networkFactor'
import {
	constructPrivateFactor,
	verifyPrivateKey,
} from '@helpers/privateFactor'
import { storeUser } from '@helpers/wallet'
import { useAppDispatch, useAppSelector } from '@store'
import * as actions from '@store/signInOauth/actions'
import { TA } from '@types'

const SignInOauth = ({ idToken, info }: { idToken: string; info: TA.Info }) => {
	const dispatch = useAppDispatch()

	const localUsersReducer = useAppSelector((state) => state.localUsersReducer)

	useEffect(() => {
		;(async () => {
			const networkFactor: TA.Factor = (await deriveNetworkFactor(
				idToken,
				info.email,
				dispatch,
				actions
			))!

			const deviceFactor: TA.Factor = localUsersReducer.data.find(
				(e) => e.info.email === info.email
			)!.deviceFactor

			await dispatch(actions.emitDeviceFactorStep1(deviceFactor.y.toString(16)))

			const privateFactor: TA.Factor = constructPrivateFactor(
				networkFactor,
				deviceFactor
			)

			await dispatch(
				actions.emitPrivateFactorStep1(privateFactor.y.toString(16))
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
						info,
					},
					dispatch
				)

				await dispatch(actions.emitVerifyStep('success'))
			}
		})()
	}, [])

	return <Login method="signInOauth" />
}

export default SignInOauth
