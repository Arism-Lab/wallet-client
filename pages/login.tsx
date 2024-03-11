import { getSession, useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'
import { MdOutlineKeyboardDoubleArrowRight } from 'react-icons/md'
import { useRouter } from 'next/router'
import { Session } from 'next-auth'
import { HomeSEO } from '@components/PageSEO'
import TransitionWrapper from '@components/TransitionWrapper'
import Loading from '@components/Loading'
import StepBar from '@components/StepBar'
import { deriveNetworkFactor } from '@helpers/networkFactor'
import { TA } from '@types'
import {
	deriveWallet,
	storeMetadata,
	storeToken,
	storeWallet,
} from '@libs/storage'
import {
	constructDeviceFactor,
	deriveDeviceFactor,
} from '@helpers/deviceFactor'
import {
	constructPrivateFactor,
	verifyPrivateKey,
} from '@helpers/privateFactor'
import {
	getAddressFromPrivateKey,
	getPublicKeyFromPrivateKey,
} from '@common/secp256k1'

const STEPS = [
	'Checking',
	'Making commitments',
	'Making share proofs',
	'Decrypting shares',
	'Reconstructing private key',
	'Finished',
]
const FINAL_STEP = STEPS.length - 1

const Login = (): JSX.Element => {
	const [loading, setLoading] = useState<boolean>(true)
	const [step, setStep] = useState<number>(0)
	const router = useRouter()

	useEffect(() => {
		;(async () => {
			const {
				token: { account },
				user,
			}: Session = (await getSession()) as Session
			storeToken(account)

			const wallet = deriveWallet()
			if (wallet) {
				setStep(FINAL_STEP)
				return
			}

			setLoading(false)

			const networkFactor: TA.Factor = (await deriveNetworkFactor(
				{
					idToken: account.id_token!,
					user: user.email,
				},
				setStep
			)) as TA.Factor

			let privateFactor: TA.Factor | undefined = undefined
			let deviceFactor: TA.Factor | undefined = deriveDeviceFactor(user.email)
			if (!deviceFactor) {
				const factors = await constructDeviceFactor({
					networkFactor,
					user: user.email,
				})
				privateFactor = factors.privateFactor
				deviceFactor = factors.deviceFactor
			} else {
				privateFactor = constructPrivateFactor(networkFactor, deviceFactor)
			}

			const publicKey = getPublicKeyFromPrivateKey(privateFactor.y)
			const address = getAddressFromPrivateKey(privateFactor.y)
			const privateKey = privateFactor.y.toString(16, 64)
			const lastLogin = new Date().toISOString()

			const verify = verifyPrivateKey(user.email, privateFactor.y)
			console.log({
				networkFactor: networkFactor.y.toString(16, 64),
			})

			storeWallet({ address, publicKey, privateKey, networkFactor, user })
			storeMetadata({ deviceFactor, user, address, lastLogin })
		})()
	}, [])

	const navigateToDashboard = () => {
		router.push('/dashboard')
	}

	if (loading) {
		return (
			<TransitionWrapper router={router}>
				<Loading />
			</TransitionWrapper>
		)
	}

	return (
		<>
			<HomeSEO />
			<main className="bg-global relative flex h-screen w-screen">
				<div className="mx-auto my-auto grid w-full place-items-center gap-20">
					{step === FINAL_STEP ? (
						<h1 className="text-6xl font-extralight leading-snug text-primary-800">
							You are all set!
						</h1>
					) : (
						<h1 className="text-6xl font-extralight leading-snug text-gray-800">
							Logging in...
						</h1>
					)}
					<StepBar
						currentStep={step}
						totalSteps={STEPS}
						trigger={navigateToDashboard}
					/>
				</div>
				{step === FINAL_STEP && (
					<button
						className="group absolute inset-y-0 right-0 z-10 flex h-full w-1/3 bg-opacity-0 hover:bg-gradient-to-r hover:from-transparent hover:to-primary-200"
						onClick={navigateToDashboard}
					>
						<p className="my-auto mr-5 hidden w-full text-right text-3xl font-light text-white group-hover:block">
							Dashboard
							<MdOutlineKeyboardDoubleArrowRight className="ml-2 inline-block h-8 w-8 font-light" />
						</p>
					</button>
				)}
			</main>
		</>
	)
}

export default Login
