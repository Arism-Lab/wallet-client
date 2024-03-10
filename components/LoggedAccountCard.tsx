import { TA } from '@types'
import React from 'react'
import Image from './Image'
import { AiOutlineDown, AiOutlineRight } from 'react-icons/ai'
import { displayKey } from '@libs/blockchain'
import { formatDate } from '@libs/date'

const LoggedAccountCard = ({
	metadata,
}: {
	metadata: TA.MetadataStorage
}): JSX.Element => {
	return (
		<div className="flex select-none place-items-center gap-5 rounded-2xl bg-white p-5">
			<Image
				src={metadata.user.image!}
				alt={metadata.user.email!}
				height={50}
				width={50}
				className="rounded-full"
			/>
			<div className="flex flex-col text-left">
				<p className="font-medium">
					{metadata.user.name} ({formatDate(metadata.lastLogin, true)})
				</p>
				<p className="font-light text-gray-500">{metadata.user.email}</p>
			</div>
			<AiOutlineRight className="ml-auto h-5 w-5 rounded-full text-xl text-black" />
		</div>
	)
}

export default LoggedAccountCard
