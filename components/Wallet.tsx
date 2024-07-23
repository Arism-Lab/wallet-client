import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { AiOutlineEdit } from 'react-icons/ai'
import { LuCopy } from 'react-icons/lu'
import { MdDeleteOutline } from 'react-icons/md'

import { deleteWallet } from '@helpers/privateFactor'
import cn from '@libs/class'
import { formatKey } from '@libs/key'

interface WalletProps {
	userSession: SessionUser
	wallet: Wallet
	index: number
	removeWallet: () => void
}
const Wallet = ({ userSession, wallet, index, removeWallet }: WalletProps) => {
	const [currentWallet, setCurrentWallet] = useState<Wallet>(wallet)
	const [onEdit, setOnEdit] = useState<boolean>(false)
	const [onDelete, setOnDelete] = useState<boolean>(false)

	const handleDelete = async () => {
		setOnDelete(true)
		const privateIndex: PrivateIndex = { name: wallet.name, address: wallet.address, index: wallet.index }
		await deleteWallet(userSession, privateIndex)
		setOnDelete(false)
		removeWallet()
	}

	return (
		<div
			key={wallet.address}
			className={cn(
				'flex h-[400px] w-full flex-col rounded-xl border-none p-5',
				index === 0 ? 'bg-zinc-900 text-white' : 'bg-tertiary-200 text-black'
			)}
		>
			<div className="flex place-items-center justify-between">
				<div className="flex place-items-center gap-4">
					<div className="grid">
						<p className="font-base text-2xl">{wallet.name}</p>
						<p className="text-sm font-light ">{formatKey(wallet.address, false)}</p>
					</div>
				</div>
				{index !== 0 && (
					<div className="flex gap-2">
						<AiOutlineEdit className="size-12 cursor-pointer rounded-full bg-zinc-900 fill-white p-3.5 hover:bg-opacity-70"></AiOutlineEdit>
						<MdDeleteOutline
							className="size-12 cursor-pointer rounded-full bg-red-600 fill-white p-3.5 hover:bg-opacity-70"
							onClick={() => handleDelete()}
						></MdDeleteOutline>
					</div>
				)}
			</div>
		</div>
	)
}

export default Wallet
