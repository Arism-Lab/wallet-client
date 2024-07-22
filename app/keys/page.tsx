import { Metadata } from 'next'
import { useEffect, useState } from 'react'
import { AiOutlineEdit } from 'react-icons/ai'
import { BsDice5 } from 'react-icons/bs'
import { LuArrowDownToLine, LuCopy } from 'react-icons/lu'
import { MdDeleteOutline } from 'react-icons/md'

import { C } from '@common'
import Loading from '@components/Loading'
import Spinner from '@components/Spinner'
import siteMetadata from '@data/siteMetadata.json'
import { getPrivateIndices } from '@helpers/metadata'
import { derivePrivateFactors } from '@helpers/privateFactor'
import { createNewKey } from '@helpers/wallet'
import { formatKey } from '@libs/key'
import { useAppSelector } from '@store'

const metadata = siteMetadata.internalLinks.find((link) => link.title === 'Keys')!

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
const ManageKeys = () => {
	const keys: Key[] = await getPrivateIndices(sessionUserReducer.data!.info.email)
	const privateFactors: Point[] = await derivePrivateFactors(sessionUserReducer.data!)

	const [keys, setKeys] = useState<FullKey[] | undefined>(undefined)
	const sessionUserReducer = useAppSelector((state) => state.sessionUserReducer)

	const [createKeyLoading, setCreateKeyLoading] = useState(false)

	useEffect(() => {
		;(async () => {
			if (!createKeyLoading) {
				setKeys(
					keys.map((key, i) => {
						const privateKey = privateFactors[i].y.toString(16)
						const publicKey = C.getPublicKeyFromPrivateKey(privateFactors[i].y)

						return { ...key, privateKey, publicKey }
					})
				)
			}
		})()
	}, [createKeyLoading])

	if (keys === undefined) {
		return <Loading />
	}

	const createKey = async () => {
		setCreateKeyLoading(true)
		await createNewKey(sessionUserReducer.data!)
		setCreateKeyLoading(false)
	}

	return (
		<div className="h-full w-full py-5">
			<div className="mx-auto h-full py-4">
				<div className="grid">
					{keys.map((key, i) => (
						<div key={key.address} className="m-2 flex flex-col rounded-[3rem] border-none bg-white p-5">
							<div className="flex place-items-center justify-between">
								<div className="flex place-items-center gap-4">
									<p className="flex h-8 w-8 place-items-center justify-center rounded-full bg-zinc-900 text-lg font-medium text-white">
										{i + 1}
									</p>
									<div className="grid">
										<p className="dashboard-subtitle font-base text-xl">Default Key</p>
										<p className="text-sm font-light text-zinc-500">{formatKey(key.address, false)}</p>
									</div>
								</div>
								<div className="flex gap-2">
									<button className="flex place-items-center rounded-full bg-zinc-100 px-6 py-2 text-black hover:bg-zinc-300">
										Edit
										<AiOutlineEdit className="ml-3 h-4 w-4"></AiOutlineEdit>
									</button>
									<button className="flex place-items-center rounded-full bg-zinc-900 px-6 py-2 text-white hover:bg-zinc-700">
										Copy
										<LuCopy className="ml-3 h-4 w-4"></LuCopy>
									</button>
									<button className="flex place-items-center rounded-full bg-red-700 px-6 py-2 text-white hover:bg-red-900">
										Remove
										<MdDeleteOutline className="ml-3 h-4 w-4"></MdDeleteOutline>
									</button>
								</div>
							</div>
						</div>
					))}
				</div>
			</div>
			<div className="mb-10 mt-auto flex justify-center gap-5 text-lg font-light text-white">
				<button
					onClick={async () => createKey()}
					className="flex place-items-center rounded-full bg-zinc-900 px-10 py-4 hover:bg-zinc-700"
				>
					Generate new key
					{createKeyLoading ? <Spinner className="ml-6 h-6 w-6" /> : <BsDice5 className="ml-6 h-6 w-6"></BsDice5>}
				</button>
				<button
					onClick={async () => createKey()}
					className="flex place-items-center rounded-full bg-zinc-900 px-10 py-4 hover:bg-zinc-700"
				>
					Import existing key
					<LuArrowDownToLine className="ml-6 h-6 w-6"></LuArrowDownToLine>
				</button>
			</div>
		</div>
	)
}

export default ManageKeys
