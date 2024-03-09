import NextLink, { LinkProps } from 'next/link'
import { HTMLProps, FC } from 'react'
import { LuArrowUpRight } from 'react-icons/lu'

const Link: FC<LinkProps & HTMLProps<HTMLAnchorElement>> = ({
	as,
	href,
	ref,
	replace,
	scroll,
	shallow,
	passHref,
	...rest
}): JSX.Element => {
	const isInternalLink = href && href.startsWith('/')
	const isAnchorLink = href && href.startsWith('#')

	if (isInternalLink) {
		return <NextLink href={href} {...rest} />
	}

	if (isAnchorLink) {
		return <a href={href} {...rest} />
	}

	return (
		<a
			className="magic-link-no-underline group flex w-min"
			target="_blank"
			rel="noopener noreferrer"
			href={href}
		>
			{rest.children}
			<LuArrowUpRight className="ml-1 mt-1" />
		</a>
	)
}

export default Link
