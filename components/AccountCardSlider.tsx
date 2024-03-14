import { useState } from 'react'

import AccountCard from '@components/AccountCard'
import { useAppSelector } from '@store'
import { TA } from '@types'

const AccountCardSlider = () => {
	const [click, setClick] = useState<number | null>(null)

	const localUsersReducer = useAppSelector((state) => state.localUsersReducer)

	const handleClick = (index: number) => {
		if (click === null) {
			setClick(index)
		} else {
			setClick(null)
		}
	}

	if (localUsersReducer.data.length === 0 || !localUsersReducer.data) {
		return null
	}

	return (
		<div className="mx-auto grid gap-5">
			<p className="font-extralight">
				or continue with existed accounts on this device
			</p>
			<div
				className="flex w-[90vw] gap-5 text-base transition-all duration-300 ease-in-out aria-expanded:gap-0"
				aria-expanded={click !== null}
			>
				{localUsersReducer.data
					// .sort(
					// 	(a, b) =>
					// 		new Date(b.lastLogin).getTime() - new Date(a.lastLogin).getTime()
					// )
					.map((localUser, index) => (
						<AccountCard
							key={index}
							localUser={localUser}
							click={() => handleClick(index)}
							hidden={click !== null && click !== index}
							focus={click !== null}
						/>
					))}
			</div>
		</div>
	)
}

export default AccountCardSlider
