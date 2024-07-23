'use client'

import { useState } from 'react'
import { BsDice5 } from 'react-icons/bs'
import { LuArrowDownToLine } from 'react-icons/lu'

import Spinner from '@components/Spinner'
import Wallet from '@components/Wallet'
import { createNewWallet } from '@helpers/privateFactor'

interface WalletListingProps {
	userSession: SessionUser
	wallets: Wallet[]
}
const WalletListing = ({ userSession, wallets }: WalletListingProps) => {
	const [createWalletLoading, setCreateKeyLoading] = useState<boolean>(false)
	const [currentWallets, setCurrentWallets] = useState<Wallet[]>(wallets)
	const [name, setName] = useState<string>('Child Wallet')

	const createWallet = async () => {
		setCreateKeyLoading(true)
		const newWallet: Wallet = (await createNewWallet(userSession, name))!
		setCurrentWallets([...currentWallets, newWallet])
		setCreateKeyLoading(false)
	}

	const removeWallet = (index: number) => {
		setCurrentWallets(currentWallets.filter((_, i) => i !== index))
	}

	return (
		<>
			<div className="mx-auto h-full py-4">
				<div className="grid grid-cols-3 place-items-center justify-start gap-10 ">
					{currentWallets.map((wallet, i) => (
						<Wallet key={i} userSession={userSession} wallet={wallet} index={i} removeWallet={() => removeWallet(i)} />
					))}
				</div>
			</div>
			<div className="mb-10 mt-auto flex justify-center gap-5 text-lg font-light text-white">
				<button
					onClick={async () => createWallet()}
					className="flex place-items-center rounded-full bg-zinc-900 px-10 py-4 hover:bg-zinc-700"
				>
					Generate new key
					{createWalletLoading ? <Spinner className="ml-6 size-6" /> : <BsDice5 className="ml-6 size-6"></BsDice5>}
				</button>
				<button
					onClick={async () => createWallet()}
					className="flex place-items-center rounded-full bg-zinc-900 px-10 py-4 hover:bg-zinc-700"
				>
					Import existing key
					<LuArrowDownToLine className="ml-6 size-6"></LuArrowDownToLine>
				</button>
			</div>
		</>
	)
}

export default WalletListing
