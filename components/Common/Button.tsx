import Link from 'next/link'

import Loading from '@components/Common/Loading'
import ArrowIcon from '@components/Icon/ArrowIcon'
import cn from '@libs/class'

const Button = ({
	variant = 'primary',
	size = 'lg',
	className,
	children,
	arrow,
	onLoading,
	onDisabled,
	...props
}: any) => {
	const isAnchor = props?.href?.startsWith('http')
	props.target = isAnchor ? '_blank' : null

	const Component = props?.href ? (isAnchor ? 'a' : Link) : 'button'

	const arrowIcon = (
		<ArrowIcon
			className={cn(
				size === 'xl' && 'h-8 w-8',
				size === 'lg' && 'mt-0 h-6 w-6 lg:mt-0.5 lg:h-7 lg:w-7',
				size === 'base' && 'mt-0 h-5 w-5 lg:mt-0.5 lg:h-6 lg:w-6',
				size === 'sm' && 'mt-0 h-3 w-3 lg:mt-0.5 lg:h-4 lg:w-4',
				variant === 'text' && 'mb-1',
				arrow === 'left' && '-ml-1 rotate-180',
				arrow === 'right' && '-mr-1'
			)}
		/>
	)

	return (
		<Component
			className={cn(
				'not-prose inline-flex w-fit select-none gap-0.5 overflow-hidden text-nowrap font-sans',
				variant === 'primary' && 'primary-button',
				variant === 'secondary' && 'secondary-button',
				variant === 'text' && 'text-button',
				variant === 'filled' && 'filled-button',
				size === 'xl' && 'text-base lg:text-lg xl:text-xl',
				size === 'lg' && 'text-sm lg:text-base xl:text-lg',
				size === 'base' && 'text-xs lg:text-sm xl:text-base',
				size === 'sm' && 'text-2xs lg:text-xs xl:text-sm',
				size === 'xs' && 'text-2xs lg:text-xs xl:text-sm',
				variant !== 'text' && size === 'xl' && 'lg:py-2xl:px-10 px-8 py-2 lg:px-9 xl:py-2',
				variant !== 'text' && size === 'lg' && 'lg:py-2xl:px-8 px-6 py-2 lg:px-7 xl:py-2',
				variant !== 'text' && size === 'base' && 'lg:py-2xl:px-6 px-4 py-2 lg:px-4 xl:py-2',
				variant !== 'text' && size === 'sm' && 'lg:py-1xl:px-4 px-3 py-1 lg:px-3 xl:py-1',
				variant !== 'text' && size === 'xs' && 'lg:py-1xl:px-3 px-2 py-1 lg:px-2 xl:py-1',
				onDisabled ? 'pointer-events-none bg-zinc-600' : 'cursor-pointer',
				className
			)}
			{...props}
		>
			{onLoading ? (
				<Loading size={size} />
			) : (
				<>
					{arrow === 'left' && arrowIcon}
					{children}
					{arrow === 'right' && arrowIcon}
				</>
			)}
		</Component>
	)
}

export default Button
