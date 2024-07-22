'use client'

import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'

import { C, F } from '@common'
import Login from '@components/Login'
import { constructDeviceFactor } from '@helpers/deviceFactor'
import { initializeUser } from '@helpers/metadata'
import { deriveNetworkFactor } from '@helpers/networkFactor'
import { auth } from '@libs/auth'
import { getDeviceInfo } from '@libs/device'
import { storeLocalUser } from '@libs/local'
import { RootState, useAppDispatch } from '@store'
import * as networkFactorActions from '@store/networkFactor/actions'
import * as signUpActions from '@store/signUp/actions'

const SignUp = ({ sessionUser }: { sessionUser: SessionUser }) => {
	const dispatch = useAppDispatch()
	const { update } = useSession()

	const [privateKey, setPrivateKey] = useState<string>('')
	const [confirm, setConfirm] = useState<boolean>(false)
	const [networkFactor, setNetworkFactor] = useState<Point | undefined>()
	const signUpSteps: SignUpSteps = useSelector((state: RootState) => state.signUpReducer).data

	// Stage 1: Derive Network Factor
	useEffect(() => {
		if (networkFactor || signUpSteps[0].state.length !== 0) return
		;(async () => {
			const factor: Point = (await deriveNetworkFactor(
				sessionUser.jwt.id_token,
				sessionUser.info.email,
				true,
				dispatch,
				networkFactorActions
			))!
			setNetworkFactor(factor)
		})()
	}, [])

	// Stage 2: Derive other Factors
	useEffect(() => {
		if (!networkFactor || !confirm) return
		;(async () => {
			const privateFactor: Point = {
				x: F.PRIVATE_INDEX,
				y: privateKey ?? C.generatePrivateKey(),
			}
			await dispatch(signUpActions.emitStep1(privateFactor.y.toString()))

			const deviceFactor = await constructDeviceFactor(privateFactor, networkFactor)
			await dispatch(signUpActions.emitStep2(deviceFactor.y.toString()))

			const lastLogin = new Date().toISOString()
			const device: Device = getDeviceInfo(lastLogin)
			const privateIndex: PrivateIndex = {
				address: C.getAddressFromPrivateKey(privateFactor.y),
				index: privateFactor.x,
			}

			const userMetadata: Metadata = {
				user: sessionUser.info.email,
				masterAddress: C.getAddressFromPrivateKey(privateFactor.y),
				masterPublicKey: C.getPublicKeyFromPrivateKey(privateFactor.y),
				devices: [device],
				privateIndices: [privateIndex],
				recoveryKey: '0',
			}
			await initializeUser(userMetadata)

			const localUser: LocalUser = {
				info: sessionUser.info,
				deviceFactor,
				lastLogin,
			}
			storeLocalUser(localUser)

			await update({ ...sessionUser, factor1: networkFactor, factor2: deviceFactor })

			await dispatch(signUpActions.emitStep3('success'))
		})()
	}, [networkFactor, confirm])

	return <Login method="signUp" setConfirm={setConfirm} setPrivateKey={setPrivateKey} />
}

export default SignUp
