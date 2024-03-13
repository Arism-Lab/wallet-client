import { GetStaticProps } from 'next'
import { useEffect, useState } from 'react'

import { EC } from '@common'
import Loading from '@components/Loading'
import { PageSEO } from '@components/PageSEO'
import sideNavigation from '@data/sideNavigation'
import { getKeys } from '@helpers/metadata'
import { derivePrivateFactors } from '@helpers/privateFactor'
import { createNewKey } from '@helpers/wallet'
import { useAppSelector } from '@store'
import { TA } from '@types'

export const getStaticProps: GetStaticProps = async () => {
	const siteInfo = sideNavigation.find((item) => item.path === '/manage-keys')

	return {
		props: {
			title: siteInfo?.title,
			description: siteInfo?.description,
		},
	}
}

const ManageKeys = ({ title, description }: PageSEOProps) => {
	const [keys, setKeys] = useState<TA.FullKey[] | undefined>(undefined)
	const sessionUserReducer = useAppSelector((state) => state.sessionUserReducer)

	useEffect(() => {
		;(async () => {
			const keys: TA.Key[] = await getKeys(sessionUserReducer.data!.info.email)
			const privateFactors: TA.Factor[] = await derivePrivateFactors(
				sessionUserReducer.data!
			)

			setKeys(
				keys.map((key, i) => {
					const privateKey = privateFactors[i].y.toString(16)
					const publicKey = EC.getPublicKeyFromPrivateKey(privateFactors[i].y)

					return { ...key, privateKey, publicKey }
				})
			)
		})()
	}, [])

	if (keys === undefined) {
		return <Loading />
	}

	return (
		<>
			<PageSEO title={title} description={description} />
			<div className="container mx-auto px-4">
				<div className="grid divide-y divide-gray-500">
					{keys.map((key) => (
						<div key={key.address} className="flex flex-col py-5">
							<p className="text-lg font-light">Address: {key.address}</p>
							<p className="text-lg font-light">Public Key: {key.publicKey}</p>
							<p className="text-lg font-light">
								Private Key: {key.privateKey}
							</p>
						</div>
					))}
				</div>
				<button
					onClick={() => createNewKey(sessionUserReducer.data!)}
					className="mt-4 rounded-md bg-blue-500 p-2 text-white"
				>
					Create New Key
				</button>
			</div>
		</>
	)
}

export default ManageKeys
