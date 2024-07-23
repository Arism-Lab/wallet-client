'use client'

import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'

import { C, F } from '@common'
import Login from '@components/Login'
import { deriveDeviceFactor } from '@helpers/deviceFactor'
import { deriveNetworkFactor } from '@helpers/networkFactor'
import { createNewUser } from '@helpers/userMetadata'
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

	useEffect(() => {
		if (!networkFactor || !confirm) return
		;(async () => {
			const privateFactor: Point = { x: F.PRIVATE_INDEX, y: privateKey ?? C.generatePrivateKey() }
			dispatch(signUpActions.emitStep1(privateFactor.y.toString()))

			const deviceFactor = deriveDeviceFactor([privateFactor, networkFactor])
			dispatch(signUpActions.emitStep2(deviceFactor.y.toString()))

			const lastLogin = new Date().toISOString()
			await createNewUser(sessionUser.info.email, privateFactor.y, deviceFactor.y, lastLogin)

			const localUser: LocalUser = { info: sessionUser.info, deviceFactor, lastLogin }
			storeLocalUser(localUser)

			await update({ ...sessionUser, networkFactor, deviceFactor })
			dispatch(signUpActions.emitStep3('success'))
		})()
	}, [networkFactor, confirm])

	return <Login method="signUp" setConfirm={setConfirm} setPrivateKey={setPrivateKey} />
}

export default SignUp
