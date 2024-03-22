import React from 'react'
import { HiArrowRight } from 'react-icons/hi2'

const TitleButton = ({
	title,
	linkName,
	href,
}: {
	title: string
	linkName: string
	href?: string
}) => {
	return (
		<div className="flex place-items-center justify-between">
			<p className="dashboard-subtitle">{title}</p>
			<button className="flex place-items-center rounded-full bg-zinc-900 px-5 py-2 text-white hover:bg-zinc-700">
				{linkName}
				<HiArrowRight className="ml-2 h-4 w-4"></HiArrowRight>
			</button>
		</div>
	)
}

export default TitleButton
