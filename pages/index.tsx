import Card from '@components/Card'
import Link from '@components/Link'
import { HomeSEO } from '@components/PageSEO'
import { signIn, useSession } from 'next-auth/react'

const Home = (): JSX.Element => {
	const { data: session } = useSession()

	const handleSignIn = (e: React.MouseEvent<HTMLButtonElement>) => {
		e.preventDefault()
		signIn('google', { callbackUrl: '/login' })
	}

	return (
		<>
			<HomeSEO />
			<div className="bg-global flex h-screen w-screen">
				<main>
					<div className="mx-auto flex h-full w-5/6 flex-col items-center justify-center space-y-10 text-center">
						<h1 className="text-6xl font-extralight leading-snug text-gray-800">
							A Distributed Key and Identifier Management Protocol powered by{' '}
							<span className="bg-primary-800 px-3 text-white">
								Zero Knowledge
							</span>
						</h1>
						{session ? (
							<Link href="/dashboard">
								<Card className="relative px-8 py-6 text-xl group-hover:text-primary-800">
									<p>Get Started</p>
								</Card>
							</Link>
						) : (
							<button onClick={(e) => handleSignIn(e)}>
								<Card className="relative px-8 py-6 text-xl group-hover:text-primary-800">
									<p>Get Started</p>
								</Card>
							</button>
						)}
					</div>
				</main>
			</div>
		</>
	)
}

export default Home
