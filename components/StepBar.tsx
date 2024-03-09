import { FaCheck } from 'react-icons/fa6'
import { MdOutlineKeyboardDoubleArrowRight } from 'react-icons/md'

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

const PreviousStep = ({
	stepName,
	index,
	currentStep,
}: {
	stepName: string
	index: number
	currentStep: number
}): JSX.Element => {
	return (
		<>
			{index != 0 && (
				<div className="absolute inset-y-0 left-0 z-0 mt-[8%] h-1 w-1/2 bg-gray-800"></div>
			)}
			{index + 1 == currentStep ? (
				<div className="absolute inset-y-0 right-0 z-0 mt-[8%] h-1 w-1/2 bg-gradient-to-r from-gray-800 to-secondary-800"></div>
			) : (
				<div className="absolute inset-y-0 right-0 z-0 mt-[8%] h-1 w-1/2 bg-gray-800"></div>
			)}
			<div className="z-10 flex h-8 w-8 items-center justify-center rounded-full bg-gray-800">
				<FaCheck className="text-white" />
			</div>
			<span className="text-gray-800">{stepName}</span>
		</>
	)
}

const CurrentStep = ({
	stepName,
	index,
	currentStep,
	stepLength,
	trigger,
}: {
	stepName: string
	index: number
	currentStep: number
	stepLength: number
	trigger: () => void
}): JSX.Element => {
	if (index == stepLength - 1) {
		return (
			<>
				<div className="absolute inset-y-0 left-0 z-10 mt-[8%] h-1 w-[42%] bg-gradient-to-r from-blue-800 to-primary-800"></div>
				<button
					className="z-20 flex h-8 w-8 items-center justify-center rounded-full border-2 border-primary-800 text-primary-800 transition-all duration-300 hover:bg-primary-800 hover:text-white"
					onClick={trigger}
				>
					<MdOutlineKeyboardDoubleArrowRight className="h-4 w-4" />
				</button>
				<span className="text-primary-800">Dashboard</span>
			</>
		)
	} else {
		return (
			<>
				{index != 0 && (
					<div className="absolute inset-y-0 left-0 z-0 mt-[8%] h-1 w-1/2 bg-gradient-to-r from-secondary-800 to-primary-800"></div>
				)}
				<div className="absolute inset-y-0 right-0 z-10 mt-[8%] h-1 w-[42%] bg-gradient-to-r from-primary-800 to-primary-500"></div>
				<div className="z-0 flex h-8 w-8 items-center justify-center rounded-full bg-primary-800">
					<Loading />
				</div>
				<span className="text-primary-800">{stepName}</span>
			</>
		)
	}
}

const NextStep = ({
	stepName,
	index,
	currentStep,
	stepLength,
}: {
	stepName: string
	index: number
	currentStep: number
	stepLength: number
}): JSX.Element => {
	if (index == stepLength - 1) {
		return (
			<>
				<div className="absolute inset-y-0 left-0 z-0 mt-[8%] h-1 w-[42%] bg-gray-500"></div>
				<button
					className="z-10 flex h-8 w-8 items-center justify-center rounded-full border-2 border-gray-500 text-gray-500"
					disabled
				>
					<MdOutlineKeyboardDoubleArrowRight className="h-4 w-4" />
				</button>
				<span className="text-gray-500">Dashboard</span>
			</>
		)
	}

	return (
		<>
			{index - 1 == currentStep ? (
				<div className="absolute inset-y-0 left-0 z-0 mt-[8%] h-1 w-1/2 bg-gradient-to-r from-primary-500 to-gray-500"></div>
			) : (
				<div className="absolute inset-y-0 left-0 z-0 mt-[8%] h-1 w-1/2 bg-gray-500"></div>
			)}
			{index != stepLength - 1 && (
				<div className="absolute inset-y-0 right-0 z-0 mt-[8%] h-1 w-1/2 bg-gray-500"></div>
			)}
			<div className="z-0 flex h-8 w-8 items-center justify-center rounded-full bg-gray-500">
				<span className="text-white">{index + 1}</span>
			</div>
			<span className="text-gray-500">{stepName}</span>
		</>
	)
}

const StepBar = ({
	currentStep,
	totalSteps,
	trigger,
}: {
	currentStep: number
	totalSteps: string[]
	trigger: () => void
}): JSX.Element => {
	const length = totalSteps.length
	const className = `grid grid-cols-6 items-center transition transition-all duration-150 ease-in-out`

	return (
		<div className={className}>
			{totalSteps.map((stepName, index) => (
				<div className="block" key={index}>
					<div className="grid-cols relative grid justify-items-center gap-3">
						{index < currentStep ? (
							<PreviousStep
								stepName={stepName}
								index={index}
								currentStep={currentStep}
							/>
						) : index == currentStep ? (
							<CurrentStep
								stepName={stepName}
								index={index}
								currentStep={currentStep}
								stepLength={totalSteps.length}
								trigger={trigger}
							/>
						) : (
							<NextStep
								stepName={stepName}
								index={index}
								currentStep={currentStep}
								stepLength={totalSteps.length}
							/>
						)}
					</div>
				</div>
			))}
		</div>
	)
}

export default StepBar
