import { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { HiOutlinePlus } from 'react-icons/hi2'

import { N } from '@common'
import AccountCardSlider from '@components/AccountCardSlider'
import Card from '@components/Card'
import LoginButton from '@components/Home/LoginButton'
import Link from '@components/Link'
import NodeCard from '@components/NodeCard'
import { ping } from '@helpers/networkFactor'
import { auth } from '@libs/auth'
import siteMetadata from 'data/siteMetadata.json'

export const generateMetadata = (): Metadata => {
	return {
		metadataBase: new URL(siteMetadata.siteUrl),
		title: siteMetadata.title + ' | ' + siteMetadata.headerTitle,
		description: siteMetadata.description,
		openGraph: {
			images: [siteMetadata.siteUrl + siteMetadata.siteBanner],
		},
	}
}

const Home = async () => {
	const nodes: { node: ArismNode; alive: boolean }[] = await Promise.all(
		N.NODES.map((node) => ping(node.url).then((alive) => ({ node, alive })))
	)

	const session: SessionUser | null = await auth()

	return (
		<>
			<div className="bg-global flex h-screen w-screen">
				<div className="mx-auto flex h-screen w-screen flex-col items-center p-7 text-center">
					<div className="flex w-full justify-evenly">
						{nodes.map((node, index) => (
							<NodeCard key={index} node={node} />
						))}
						<button className="flex select-none place-items-center rounded-2xl p-5 hover:bg-primary-100">
							<HiOutlinePlus className="h-5 w-5 rounded-full text-xl text-black" />
							<p className="ml-5 text-sm font-medium">Register an Arism Node</p>
						</button>
					</div>

					<div className="my-auto grid w-5/6 place-items-center items-center gap-10">
						<h1 className="text-5xl font-extralight leading-snug text-gray-800">
							A Distributed Key and Identifier Management Protocol powered by{' '}
							<span className="bg-primary-800 px-3 text-white">Zero Knowledge</span>
						</h1>
						{session ? (
							<button onClick={redirect('/dashboard')}>
								<Card className="relative px-8 py-6 text-xl font-light group-hover:text-primary-800">
									<p>Open dashboard</p>
								</Card>
							</button>
						) : (
							<div className="flex w-full flex-col gap-10 text-2xl">
								<LoginButton />
							</div>
						)}
					</div>
					{!session && <AccountCardSlider />}
				</div>
			</div>
		</>
	)
}

export default Home
