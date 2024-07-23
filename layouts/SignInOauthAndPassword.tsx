'use client'

import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'

import Login from '@components/Login'
import { constructDeviceFactor, storeNewDevice } from '@helpers/deviceFactor'
import { deriveNetworkFactor } from '@helpers/networkFactor'
import { deriveRecoveryFactor } from '@helpers/recoveryFactor'
import { verifyUser } from '@helpers/userMetadata'
import { storeLocalUser } from '@libs/local'
import { useAppDispatch } from '@store'
import * as networkFactorActions from '@store/networkFactor/actions'
import * as signInOauthAndPasswordActions from '@store/signInOauthAndPassword/actions'

const SignInOauthAndPassword = ({ sessionUser }: { sessionUser: SessionUser }) => {
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
				false,
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
				const recoveryFactor: Point | null = (await deriveRecoveryFactor(sessionUser.info.email, password))!
				dispatch(signInOauthAndPasswordActions.emitStep1(recoveryFactor.y))

				const { privateFactor, deviceFactor } = constructDeviceFactor([recoveryFactor, networkFactor])
				dispatch(signInOauthAndPasswordActions.emitStep2([privateFactor.y, deviceFactor.y]))

				const verifiedUser = await verifyUser(sessionUser.info.email, privateFactor.y)
				if (verifiedUser) {
					const lastLogin = new Date().toISOString()

					await storeNewDevice(sessionUser, deviceFactor.y, lastLogin)

					const localUser: LocalUser = {
						info: sessionUser.info,
						deviceFactor,
						lastLogin: new Date().toISOString(),
					}
					storeLocalUser(localUser)

					await update({ ...sessionUser, networkFactor, deviceFactor, recoveryFactor })
					dispatch(signInOauthAndPasswordActions.emitStep3('success'))
				}
			})()
		}
	}, [confirm])

	return <Login method="signInOauthAndPassword" setConfirm={setConfirm} setPassword={setPassword} />
}

export default SignInOauthAndPassword
