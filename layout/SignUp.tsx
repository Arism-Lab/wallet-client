'use client'

import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'

import { C, F } from '@common'
import Login from '@components/Login'
import { constructDeviceFactor } from '@helpers/deviceFactor'
import { addPrivateIndex } from '@helpers/metadata'
import { deriveNetworkFactor } from '@helpers/networkFactor'
import { storeUser } from '@helpers/wallet'
import { RootState, useAppDispatch } from '@store'
import * as actions from '@store/signUp/actions'

const SignUp = ({ sessionUser }: { sessionUser: SessionUser }) => {
	const dispatch = useAppDispatch()
	const { update } = useSession()

	const [privateKey, setPrivateKey] = useState<string>('')
	const [confirm, setConfirm] = useState<boolean>(false)
	const [networkFactor, setNetworkFactor] = useState<Point | undefined>()

	const signUpReducer = useSelector((state: RootState) => state.signUpReducer)

	// Stage 1: Derive Network Factor
	useEffect(() => {
		;(async () => {
			if (
				!networkFactor &&
				signUpReducer.data.networkFactorStep1.state?.length === 0
			) {
				const networkFactor: Point = (await deriveNetworkFactor(
					sessionUser.jwt.id_token,
					sessionUser.info.email,
					dispatch,
					actions
				))!
				setNetworkFactor(networkFactor)
			}
		})()
	}, [])

	// Stage 2: Derive other Factors
	useEffect(() => {
		if (networkFactor && confirm) {
			;(async () => {
				const privateFactor: Point = {
					x: F.PRIVATE_INDEX,
					y: privateKey ?? C.generatePrivateKey(),
				}

				await dispatch(
					actions.emitPrivateFactorStep1(privateFactor.y.toString())
				)

				const deviceFactor = await constructDeviceFactor(
					privateFactor,
					networkFactor
				)

				await dispatch(actions.emitDeviceFactorStep1(deviceFactor.y.toString()))

				const lastLogin = new Date().toISOString()

				await addPrivateIndex(sessionUser.info.email, {
					address: C.getAddressFromPrivateKey(privateFactor.y),
					index: privateFactor.x,
				})

				await update({
					...sessionUser,
					factor1: networkFactor,
					factor2: deviceFactor,
				})
				await storeUser({ deviceFactor, info: sessionUser.info, lastLogin })

				await dispatch(actions.emitVerifyStep('success'))
			})()
		}
	}, [networkFactor, confirm])

	return (
		<Login
			method="signUp"
			setConfirm={setConfirm}
			setPrivateKey={setPrivateKey}
		/>
	)
}

export default SignUp
