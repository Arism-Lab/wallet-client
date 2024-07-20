'use client'

import { useEffect } from 'react'

import Login from '@components/Login'
import {
	constructPrivateFactor,
	verifyPrivateKey,
} from '@helpers/privateFactor'
import { deriveRecoveryFactor } from '@helpers/recoveryFactor'
import { storeUser } from '@helpers/wallet'
import { useAppDispatch } from '@store'
import * as actions from '@store/signInPassword/actions'

const SignInPassword = ({
	password,
	info,
	localUsers,
}: {
	password: string
	info: Info
	localUsers: LocalUser[]
}) => {
	const dispatch = useAppDispatch()

	useEffect(() => {
		;(async () => {
			const recoveryFactor: Point = await deriveRecoveryFactor(
				info.email,
				password
			)

			await dispatch(
				actions.emitRecoveryFactorStep1(recoveryFactor.y.toString())
			)

			const deviceFactor: Point = localUsers.find(
				(e) => e.info.email === info.email
			)!.deviceFactor

			const privateFactor: Point = constructPrivateFactor(
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

				await storeUser({ deviceFactor, info, lastLogin })

				await dispatch(actions.emitVerifyStep('success'))
			}
		})()
	}, [])

	return <Login method="signInPassword" />
}

export default SignInPassword
