import React from 'react'
import Image from './Image'
import { TA } from '@types'

const NodeCard = ({ node }: { node: TA.Node }) => {
	return (
		<div className="flex select-none place-items-center rounded-2xl">
			<Image
				src="https://static.vecteezy.com/system/resources/thumbnails/017/193/863/small/cube-purple-3d-png.png"
				alt="Node"
				height={48}
				width={48}
			/>
			<p className="ml-5 font-medium">{node.url}</p>
			<div className="relative mb-14">
				<div className="live-animated"></div>
				<div className="dot"></div>
			</div>
		</div>
	)
}

export default NodeCard
