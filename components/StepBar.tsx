import { TA } from '@types'
import { useState } from 'react'
import { CiCircleChevRight } from 'react-icons/ci'
import { FaDiceFive } from 'react-icons/fa'

import { C } from '@common'
import { formatKey, validatePrivateKey } from '@libs/key'

const Loading = (): JSX.Element => {
	return (
		<svg
			className="animate-spin p-1 text-white"
			xmlns="http://www.w3.org/2000/svg"
			fill="none"
			viewBox="0 0 24 24"
		>
			<circle
				className="opacity-20"
				cx="12"
				cy="12"
				r="10"
				stroke="currentColor"
				stroke-width="4"
			></circle>
			<path
				className="opacity-80"
				fill="currentColor"
				d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
			></path>
		</svg>
	)
}

const StepWrapper = ({
	step,
	process,
	setConfirm,
	setPrivateKey,
	setPassword,
	children,
}: {
	step: TA.Step
	process: 'previous' | 'current' | 'next'
	setConfirm?: React.Dispatch<React.SetStateAction<boolean>>
	setPrivateKey?: React.Dispatch<React.SetStateAction<string>>
	setPassword?: React.Dispatch<React.SetStateAction<string>>
	children: JSX.Element
}): JSX.Element => {
	const theme = {
		previous: 'zinc-800',
		current: 'primary-800',
		next: 'zinc-500',
	}

	const [pri, setPri] = useState<string>('')
	const [pass, setPass] = useState<string>('')

	const onSetPrivateKey = (key: string) => {
		setPri(key)
		setPrivateKey!(key)
	}

	const onSetPassword = (password: string) => {
		setPass(password)
		setPassword!(password)
	}

	const randomKey = C.generatePrivateKey()

	return (
		<div className="flex h-[100px] w-full place-items-center justify-items-center">
			<span
				className={`w-[235px] text-right text-lg font-light text-${theme[process]}`}
			>
				{step.instruction.name}
			</span>
			<div className="w-[100px]">{children}</div>
			<div
				className={`grid w-[650px] items-center gap-1 text-${theme[process]}`}
			>
				{process === 'current' && step.passwordInput && (
					<div className="flex place-items-center justify-items-center gap-2">
						<div className="w-[50px]">Pass</div>
						<input
							className="rounded-md border border-zinc-300 px-2 py-[2px] text-sm font-medium"
							type="password"
							onChange={(e) => setPassword!(e.target.value)}
						/>
						<button
							className="rounded-md border border-zinc-300 px-2 py-[2px] text-sm font-medium"
							onClick={() => setConfirm!(true)}
						>
							<CiCircleChevRight />
						</button>
					</div>
				)}
				{process === 'current' && step.privateKeyInput && (
					<div className="flex place-items-center justify-items-center gap-2">
						<div className="w-[50px]">Key</div>
						<div className="w-[300px] rounded-md border border-zinc-300 px-2 py-[2px] text-sm font-medium">
							<input
								className="h-full w-full appearance-none border-none bg-transparent focus:outline-none"
								type="text"
								value={pri}
								onChange={(e) => onSetPrivateKey(e.target.value)}
							/>
						</div>
						<CiCircleChevRight
							className="h-7 w-7 cursor-pointer text-primary-500 aria-disabled:pointer-events-none aria-disabled:text-zinc-500/50"
							onClick={() => setConfirm!(true)}
							aria-disabled={!validatePrivateKey(pri)}
						/>
						<p className="text-xs text-zinc-500">or</p>
						<FaDiceFive
							className="h-6 w-6 cursor-pointer text-primary-500"
							onClick={() => onSetPrivateKey(randomKey)}
						/>
					</div>
				)}
				{Array.isArray(step.state) ? (
					step.state.map((state, index) => {
						if (typeof state === 'string') {
							return (
								<div
									key={index}
									className="flex place-items-center justify-items-center gap-2"
								>
									<div className="w-[50px]">Key {index + 1} </div>
									<span className="font-mono  cursor-pointer rounded-md border border-zinc-300 px-3 py-[2px] text-sm font-medium opacity-80 hover:bg-zinc-200">
										{formatKey(state, true)}
									</span>
								</div>
							)
						}
						return (
							<div
								key={index}
								className="flex place-items-center justify-items-center gap-2"
							>
								<div className="w-[50px]">Node {state.node} </div>
								<span className="font-mono  cursor-pointer rounded-md border border-zinc-300 px-2 py-[2px] text-sm font-medium opacity-80 hover:bg-zinc-200">
									{formatKey(state.value, true)}
								</span>
							</div>
						)
					})
				) : (
					<div className="flex place-items-center justify-items-center gap-2">
						<div className="w-[50px]">
							{step.state && (step.state === 'success' ? 'Result' : 'Key')}
						</div>
						<span className="font-mono  cursor-pointer rounded-md border border-zinc-300 px-2 py-[2px] text-sm font-medium opacity-80 hover:bg-zinc-200">
							{formatKey(step.state || '', true)}
						</span>
					</div>
				)}
			</div>
		</div>
	)
}

const PreviousStep = ({
	step,
	index,
	currentIndex,
	stepLength,
}: {
	step: TA.Step
	index: number
	currentIndex: number
	stepLength: number
}): JSX.Element => {
	const isFirstIndex = index == 0
	const isNextIndex = index == currentIndex - 1
	const isLastIndex = index == stepLength - 1

	return (
		<StepWrapper step={step} process="previous">
			<div className="relative">
				{isNextIndex && !isLastIndex && (
					<div className="absolute inset-x-0 top-[30px] z-0 ml-[48px] h-[36px] w-[4px] bg-gradient-to-b from-zinc-800 to-secondary-800"></div>
				)}
				{!isLastIndex && (
					<div className="absolute inset-x-0 top-[30px] z-0 ml-[48px] h-[36px] w-[4px] bg-zinc-800"></div>
				)}
				{!isFirstIndex && (
					<div className="absolute inset-x-0 bottom-[30px] z-0 ml-[48px] h-[36px] w-[4px] bg-zinc-800"></div>
				)}
				<div className="z-0 mx-auto flex w-full items-center justify-center">
					<span className="flex h-[30px] w-[30px] place-items-center justify-center rounded-full bg-zinc-800 text-white">
						{index + 1}
					</span>
				</div>
			</div>
		</StepWrapper>
	)
}

const CurrentStep = ({
	step,
	index,
	stepLength,
	setConfirm,
	setPrivateKey,
	setPassword,
}: {
	step: TA.Step
	index: number
	stepLength: number
	setConfirm?: React.Dispatch<React.SetStateAction<boolean>>
	setPrivateKey?: React.Dispatch<React.SetStateAction<string>>
	setPassword?: React.Dispatch<React.SetStateAction<string>>
}): JSX.Element => {
	const isFirstIndex = index == 0
	const isLastIndex = index == stepLength - 1

	return (
		<StepWrapper
			step={step}
			process="current"
			setConfirm={setConfirm}
			setPrivateKey={setPrivateKey}
			setPassword={setPassword}
		>
			<div className="relative">
				{!isFirstIndex && (
					<div className="absolute inset-x-0 bottom-[30px] z-0 ml-[48px] h-[36px] w-[4px] bg-gradient-to-b from-secondary-800 to-primary-800"></div>
				)}
				{!isLastIndex && (
					<div className="absolute inset-x-0 top-[30px] z-0 ml-[48px] h-[36px] w-[4px] bg-gradient-to-b from-primary-800 to-primary-500"></div>
				)}
				<div className="z-0 mx-auto flex w-full items-center justify-center">
					<span className="flex h-[30px] w-[30px] place-items-center justify-center rounded-full bg-primary-800 text-white">
						<Loading />
					</span>
				</div>
			</div>
		</StepWrapper>
	)
}

const NextStep = ({
	step,
	index,
	currentIndex,
	stepLength,
}: {
	step: TA.Step
	index: number
	currentIndex: number
	stepLength: number
}): JSX.Element => {
	const isLastIndex = index == stepLength - 1
	const isNextIndex = index == currentIndex + 1

	return (
		<StepWrapper step={step} process="next">
			<div className="relative">
				{isNextIndex ? (
					<div className="absolute inset-x-0 bottom-[30px] z-0 ml-[48px] h-[36px] w-[4px] bg-gradient-to-b from-primary-500 to-zinc-500"></div>
				) : (
					<div className="absolute inset-x-0 bottom-[30px] z-0 ml-[48px] h-[36px] w-[4px] bg-zinc-500"></div>
				)}
				{!isLastIndex && (
					<div className="absolute inset-x-0 top-[30px] z-0 ml-[48px] h-[36px] w-[4px] bg-zinc-500"></div>
				)}
				<div className="z-0 mx-auto flex w-full items-center justify-center">
					<span className="flex h-[30px] w-[30px] place-items-center justify-center rounded-full bg-zinc-500 text-white">
						{index + 1}
					</span>
				</div>
			</div>
		</StepWrapper>
	)
}

const StepBar = ({
	data,
	setConfirm,
	setPrivateKey,
	setPassword,
}: {
	data: TA.LoginState
	setConfirm?: React.Dispatch<React.SetStateAction<boolean>>
	setPrivateKey?: React.Dispatch<React.SetStateAction<string>>
	setPassword?: React.Dispatch<React.SetStateAction<string>>
}): JSX.Element => {
	const stepLength = Object.values(data).length

	let currentIndex: number = Object.values(data).findIndex(
		(step: TA.Step) => step.state === '' || step.state?.length === 0
	)

	if (currentIndex === -1) {
		currentIndex = stepLength
	} else if (currentIndex !== 0) {
		const previousState = data[Object.keys(data)[currentIndex]].state - 1

		if (Array.isArray(previousState)) {
			if (typeof previousState[0] === 'string') {
				currentIndex = stepLength - Number(previousState[0].length !== 2)
			} else if (typeof previousState[0] === 'object') {
				currentIndex = stepLength - Number(previousState[0].value.length !== 3)
			}
		}
	}

	return (
		<div
			className={`grid w-full place-items-center transition-all duration-150 ease-in-out`}
		>
			{Object.values(data).map((step: TA.Step, index) => (
				<div className="grid w-full justify-items-center" key={index}>
					{index < currentIndex ? (
						<PreviousStep
							step={step}
							index={index}
							currentIndex={currentIndex}
							stepLength={stepLength}
						/>
					) : index == currentIndex ? (
						<CurrentStep
							step={step}
							index={index}
							stepLength={stepLength}
							setConfirm={setConfirm}
							setPrivateKey={setPrivateKey}
							setPassword={setPassword}
						/>
					) : (
						<NextStep
							step={step}
							index={index}
							currentIndex={currentIndex}
							stepLength={stepLength}
						/>
					)}
				</div>
			))}
		</div>
	)
}

export default StepBar
