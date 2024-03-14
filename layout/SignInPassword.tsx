import React, { useEffect } from 'react'

import Login from '@components/Login'
import {
	constructPrivateFactor,
	verifyPrivateKey,
} from '@helpers/privateFactor'
import { deriveRecoveryFactor } from '@helpers/recoveryFactor'
import { storeUser } from '@helpers/wallet'
import { useAppDispatch, useAppSelector } from '@store'
import * as actions from '@store/signInPassword/actions'
import { TA } from '@types'

const SignInPassword = ({
	password,
	info,
}: {
	password: string
	info: TA.Info
}) => {
	const dispatch = useAppDispatch()

	const localUsersReducer = useAppSelector((state) => state.localUsersReducer)

	useEffect(() => {
		;(async () => {
			const recoveryFactor: TA.Factor = await deriveRecoveryFactor(
				info.email,
				password
			)

			await dispatch(
				actions.emitRecoveryFactorStep1(recoveryFactor.y.toString())
			)

			const deviceFactor: TA.Factor = localUsersReducer.data.find(
				(e) => e.info.email === info.email
			)!.deviceFactor

			const privateFactor: TA.Factor = constructPrivateFactor(
				recoveryFactor,
				deviceFactor
			)
			await dispatch(
				actions.emitRecoveryFactorStep2([
					privateFactor.y.toString(),
					deviceFactor.y.toString(),
				])
			)

			const verified = await verifyPrivateKey(info.email, privateFactor.y)
			if (verified) {
				const lastLogin = new Date().toISOString()

				storeUser(
					{ deviceFactor, info, lastLogin },
					{ factor1: deviceFactor, factor2: recoveryFactor, info },
					dispatch
				)

				await dispatch(actions.emitVerifyStep('success'))
			}
		})()
	}, [])

	return <Login method="signInPassword" />
}

export default SignInPassword
