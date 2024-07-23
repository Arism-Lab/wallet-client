import { Metadata } from 'next'

import MFASetting from '@components/MFASetting'
import siteMetadata from '@data/siteMetadata.json'
import { auth } from '@libs/auth'
import { findRecoveryKey } from '@services/metadata'

const metadata = siteMetadata.internalLinks.find((link) => link.title === 'Settings')!

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

const Settings = async () => {
	const userSession: SessionUser = (await auth())!
	const enabledMfa: boolean = await findRecoveryKey(userSession.info.email)
		.then((recoveryKey) => recoveryKey !== '0')
		.catch(() => false)

	return (
		<>
			<div className="container mx-auto px-4">
				<h1 className="my-8 text-3xl font-bold">Settings</h1>
				<div className="flex flex-col">
					<MFASetting userSession={userSession} enabledMfa={enabledMfa} />
				</div>
			</div>
		</>
	)
}

export default Settings
