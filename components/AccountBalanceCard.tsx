import React from 'react'
import {
	BsArrowCounterclockwise,
	BsArrowUpRightCircle,
	BsClockHistory,
} from 'react-icons/bs'
import { PiArrowLineUpRightLight } from 'react-icons/pi'

const AccountBalanceCard = () => {
	return (
		<div className="bg-card flex w-full flex-col justify-between rounded-[2rem] p-5">
			<p className="dashboard-title">Account Balance</p>
			<div className="flex justify-between">
				<p className="my-auto space-x-2 tracking-wide text-black">
					<span className="text-5xl font-medium">$1,312</span>
					<span className="text-3xl font-light">.255</span>
				</p>
				<div className="flex gap-5">
					<div className="grid gap-1">
						<BsArrowUpRightCircle className="h-16 w-16 rounded-full bg-zinc-800 p-5 text-white"></BsArrowUpRightCircle>
						<p className="text-center text-sm font-light text-zinc-800">Send</p>
					</div>
					<div className="grid gap-1">
						<BsClockHistory className="h-16 w-16 rounded-full bg-zinc-800 p-5 text-white"></BsClockHistory>
						<p className="text-center text-sm font-light text-zinc-800">
							Inspect
						</p>
					</div>
					<div className="grid gap-1">
						<BsArrowCounterclockwise className="h-16 w-16 rounded-full bg-zinc-800 p-5 text-white"></BsArrowCounterclockwise>
						<p className="text-center text-sm font-light text-zinc-800">
							Stake
						</p>
					</div>
				</div>
			</div>
			<div className="flex items-center justify-start gap-5">
				<div className="flex place-items-center items-center gap-1 rounded-full bg-white px-4 py-2 text-sm font-light text-green-600">
					<p className="my-auto h-full">+1,25%</p>
					<PiArrowLineUpRightLight className="h-5 w-5 " />
				</div>
				<div className="text-sm font-medium text-zinc-900 underline underline-offset-4">
					1 day
				</div>
				<div className="text-sm font-light text-zinc-500">1 week</div>
				<div className="text-sm font-light text-zinc-500">1 month</div>
			</div>
		</div>
	)
}

export default AccountBalanceCard
