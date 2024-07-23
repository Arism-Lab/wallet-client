import cn from '@libs/class'

const Loading = ({
	fullScreen,
	size = 'base',
}: {
	fullScreen?: boolean
	size?: 'xl' | 'lg' | 'base' | 'sm' | 'xs'
}) => {
	return (
		<>
			{fullScreen ? (
				<div className="fixed left-0 top-0 z-50 flex h-screen w-screen items-center justify-center bg-zinc-100">
					<div className="loading loading-infinity loading-lg"></div>
				</div>
			) : (
				<div className="flex items-center justify-center py-[2px]">
					<div
						className={cn(
							'loading loading-dots',
							size === 'xl' && 'loading-lg',
							size === 'lg' && 'loading-md',
							size === 'base' && 'loading-sm',
							(size === 'sm' || size === 'xs') && 'loading-xs'
						)}
					></div>
				</div>
			)}
		</>
	)
}

export default Loading
