import { deriveSession, storeToken } from '@libs/storage'
import { useRouter } from 'next/router'
import { Session } from 'next-auth'
import { getSession } from 'next-auth/react'
import { useEffect, useState } from 'react'
import { MdOutlineKeyboardDoubleArrowRight } from 'react-icons/md'

import { HomeSEO } from '@components/PageSEO'
import StepBar from '@components/StepBar'
import { verifyDevice } from '@helpers/deviceFactor'
import { getUser } from '@helpers/metadata'
import {
	signInWithOauth,
	signInWithOauthAndPassword,
	signUp,
} from '@helpers/wallet'

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
	const [step, setStep] = useState<number>(0)
	const router = useRouter()
	const [password, setPassword] = useState('')

	useEffect(() => {
		;(async () => {
			const {
				token: { account },
				user,
			}: Session = (await getSession()) as Session

			storeToken(account)

			try {
				const session = deriveSession()
				if (session) {
					setStep(FINAL_STEP)
					return
				}
			} catch {}

			let success: boolean | undefined = undefined

			const existed = await getUser(user.email)
			if (existed) {
				const { verified }: { verified: boolean } = await verifyDevice(
					user.email
				)

				success = verified
					? await signInWithOauth(user, account, setStep)
					: await signInWithOauthAndPassword(user, account, password, setStep)
			} else {
				success = await signUp(user, account, setStep)
			}

			if (!success) {
				alert('Failed to sign in')
			}
		})()
	}, [])

	const navigateToDashboard = () => {
		router.push('/dashboard')
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
