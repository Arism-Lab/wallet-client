import React from 'react'

import { TA } from '@types'

import Image from './Image'

const NodeCard = ({ node }: { node: { node: TA.Node; alive: boolean } }) => {
	return (
		<div className="flex select-none place-items-center rounded-2xl">
			<Image
				src="https://static.vecteezy.com/system/resources/thumbnails/017/193/863/small/cube-purple-3d-png.png"
				alt="Node"
				height={48}
				width={48}
			/>
			<p className="ml-5 font-medium">{node.node.url}</p>
			{node.alive ? (
				<div className="relative mb-14">
					<div className="live-animated"></div>
					<div className="live-dot"></div>
				</div>
			) : (
				<div className="relative mb-14">
					<div className="dead-animated"></div>
					<div className="dead-dot"></div>
				</div>
			)}
		</div>
	)
}

export default NodeCard
