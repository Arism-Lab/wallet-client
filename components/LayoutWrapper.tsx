import { headers } from 'next/headers'
import Image from 'next/image'
import { redirect } from 'next/navigation'
import { Session } from 'next-auth'
import { IoIosWarning } from 'react-icons/io'

import Link from '@components/Link'
import siteMetadata from '@data/siteMetadata.json'
import { auth } from '@libs/auth'

import LogoutButton from './Home/LogoutButton'

const LayoutWrapper = async ({ children }) => {
	const heads = headers()
	const pathname = heads.get('x-pathname')
	const isHome = pathname === '/' || pathname === '/login'
	const session: Session | null = await auth()

	if (!session && !isHome) {
		redirect('/')
	}

	const pageTitle = siteMetadata.internalLinks.find(
		(item) => item.path === pathname
	)?.title

	if (isHome) {
		return <>{children}</>
	}

	return (
		<div className="bg-global flex h-screen w-screen">
			<div className="flex w-1/5 flex-col text-zinc-800">
				<Link
					className="mx-auto flex place-items-center items-center py-10"
					href="/"
				>
					<Image
						alt="Arism logo"
						src="/static/logo.png"
						width={65}
						height={65}
					/>
					<div className="flex flex-col">
						<h1 className="text-4xl font-extralight">Arism Wallet</h1>
						<p className="text-center text-xs font-light tracking-widest">
							THE NEXT-GEN WALLET
						</p>
					</div>
				</Link>
				<div className="flex flex-col items-center justify-center space-y-2 transition duration-150 ease-in-out">
					{siteMetadata.internalLinks.map((item, index) => (
						<Link
							href={item.path}
							key={index}
							className={`${
								pathname === item.path
									? 'pointer-events-none rounded-full bg-zinc-900 text-white'
									: 'text-zinc-500'
							} mx-auto flex h-14 w-5/6 items-center justify-items-start py-3 transition-all duration-200 ease-in-out hover:rounded-full hover:bg-black hover:bg-opacity-10`}
						>
							{/* {item.icon({
								active: pathname === item.path,
								className: 'h-6 w-1/3',
							})} */}
							<span className="w-2/3 text-base">{item.title}</span>
						</Link>
					))}
				</div>
				<div className="mb-10 ml-[20%] mt-auto flex flex-col space-y-5">
					{siteMetadata.externalLinks.map((item) => (
						<Link
							href={item.url}
							key={item.name}
							className="flex items-start text-base text-zinc-500 transition-all duration-200 ease-in-out hover:text-black"
						>
							{item.name}
						</Link>
					))}
				</div>
			</div>
			<hr className="h-full w-[0.75px] self-center bg-black bg-opacity-10" />
			<main className="h-full w-full">
				<div className="flex h-full w-full flex-col p-12">
					<div className="flex w-full justify-between">
						<p className="text-5xl font-extrabold">{pageTitle}</p>
						<div className="flex place-items-center gap-5">
							<div className="flex items-center space-x-2 ">
								<button className="group flex h-12 place-items-center rounded-full bg-white py-2 pl-3 pr-2 text-sm transition-all duration-200 ease-in-out hover:bg-yellow-600">
									<IoIosWarning className="h-5 w-5 text-yellow-600 group-hover:text-white " />
									<p className="px-2 text-black group-hover:text-white">
										Turn on MFA
									</p>
								</button>
							</div>
							<hr className="h-full w-[0.75px] bg-black bg-opacity-10" />
							<div className="flex items-center space-x-2 ">
								<button className="flex place-items-center rounded-full bg-white py-2 pl-3 pr-2 text-sm transition-all duration-200 ease-in-out hover:bg-primary-600 hover:text-white">
									<Image
										alt="User avatar"
										src={(session as any)?.info?.image ?? ''}
										width={30}
										height={30}
										className="rounded-full"
									/>
									<p className="px-2">{(session as any)?.info?.name ?? ''}</p>
								</button>
								<LogoutButton />
							</div>
						</div>
					</div>
					<div className="h-full w-full py-3">{children}</div>
				</div>
			</main>
		</div>
	)
}

export default LayoutWrapper
