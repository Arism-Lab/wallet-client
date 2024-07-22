'use client'

import { useRouter } from 'next/navigation'
import { signIn } from 'next-auth/react'
import React, { useEffect, useState } from 'react'
import { AiOutlineClose } from 'react-icons/ai'
import { BsTrash3 } from 'react-icons/bs'
import { LuChevronLeft, LuChevronRight } from 'react-icons/lu'

import Image from '@components/Image'
import { getPrivateIndices } from '@helpers/metadata'
import { checkMfa } from '@helpers/wallet'
import { formatDate } from '@libs/date'
import { removeLocalUser } from '@libs/local'

type AccountCardProps = {
	localUser: LocalUser
	click: () => void
	hidden: boolean
	focus: boolean
}

const AccountCard = ({ localUser, click, hidden, focus }: AccountCardProps) => {
	const router = useRouter()

	const [removeConfirm, setRemoveConfirm] = useState(false)
	const [password, setPassword] = useState('')
	const [enabledMfa, setEnabledMfa] = useState(false)
	const [privateIndices, setPrivateIndices] = useState<PrivateIndex[]>([])

	const expanded = focus && !hidden

	useEffect(() => {
		;(async () => {
			const enabledMfa = await checkMfa(localUser.info.email)
			setEnabledMfa(enabledMfa)

			const privateIndices = await getPrivateIndices(localUser.info.email)
			setPrivateIndices(privateIndices)
		})()
	}, [])

	useEffect(() => {
		setRemoveConfirm(false), [expanded]
	}, [expanded])

	const removeAccount = () => {
		removeLocalUser(localUser.info.email)
	}

	const handleGoogleSignIn = (e: React.MouseEvent<HTMLButtonElement>) => {
		e.preventDefault()
		signIn('google', {
			callbackUrl: '/login',
			login_hint: localUser.info.email,
			prompt: 'select_account+consent',
		})
	}

	const handlePasswordSignIn = async () => {
		router.push('/login')
	}

	return (
		<div className="relative mx-auto">
			<div
				className="absolute inset-x-0 -top-0 z-10 h-0 w-full transform select-none items-center justify-center gap-2 truncate rounded-2xl border-2 border-red-600 bg-white px-5 pb-3 pt-2 text-lg opacity-0 duration-300 ease-in-out aria-expanded:grid aria-expanded:h-max aria-expanded:-translate-y-28 aria-expanded:opacity-100"
				aria-expanded={removeConfirm}
			>
				<p className="font-light">
					Are you sure to remove <span className="font-medium">{localUser.info.name}</span> account? Since you have
					turned on MFA, you will need to enter your password manually when logging in via Google next time.
				</p>
				<button
					className="text-medium mx-auto flex w-min gap-5 rounded-lg border-2 border-red-600  bg-red-600 px-20 pb-1 text-white hover:border-red-800 hover:bg-red-800"
					onClick={() => removeAccount()}
				>
					remove
				</button>
			</div>
			<button
				className="card-secondary mx-auto flex w-full cursor-default justify-between overflow-hidden truncate transition-all duration-300 ease-in-out disabled:w-[0px] disabled:p-0 disabled:opacity-0 aria-expanded:w-[90vw]"
				disabled={hidden}
				aria-expanded={expanded}
			>
				{expanded ? (
					<button
						className="grid h-12 w-12 place-items-center justify-items-center rounded-full border-2 border-primary-600 p-2 text-2xl text-primary-600 hover:bg-primary-100"
						onClick={click}
					>
						<LuChevronLeft />
					</button>
				) : (
					<Image
						src={localUser.info.image!}
						alt={localUser.info.email}
						height={48}
						width={48}
						className="rounded-full"
					/>
				)}
				<div className="grid  text-left">
					<p className="truncate-1 w-min overflow-hidden truncate text-ellipsis font-medium">
						{localUser.info.name} ({formatDate(localUser.lastLogin, true)})
					</p>
					<p className="truncate-1 w-min overflow-hidden truncate text-ellipsis font-light text-zinc-500">
						{localUser.info.email}
					</p>
				</div>
				{expanded ? (
					<>
						<hr className="h-full w-[0.5px] bg-zinc-300" />
						<div className="flex flex-col text-center">
							<p className="font-medium">
								{privateIndices.length} key{privateIndices.length > 1 && 's'} associated to this account
							</p>
							<p className="font-light text-zinc-500">last login since {formatDate(localUser.lastLogin)}</p>
						</div>
						<button
							className="grid h-12 w-12 transform place-items-center justify-items-center rounded-full border-2 border-red-600 p-2 text-xl text-red-600 transition-all duration-300 ease-in-out hover:bg-red-100 aria-disabled:rotate-180 aria-disabled:border-primary-600 aria-disabled:text-primary-600 aria-disabled:hover:bg-primary-100"
							onClick={() => setRemoveConfirm(!removeConfirm)}
							aria-disabled={removeConfirm}
						>
							{removeConfirm ? <AiOutlineClose /> : <BsTrash3 />}
						</button>
						<hr className="h-full w-[0.5px] bg-zinc-300" />
						<button onClick={(e) => handleGoogleSignIn(e)} className="">
							<Image
								src="https://uxwing.com/wp-content/themes/uxwing/download/brands-and-social-media/google-color-icon.png"
								alt="Google"
								height={48}
								width={48}
								className="hover:opacity-50"
							/>
						</button>
						<p className="text-lg font-light text-zinc-500">or</p>
						<input
							type="password"
							className="relative rounded-lg border-2 border-zinc-300 px-4 py-2 text-lg font-light ring-primary-500  hover:bg-white hover:text-primary-700 focus:border-opacity-0 focus:outline-none focus:ring-2"
							checked={password !== ''}
							onChange={(e) => setPassword(e.target.value)}
						/>
						<button
							className="grid h-12 w-12 cursor-pointer place-items-center justify-items-center rounded-full border-2 border-primary-600 text-2xl text-primary-600 hover:bg-primary-100 disabled:pointer-events-none disabled:border-zinc-400 disabled:text-zinc-400 disabled:opacity-50"
							disabled={password === ''}
							onClick={() => handlePasswordSignIn()}
						>
							<LuChevronRight />
						</button>
					</>
				) : enabledMfa ? (
					<LuChevronRight
						className="h-12 w-12 cursor-pointer rounded-full border-2 border-primary-600 p-2 text-xl text-primary-600 hover:bg-primary-100"
						onClick={click}
					/>
				) : (
					<button onClick={(e) => handleGoogleSignIn(e)} className="">
						<Image
							src="https://uxwing.com/wp-content/themes/uxwing/download/brands-and-social-media/google-color-icon.png"
							alt="Google"
							height={48}
							width={48}
							className="hover:opacity-50"
						/>
					</button>
				)}
			</button>
		</div>
	)
}

export default AccountCard
