import cn from '@libs/class'

interface AlertProps {
	type: 'info' | 'success' | 'warning' | 'error'
	title: string
	description: string
}
const Alert = ({ type, title, description }: AlertProps) => {
	return (
		<div
			role="alert"
			className={cn(
				'alert text-white',
				type === 'info' && 'alert-info',
				type === 'success' && 'alert-success',
				type === 'warning' && 'alert-warning',
				type === 'error' && 'alert-error'
			)}
		>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				fill="none"
				viewBox="0 0 24 24"
				className={cn(
					'stroke-info h-6 w-6 shrink-0 stroke-white',
					type === 'info' && 'fill-info',
					type === 'success' && 'fill-success',
					type === 'warning' && 'fill-warning',
					type === 'error' && 'fill-error'
				)}
			>
				<path
					strokeLinecap="round"
					strokeLinejoin="round"
					strokeWidth="2"
					d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
				></path>
			</svg>
			<div>
				<h3 className="text-lg font-bold">{title}</h3>
				<div className="text-base">{description}</div>
			</div>
		</div>
	)
}

export default Alert
