import { Dispatch, SetStateAction } from 'react'

import { CurrentStep, NextStep, PreviousStep } from '@components/Step'

const StepBar = ({
	data,
	setConfirm,
	setPrivateKey,
	setPassword,
}: {
	data: LoginSteps
	setConfirm?: Dispatch<SetStateAction<boolean>>
	setPrivateKey?: Dispatch<SetStateAction<string>>
	setPassword?: Dispatch<SetStateAction<string>>
}): JSX.Element => {
	const stepLength: number = data.length
	let currentIndex: number = data.findIndex((step: LoginStep) => step.state === '' || step.state?.length === 0)

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
		<div className={`grid w-full place-items-center transition-all duration-150 ease-in-out`}>
			{Object.values(data).map((step: LoginStep, index) => (
				<div className="grid w-full justify-items-center" key={index}>
					{index < currentIndex ? (
						<PreviousStep step={step} index={index} currentIndex={currentIndex} stepLength={stepLength} />
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
						<NextStep step={step} index={index} currentIndex={currentIndex} stepLength={stepLength} />
					)}
				</div>
			))}
		</div>
	)
}

export default StepBar
