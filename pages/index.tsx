import { signIn } from 'next-auth/react'
import { useEffect, useState } from 'react'
import { HiOutlinePlus } from 'react-icons/hi2'

import { N } from '@common'
import AccountCardSlider from '@components/AccountCardSlider'
import Card from '@components/Card'
import Image from '@components/Image'
import Link from '@components/Link'
import NodeCard from '@components/NodeCard'
import { HomeSEO } from '@components/PageSEO'
import { getNodes } from '@helpers/networkFactor'
import { useAppSelector } from '@store'
import { TA } from '@types'

const Home = (): JSX.Element => {
	const [nodes, setNodes] = useState<{ node: TA.Node; alive: boolean }[]>(
		N.NODES.map((node) => ({ node, alive: false }))
	)

	const sessionUserReducer = useAppSelector((state) => state.sessionUserReducer)

	const handleSignIn = (e: React.MouseEvent<HTMLButtonElement>) => {
		e.preventDefault()
		signIn('google', { callbackUrl: '/login' })
	}

	useEffect(() => {
		;(async () => {
			await getNodes().then((res) =>
				setNodes(N.NODES.map((node) => ({ node, alive: res.includes(node) })))
			)
		})()
	}, [])

	return (
		<>
			<HomeSEO />
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
							<span className="bg-primary-800 px-3 text-white">
								Zero Knowledge
							</span>
						</h1>
						{sessionUserReducer.data ? (
							<Link href="/dashboard">
								<Card className="relative px-8 py-6 text-xl font-light group-hover:text-primary-800">
									<p>Open dashboard</p>
								</Card>
							</Link>
						) : (
							<div className="flex w-full flex-col gap-10 text-2xl">
								<div className="mx-auto grid gap-5">
									<button
										onClick={(e) => handleSignIn(e)}
										className="card-secondary w-fit text-center text-lg font-light tracking-wide"
									>
										<Image
											src="https://uxwing.com/wp-content/themes/uxwing/download/brands-and-social-media/google-color-icon.png"
											alt="Google"
											height={35}
											width={35}
										/>
										<p className="w-full">
											Sign in via <span className="font-medium">Google</span>
										</p>
									</button>
								</div>
							</div>
						)}
					</div>
					{!sessionUserReducer.data && <AccountCardSlider />}
				</div>
			</div>
		</>
	)
}

export default Home
