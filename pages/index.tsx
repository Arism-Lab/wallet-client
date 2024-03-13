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
	const localUsersReducer = useAppSelector((state) => state.localUsersReducer)

	console.log({ sessionUserReducer, localUsersReducer })
	console.info({ sessionUserReducer, localUsersReducer })

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
				<div className="mx-auto flex h-screen w-screen flex-col items-center justify-between p-7 text-center">
					<div className="flex w-full justify-evenly">
						{nodes.map((node, index) => (
							<NodeCard key={index} node={node} />
						))}
						<button className="flex select-none place-items-center rounded-2xl p-5 hover:bg-primary-100">
							<HiOutlinePlus className="h-7 w-7 rounded-full text-xl text-black" />
							<p className="ml-5 font-medium">Register an Arism Node</p>
						</button>
					</div>

					<h1 className="w-5/6 py-28 text-6xl font-extralight leading-snug text-gray-800">
						A Distributed Key and Identifier Management Protocol powered by{' '}
						<span className="bg-primary-800 px-3 text-white">
							Zero Knowledge
						</span>
					</h1>
					{sessionUserReducer.data ? (
						<Link href="/dashboard">
							<Card className="relative px-8 py-6 text-xl group-hover:text-primary-800">
								<p>Open dashboard</p>
							</Card>
						</Link>
					) : (
						<div className="flex w-full flex-col gap-10 text-2xl">
							<div className="mx-auto grid gap-5">
								<p className="font-extralight">
									add your accounts to the wallet
								</p>
								<div className="mx-auto grid w-fit grid-cols-2 gap-5 text-lg">
									<button
										onClick={(e) => handleSignIn(e)}
										className="card hover:bg-primary-100"
									>
										<Image
											src="https://uxwing.com/wp-content/themes/uxwing/download/brands-and-social-media/google-color-icon.png"
											alt="Google"
											height={48}
											width={48}
										/>
										<p>
											Sign in via <span className="font-medium">Google</span>
										</p>
									</button>
									<button
										onClick={(e) => handleSignIn(e)}
										className="card hover:bg-primary-100"
									>
										<Image
											src="https://uxwing.com/wp-content/themes/uxwing/download/brands-and-social-media/metamask-icon.png"
											alt="Google"
											height={48}
											width={48}
										/>
										<p>
											Sign in via <span className="font-medium">Metamask</span>
										</p>
									</button>
								</div>
								{localUsersReducer.data.length > 0 && (
									<div className="mx-auto grid gap-5">
										<p className="font-extralight">
											or continue with existed accounts on this device
										</p>
										<AccountCardSlider localUsers={localUsersReducer.data} />
									</div>
								)}
							</div>
						</div>
					)}
				</div>
			</div>
		</>
	)
}

export default Home
