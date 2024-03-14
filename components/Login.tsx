import { useRouter } from 'next/router'
import React from 'react'
import { MdOutlineKeyboardDoubleArrowRight } from 'react-icons/md'

import StepBar from '@components/StepBar'
import { useAppSelector } from '@store'
import { TA } from '@types'

const Login = ({
	method,
	setConfirm,
	setPrivateKey,
	setPassword,
}: {
	method: TA.LoginMethod
	setConfirm?: React.Dispatch<React.SetStateAction<boolean>>
	setPrivateKey?: React.Dispatch<React.SetStateAction<string>>
	setPassword?: React.Dispatch<React.SetStateAction<string>>
}) => {
	const router = useRouter()

	const reducer = useAppSelector((state) => state[`${method}Reducer`])

	const navigateToDashboard = () => {
		router.push('/dashboard')
	}

	const title = () => {
		switch (method) {
			case 'signInOauth':
				return 'Signing in via Google ...'
			case 'signInOauthAndPassword':
				return 'Signing in on new device ...'
			case 'signInPassword':
				return 'Signing in via password ...'
			case 'signUp':
				return 'Signing up ...'
		}
	}

	return (
		<main className="bg-global relative flex h-screen w-screen">
			<div className="mx-auto my-auto flex w-full p-10">
				<StepBar
					data={reducer.data}
					setConfirm={setConfirm}
					setPassword={setPassword}
					setPrivateKey={setPrivateKey}
				/>
				{reducer.data.verifyStep.state === 'success' ? (
					<h1 className="my-auto h-full w-full text-center text-6xl font-extralight leading-snug text-primary-800">
						You are all set!
					</h1>
				) : (
					<h1 className="my-auto h-full w-full text-center text-6xl font-extralight leading-snug text-gray-800">
						{title()}
					</h1>
				)}
			</div>
			{reducer.data.verifyStep.state === 'success' && (
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
