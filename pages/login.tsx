import { getSession, useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'
import { MdOutlineKeyboardDoubleArrowRight } from 'react-icons/md'
import * as P2P from '@types/p2p'
import { HomeSEO } from '@components/PageSEO'
import { constructPrivateKey } from '@helpers/networkKey'
import TransitionWrapper from '@components/TransitionWrapper'
import { useRouter } from 'next/router'
import Loading from '@components/Loading'
import StepBar from '@components/StepBar'
import { Session } from 'next-auth'

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
	const { update } = useSession()

	useEffect(() => {
		;(async () => {
			const session: Session | null = await getSession()

			if (session!.key) {
				setStep(FINAL_STEP)
				return
			}

			const input: P2P.GetPrivateKeyRequest = {
				idToken: session!.token.idToken,
				owner: session!.user!.email!,
			}
			setLoading(false)

			const key = await constructPrivateKey(input, setStep)
			console.log({ key })
			// await update({ ...session, key: key.data })
			// const updatedSession = await getSession()
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
