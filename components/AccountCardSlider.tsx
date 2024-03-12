import { useState } from 'react'
import AccountCard from './AccountCard'
import { TA } from '@types'

const AccountCardSlider = ({ locals }: { locals: TA.UserLocal[] }) => {
	const [click, setClick] = useState<number | null>(null)

	const handleClick = (index: number) => {
		if (click === null) {
			setClick(index)
		} else {
			setClick(null)
		}
	}

	return (
		<div
			className="flex w-[90vw] gap-5 text-base transition-all duration-300 ease-in-out aria-expanded:gap-0"
			aria-expanded={click !== null}
		>
			{locals.map((local, index) => (
				<AccountCard
					key={index}
					local={local}
					click={() => handleClick(index)}
					hidden={click !== null && click !== index}
					focus={click !== null}
				/>
			))}
		</div>
	)
}

export default AccountCardSlider
