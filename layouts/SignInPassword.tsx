'use client'

import { useEffect } from 'react'

import Login from '@components/Login'
import { derivePrivateFactor } from '@helpers/privateFactor'
import { deriveRecoveryFactor } from '@helpers/recoveryFactor'
import { verifyUser } from '@helpers/userMetadata'
import { storeLocalUser } from '@libs/local'
import { useAppDispatch } from '@store'
import * as signInPassword from '@store/signInPassword/actions'

const SignInPassword = ({ password, info, localUser }: { password: string; info: Info; localUser: LocalUser }) => {
	const dispatch = useAppDispatch()

	useEffect(() => {
		;(async () => {
			const recoveryFactor: Point = (await deriveRecoveryFactor(info.email, password))!
			dispatch(signInPassword.emitStep1(recoveryFactor.y.toString()))

			const deviceFactor: Point = localUser.deviceFactor
			const privateFactor: Point = derivePrivateFactor([recoveryFactor, deviceFactor])
			dispatch(signInPassword.emitStep2([privateFactor.y.toString(), deviceFactor.y.toString()]))

			const verifiedUser = await verifyUser(info.email, privateFactor.y)
			if (verifiedUser) {
				const lastLogin = new Date().toISOString()
				const localUser: LocalUser = { info, deviceFactor, lastLogin }
				storeLocalUser(localUser)
				dispatch(signInPassword.emitStep3('success'))
			}
		})()
	}, [])

	return <Login method="signInPassword" />
}

export default SignInPassword
