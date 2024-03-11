import { useState } from 'react'
import AccountCard from './AccountCard'
import { TA } from '@types'

const AccountCardSlider = ({
	metadatas,
}: {
	metadatas: TA.MetadataStorage[]
}) => {
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
			{metadatas.map((metadata, index) => (
				<AccountCard
					key={index}
					metadata={metadata}
					click={() => handleClick(index)}
					hidden={click !== null && click !== index}
					focus={click !== null}
				/>
			))}
		</div>
	)
}

export default AccountCardSlider
