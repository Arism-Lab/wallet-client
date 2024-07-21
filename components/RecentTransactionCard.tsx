'use client'

import { useEffect, useState } from 'react'
import { BsArrowLeftCircle, BsArrowRightCircle } from 'react-icons/bs'

import TitleButton from '@components/TitleButton'
import { formatDate } from '@libs/date'

const transactions = [
	{
		type: 'Outgoing',
		time: '1711066345',
		address: '0x3a532...7d86',
		amount: '0.0001',
		token: 'BTC',
		usd: '$1,312',
	},
	{
		type: 'Incoming',
		time: '1711052345',
		address: '0x3a532...7d86',
		amount: '0.0242',
		token: 'ETH',
		usd: '$5,312',
	},
	{
		type: 'Incoming',
		time: '1711034345',
		address: '0x3a532...7d86',
		amount: '0.0242',
		token: 'ETH',
		usd: '$5,312',
	},
	{
		type: 'Incoming',
		time: '1711444345',
		address: '0x3a532...7d86',
		amount: '0.0242',
		token: 'ETH',
		usd: '$5,312',
	},
]

const RecentTransactionCard = () => {
	const [txByDate, setTxByDate] = useState<object | undefined>()

	useEffect(() => {
		const txByDate = transactions.reduce((acc, tx) => {
			const date = new Date(+tx.time * 1000)
			const key = date.toDateString()

			if (!acc[key]) {
				acc[key] = []
			}

			acc[key].push(tx)

			return acc
		}, {})

		setTxByDate(txByDate as any)
	}, [])

	if (!txByDate) {
		return null
	}

	return (
		<div className="flex w-full flex-col justify-between rounded-[2rem] p-4">
			<div className="mb-auto flex h-min flex-col">
				<TitleButton title="Recent Transactions" linkName="View all" />
				{Object.entries(txByDate).map(([date, txs], i) => (
					<div key={date} className="">
						<div className="translate-y-4">
							<hr className="z-10 border-zinc-200" />
							<p className="z-20 mx-auto w-fit -translate-y-4 bg-white px-5 text-lg font-light text-zinc-800">
								{i === 0 ? 'today' : formatDate(date, true)}
							</p>
						</div>
						<div className="flex flex-col">
							{txs.map((tx) => (
								<div
									key={tx.time}
									className="flex cursor-pointer items-center justify-between rounded-2xl px-4 py-1 transition-colors duration-200 ease-in-out hover:bg-zinc-100"
								>
									<div className="flex items-center gap-3">
										{tx.type === 'Outgoing' ? (
											<BsArrowRightCircle className="h-7 w-7 text-red-600"></BsArrowRightCircle>
										) : (
											<BsArrowLeftCircle className="h-7 w-7 text-green-600"></BsArrowLeftCircle>
										)}
										<div className="grid">
											<p className="text-base font-medium text-zinc-900">{tx.type}</p>
											<p className="text-sm font-light text-zinc-500">{tx.address}</p>
										</div>
									</div>
									<div className="grid text-right">
										<p
											className={`text-base font-light ${tx.type === 'Outgoing' ? 'text-red-700' : 'text-green-700'}`}
										>
											{tx.type === 'Outgoing' ? '-' : '+'}
											{tx.amount} {tx.token}
										</p>
										<p className="text-sm font-extralight text-zinc-500">{tx.usd}</p>
									</div>
								</div>
							))}
						</div>
					</div>
				))}
			</div>
		</div>
	)
}

export default RecentTransactionCard
