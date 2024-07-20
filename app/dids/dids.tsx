import { Metadata } from 'next'

import siteMetadata from '@data/siteMetadata.json'

const metadata = siteMetadata.internalLinks.find(
	(link) => link.title === 'Dashboard'
)!

export const generateMetadata = (): Metadata => {
	return {
		metadataBase: new URL(siteMetadata.siteUrl),
		title: metadata.title + ' | ' + siteMetadata.title,
		description: metadata.description,
		openGraph: {
			images: [siteMetadata.siteUrl + siteMetadata.siteBanner],
		},
	}
}

const DIDs = () => {
	return <></>
}

export default DIDs
