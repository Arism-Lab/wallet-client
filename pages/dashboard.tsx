import { GetStaticProps } from 'next'
import {
	BsArrowCounterclockwise,
	BsArrowUpRightCircle,
	BsClockHistory,
} from 'react-icons/bs'
import { HiArrowRight } from 'react-icons/hi2'
import {
	PiArrowLineDownLeftLight,
	PiArrowLineUpRightLight,
} from 'react-icons/pi'

import AccountBalanceCard from '@components/AccountBalanceCard'
import { PageSEO } from '@components/PageSEO'
import RecentTransactionCard from '@components/RecentTransactionCard'
import sideNavigation from '@data/sideNavigation'

export const getStaticProps: GetStaticProps = async () => {
	const siteInfo = sideNavigation.find((item) => item.path === '/dashboard')

	return {
		props: {
			title: siteInfo?.title,
			description: siteInfo?.description,
		},
	}
}

const Dashboard = ({ title, description }: PageSEOProps) => {
	return (
		<>
			<PageSEO title={title} description={description} />
			<div className="grid h-full w-full grid-cols-2 gap-5 pt-10">
				<div className="grid grid-rows-3 rounded-[3rem] bg-white p-4 ">
					<AccountBalanceCard />
					<div className="row-span-2">
						<RecentTransactionCard />
					</div>
				</div>
				<div className="grid h-full w-full grid-rows-3 gap-5 rounded-[3rem]">
					<div className="row-span-2 rounded-[2rem] bg-white p-5">
						<p className="dashboard-title">Your Assets</p>
					</div>
					<div className="rounded-[2rem] bg-white p-5">
						<p className="dashboard-title">Your Keys</p>
					</div>
				</div>
			</div>
		</>
	)
}

export default Dashboard
