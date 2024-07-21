'use client'

import { useRouter } from 'next/navigation'
import { MdOutlineKeyboardDoubleArrowRight } from 'react-icons/md'

import StepBar from '@components/StepBar'
import { useAppSelector } from '@store'

const Login = ({
	method,
	setConfirm,
	setPrivateKey,
	setPassword,
}: {
	method: LoginMethod
	setConfirm?: React.Dispatch<React.SetStateAction<boolean>>
	setPrivateKey?: React.Dispatch<React.SetStateAction<string>>
	setPassword?: React.Dispatch<React.SetStateAction<string>>
}) => {
	const router = useRouter()

	const networkFactorData: NetworkFactorSteps = useAppSelector(
		(state) => state.networkFactorReducer
	).data
	const data: LoginStepsForAllMethods = {
		signInOauth: [
			...networkFactorData,
			...useAppSelector((state) => state.signInOauthReducer).data,
		],
		signInOauthAndPassword: [
			...networkFactorData,
			...useAppSelector((state) => state.signInOauthAndPasswordReducer).data,
		],
		signInPassword: useAppSelector((state) => state.signInPasswordReducer).data,
		signUp: [...networkFactorData, ...useAppSelector((state) => state.signUpReducer).data],
	}
	const title = {
		signInOauth: 'Signing in via Google ...',
		signInOauthAndPassword: 'Signing in on new device ...',
		signInPassword: 'Signing in via password ...',
		signUp: 'Signing up ...',
	}

	const navigateToDashboard = () => {
		router.push('/dashboard')
	}

	const [currentData, currentTitle] = [data[method], title[method]]

	return (
		<main className="bg-global relative flex h-screen w-screen">
			<div className="mx-auto my-auto flex w-full p-10">
				<StepBar
					data={currentData}
					setConfirm={setConfirm}
					setPassword={setPassword}
					setPrivateKey={setPrivateKey}
				/>
				{currentData[currentData.length - 1].state === 'success' ? (
					<h1 className="my-auto h-full w-full text-center text-6xl font-extralight leading-snug text-primary-800">
						You are all set!
					</h1>
				) : (
					<h1 className="my-auto h-full w-full text-center text-6xl font-extralight leading-snug text-zinc-800">
						{currentTitle}
					</h1>
				)}
			</div>
			{currentData[currentData.length - 1].state === 'success' && (
				<button
					className="group absolute inset-y-0 right-0 z-10 flex h-full w-1/3 bg-opacity-0 hover:bg-gradient-to-r hover:from-transparent hover:to-primary-300"
					onClick={navigateToDashboard}
				>
					<p className="my-auto mr-5 hidden w-full text-right text-3xl font-light text-white group-hover:block">
						Dashboard
						<MdOutlineKeyboardDoubleArrowRight className="ml-2 inline-block h-8 w-8 font-light" />
					</p>
				</button>
			)}
		</main>
	)
}

export default Login
