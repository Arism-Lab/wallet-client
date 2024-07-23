import { Metadata } from 'next'

import { C } from '@common'
import WalletListing from '@components/WalletListing'
import siteMetadata from '@data/siteMetadata.json'
import { derivePrivateFactors, getPrivateIndices } from '@helpers/privateFactor'
import { auth } from '@libs/auth'

const metadata = siteMetadata.internalLinks.find((link) => link.title === 'Wallets')!

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
const ManageWallets = async () => {
	const userSession: SessionUser = (await auth())!
	const privateIndices: PrivateIndex[] = await getPrivateIndices(userSession.info.email, false)
	const privateFactors: Point[] = derivePrivateFactors(userSession, privateIndices)

	const wallets: Wallet[] = privateIndices.map((privateIndex, i) => {
		const privateKey = privateFactors[i].y
		const publicKey = C.getPublicKeyFromPrivateKey(privateKey)

		return { ...privateIndex, privateKey, publicKey }
	})

	return (
		<div className="size-full py-5">
			<WalletListing userSession={userSession} wallets={wallets} />
		</div>
	)
}

export default ManageWallets
