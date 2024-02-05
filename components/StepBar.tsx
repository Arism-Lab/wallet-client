import { FaCheck } from 'react-icons/fa6'
import { MdOutlineKeyboardDoubleArrowRight } from 'react-icons/md'

const Loading = (): JSX.Element => {
  return (
    <svg
      className="animate-spin text-white p-1"
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
        <div className="z-0 absolute w-1/2 h-1 left-0 mt-[8%] inset-y-0 bg-gray-800"></div>
      )}
      {index + 1 == currentStep ? (
        <div className="z-0 absolute w-1/2 h-1 right-0 mt-[8%] inset-y-0 bg-gradient-to-r from-gray-800 to-secondary-800"></div>
      ) : (
        <div className="z-0 absolute w-1/2 h-1 right-0 mt-[8%] inset-y-0 bg-gray-800"></div>
      )}
      <div className="z-10 flex items-center justify-center w-8 h-8 rounded-full bg-gray-800">
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
        <div className="z-10 absolute w-[42%] h-1 left-0 mt-[8%] inset-y-0 bg-gradient-to-r from-blue-800 to-primary-800"></div>
        <button
          className="z-20 flex items-center justify-center w-8 h-8 rounded-full border-2 border-primary-800 hover:bg-primary-800 transition-all duration-300 text-primary-800 hover:text-white"
          onClick={trigger}
        >
          <MdOutlineKeyboardDoubleArrowRight className="w-4 h-4" />
        </button>
        <span className="text-primary-800">Dashboard</span>
      </>
    )
  } else {
    return (
      <>
        {index != 0 && (
          <div className="z-0 absolute w-1/2 h-1 left-0 mt-[8%] inset-y-0 bg-gradient-to-r from-secondary-800 to-primary-800"></div>
        )}
        <div className="z-10 absolute w-[42%] h-1 right-0 mt-[8%] inset-y-0 bg-gradient-to-r from-primary-800 to-primary-500"></div>
        <div className="z-0 flex items-center justify-center w-8 h-8 rounded-full bg-primary-800">
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
        <div className="z-0 absolute w-[42%] h-1 left-0 mt-[8%] inset-y-0 bg-gray-500"></div>
        <button
          className="z-10 flex items-center justify-center w-8 h-8 rounded-full border-2 border-gray-500 text-gray-500"
          disabled
        >
          <MdOutlineKeyboardDoubleArrowRight className="w-4 h-4" />
        </button>
        <span className="text-gray-500">Dashboard</span>
      </>
    )
  }

  return (
    <>
      {index - 1 == currentStep ? (
        <div className="z-0 absolute w-1/2 h-1 left-0 mt-[8%] inset-y-0 bg-gradient-to-r from-primary-500 to-gray-500"></div>
      ) : (
        <div className="z-0 absolute w-1/2 h-1 left-0 mt-[8%] inset-y-0 bg-gray-500"></div>
      )}
      {index != stepLength - 1 && (
        <div className="z-0 absolute w-1/2 h-1 right-0 mt-[8%] inset-y-0 bg-gray-500"></div>
      )}
      <div className="z-0 flex items-center justify-center w-8 h-8 rounded-full bg-gray-500">
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
          <div className="relative grid justify-items-center gap-3 grid-cols">
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
