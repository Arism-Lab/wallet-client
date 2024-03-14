import React, { useEffect, useState } from 'react'

import { BN, EC, F } from '@common'
import Login from '@components/Login'
import { constructDeviceFactor } from '@helpers/deviceFactor'
import { addKey } from '@helpers/metadata'
import { deriveNetworkFactor } from '@helpers/networkFactor'
import { storeUser } from '@helpers/wallet'
import { useAppDispatch } from '@store'
import * as actions from '@store/signUp/actions'
import { TA } from '@types'

const SignUp = ({ idToken, info }: { idToken: string; info: TA.Info }) => {
	const dispatch = useAppDispatch()

	const [privateKey, setPrivateKey] = useState<string>('')
	const [confirm, setConfirm] = useState<boolean>(false)
	const [networkFactor, setNetworkFactor] = useState<TA.Factor | undefined>()

	// Stage 1: Derive Network Factor
	useEffect(() => {
		;(async () => {
			if (!networkFactor) {
				const networkFactor: TA.Factor = (await deriveNetworkFactor(
					idToken,
					info.email,
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
				const privateFactor: TA.Factor = {
					x: F.PRIVATE_FACTOR_X,
					y: privateKey
						? BN.from(privateKey, 16)
						: BN.from(EC.generatePrivateKey(), 16),
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

				await addKey({
					user: info.email,
					key: {
						address: EC.getAddressFromPrivateKey(privateFactor.y),
						privateFactorX: privateFactor.x.toString(16),
					},
				})

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
