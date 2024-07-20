import Image from '@components/Image'

const NodeCard = ({ node }: { node: { node: ArismNode; alive: boolean } }) => {
	return (
		<div className="flex select-none place-items-center rounded-2xl">
			<Image
				src="https://static.vecteezy.com/system/resources/thumbnails/017/193/863/small/cube-purple-3d-png.png"
				alt="Node"
				height={30}
				width={30}
			/>
			<p className="ml-5 text-sm font-medium">{node.node.url}</p>
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
