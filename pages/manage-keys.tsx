import { BN, EC } from '@common'
import Loading from '@components/Loading'
import { PageSEO } from '@components/PageSEO'
import sideNavigation from '@data/sideNavigation'
import { deriveDeviceFactor } from '@helpers/deviceFactor'
import { getKeys } from '@helpers/metadata'
import { derivePrivateFactors } from '@helpers/privateFactor'
import { createNewKey } from '@helpers/wallet'
import { deriveUser } from '@libs/storage'
import { TA } from '@types'
import { GetStaticProps } from 'next'
import { useEffect, useState } from 'react'

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
	const [deviceFactor, setDeviceFactor] = useState<TA.Factor | undefined>(
		undefined
	)
	const [secondFactor, setSecondFactor] = useState<TA.Factor | undefined>(
		undefined
	)
	const [user, setUser] = useState<TA.User | undefined>(undefined)

	useEffect(() => {
		;(async () => {
			const user = deriveUser()
			setUser(user)

			const deviceFactor: TA.Factor = deriveDeviceFactor(
				user.user.email!
			) as TA.Factor

			setDeviceFactor({
				x: BN.from(deviceFactor.x, 16),
				y: BN.from(deviceFactor.y, 16),
			})

			const secondFactor = user.networkFactor
				? {
						x: BN.from(user.networkFactor.x, 16),
						y: BN.from(user.networkFactor.y, 16),
					}
				: {
						x: BN.from(user.storageFactor!.x, 16),
						y: BN.from(user.storageFactor!.y, 16),
					}

			setSecondFactor({
				x: BN.from(secondFactor.x, 16),
				y: BN.from(secondFactor.y, 16),
			})

			const keys: TA.Key[] = await getKeys(user.user.email!)
			const privateFactors: TA.Factor[] = await derivePrivateFactors(
				user.user.email!,
				deviceFactor,
				secondFactor
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
					onClick={() =>
						createNewKey(user!.user.email!, deviceFactor!, secondFactor!)
					}
					className="mt-4 rounded-md bg-blue-500 p-2 text-white"
				>
					Create New Key
				</button>
			</div>
		</>
	)
}

export default ManageKeys
