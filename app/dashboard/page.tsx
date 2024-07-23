import { Metadata } from 'next'

import AccountBalanceCard from '@components/AccountBalanceCard'
import RecentTransactionCard from '@components/RecentTransactionCard'
import siteMetadata from '@data/siteMetadata.json'

const metadata = siteMetadata.internalLinks.find((link) => link.title === 'Dashboard')!

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

const Dashboard = async () => {
	return (
		<>
			<div className="grid size-full grid-cols-2 gap-5 pt-10">
				<div className="grid grid-rows-3 rounded-[3rem] bg-white p-4 ">
					<AccountBalanceCard />
					<div className="row-span-2">
						<RecentTransactionCard />
					</div>
				</div>
				<div className="grid size-full grid-rows-3 gap-5 rounded-[3rem]">
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
