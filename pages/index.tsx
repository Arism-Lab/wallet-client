import Card from '@components/Card'
import Image from '@components/Image'
import Link from '@components/Link'
import LoggedAccountCard from '@components/LoggedAccountCard'
import { HomeSEO } from '@components/PageSEO'
import { getNodes } from '@helpers/wallet'
import { deriveMetadatas } from '@libs/storage'
import { TA } from '@types'
import { signIn, useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'
import { HiOutlinePlus } from 'react-icons/hi2'

const Home = (): JSX.Element => {
	const { data: session } = useSession()
	const [metadatas, setMetadatas] = useState<TA.MetadataStorage[]>([])
	const [nodes, setNodes] = useState<TA.Node[]>([])

	const handleSignIn = (e: React.MouseEvent<HTMLButtonElement>) => {
		e.preventDefault()
		signIn('google', { callbackUrl: '/login' })
	}

	useEffect(() => {
		setMetadatas(deriveMetadatas())
		;(async () => {
			const nodes = await getNodes()
			setNodes(nodes)
		})()
	}, [])

	return (
		<>
			<HomeSEO />
			<div className="bg-global flex min-h-screen w-screen">
				<main>
					<div className="mx-auto flex h-full w-screen flex-col items-center justify-center text-center">
						<div className="flex w-full justify-evenly">
							{nodes.map((node, index) => (
								<div
									className="m-5 flex select-none place-items-center rounded-2xl p-5"
									key={index}
								>
									<Image
										src="https://static.vecteezy.com/system/resources/thumbnails/017/193/863/small/cube-purple-3d-png.png"
										alt="Node"
										height={50}
										width={50}
									/>
									<p className="ml-5 font-medium">{node.url}</p>
									<div className="relative mb-auto mr-auto -translate-y-1">
										<div className="live-animated"></div>
										<div className="dot"></div>
									</div>
								</div>
							))}
							<button className="m-5 flex select-none place-items-center rounded-2xl p-5 hover:bg-gray-200">
								<HiOutlinePlus className="h-10 w-10 rounded-full p-2 text-xl text-black" />
								<p className="ml-5 font-medium">Register an Arism Node</p>
							</button>
						</div>

						<h1 className="w-5/6 py-28 text-6xl font-extralight leading-snug text-gray-800">
							A Distributed Key and Identifier Management Protocol powered by{' '}
							<span className="bg-primary-800 px-3 text-white">
								Zero Knowledge
							</span>
						</h1>
						{session ? (
							<Link href="/dashboard">
								<Card className="relative px-8 py-6 text-xl group-hover:text-primary-800">
									<p>Open dashboard</p>
								</Card>
							</Link>
						) : (
							<div className="grid gap-10 text-2xl">
								<div className="grid gap-5">
									<p className="font-extralight">
										continue with existed accounts on this device
									</p>
									<div className="grid w-fit grid-cols-3 gap-5 text-base">
										{metadatas.map((metadata, index) => (
											<LoggedAccountCard key={index} metadata={metadata} />
										))}
									</div>
								</div>
								<div className="grid gap-5">
									<p className="font-extralight">or add new accounts</p>
									<div className="mx-auto grid w-fit grid-cols-2 gap-5 text-lg">
										<button
											onClick={(e) => handleSignIn(e)}
											className="flex select-none place-items-center gap-5 rounded-2xl bg-white p-5"
										>
											<Image
												src="https://uxwing.com/wp-content/themes/uxwing/download/brands-and-social-media/google-color-icon.png"
												alt="Google"
												height={50}
												width={50}
											/>
											<p className="font-medium">Sign in via Google</p>
										</button>
										<button
											onClick={(e) => handleSignIn(e)}
											className="flex select-none place-items-center gap-5 rounded-2xl bg-white p-5"
										>
											<Image
												src="https://uxwing.com/wp-content/themes/uxwing/download/brands-and-social-media/metamask-icon.png"
												alt="Google"
												height={50}
												width={50}
											/>
											<p className="font-medium">Sign in via Metamask</p>
										</button>
									</div>
								</div>
							</div>
						)}
					</div>
				</main>
			</div>
		</>
	)
}

export default Home
