import NextLink from 'next/link'
import { LuArrowUpRight } from 'react-icons/lu'

const Link = ({
	as,
	href,
	ref,
	replace,
	scroll,
	shallow,
	passHref,
	className,
	suppressHydrationWarning = true,
	...rest
}: any): JSX.Element => {
	const isInternalLink = href && href.startsWith('/')
	const isAnchorLink = href && href.startsWith('#')

	if (isInternalLink) {
		return (
			<NextLink href={href} className={className} {...rest}>
				<span>{rest.children}</span>
			</NextLink>
		)
	}

	if (isAnchorLink) {
		return (
			<a href={href} className={className} {...rest}>
				<span>{rest.children}</span>
			</a>
		)
	}

	return (
		<a
			target="_blank"
			rel="noopener noreferrer"
			href={href}
			className={className + ' sizing inline-block no-underline'}
		>
			<span className="magic-link-no-underline flex w-fit indent-0">
				{rest.children}
				<LuArrowUpRight className="-mr-0.5 ml-0.5 mt-1 w-min" />
			</span>
		</a>
	)
}

export default Link
