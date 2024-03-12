import { TA } from '@types'
import React, { useEffect, useState } from 'react'
import Image from './Image'
import { LuChevronLeft, LuChevronRight } from 'react-icons/lu'
import { formatDate } from '@libs/date'
import { signIn } from 'next-auth/react'
import { BsTrash3 } from 'react-icons/bs'
import { removeLocals } from '@libs/storage'
import { useRouter } from 'next/navigation'
import { AiOutlineClose } from 'react-icons/ai'
import { checkMfa, signInWithPassword } from '@helpers/wallet'
import { getKeys } from '@helpers/metadata'

type AccountCardProps = {
	local: TA.UserLocal
	click: () => void
	hidden: boolean
	focus: boolean
}

const AccountCard = ({
	local,
	click,
	hidden,
	focus,
}: AccountCardProps): JSX.Element => {
	const [removeConfirm, setRemoveConfirm] = useState(false)
	const [password, setPassword] = useState('')
	const [enabledMfa, setEnabledMfa] = useState(false)
	const [keys, setKeys] = useState<TA.Key[]>([])

	useEffect(() => {
		;(async () => {
			const enabledMfa = await checkMfa(local.user.email)
			setEnabledMfa(enabledMfa)

			const keys = await getKeys(local.user.email)
			setKeys(keys)
		})()
	}, [])

	const expanded = focus && !hidden

	useEffect(() => {
		setRemoveConfirm(false), [expanded]
	}, [expanded])

	const router = useRouter()

	const removeAccount = () => {
		removeLocals(local.user.email)
		router.refresh()
	}

	const handleGoogleSignIn = (e: React.MouseEvent<HTMLButtonElement>) => {
		e.preventDefault()
		signIn('google', {
			callbackUrl: '/login',
			login_hint: local.user.email,
			prompt: 'select_account+consent',
		})
	}

	const handlePasswordSignIn = async () => {
		const success = await signInWithPassword(local.user, password)
		if (success) {
			router.push('/dashboard')
		} else {
			alert('Invalid password')
		}
	}

	return (
		<>
			<div
				className="absolute inset-x-0 -top-0 z-10 h-0 w-full transform select-none items-center justify-center gap-2 truncate rounded-2xl border-2 border-red-600 bg-white px-5 pb-3 pt-2 text-lg opacity-0 duration-300 ease-in-out aria-expanded:grid aria-expanded:h-max aria-expanded:-translate-y-28 aria-expanded:opacity-100"
				aria-expanded={removeConfirm}
			>
				<p className="font-light">
					Are you sure to remove{' '}
					<span className="font-medium">{local.user.name}</span> account? Since
					you have turned on MFA, you will need to enter your password manually
					when logging in via Google next time.
				</p>
				<button
					className="text-medium mx-auto flex w-min gap-5 rounded-lg border-2 border-red-600  bg-red-600 px-20 pb-1 text-white hover:border-red-800 hover:bg-red-800"
					onClick={() => removeAccount()}
				>
					remove
				</button>
			</div>
			<button
				className="card mx-auto flex w-full cursor-default justify-between overflow-hidden truncate transition-all duration-300 ease-in-out disabled:w-[0px] disabled:p-0 disabled:opacity-0 aria-expanded:w-[90vw]"
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
						src={local.user.image!}
						alt={local.user.email}
						height={48}
						width={48}
						className="rounded-full"
					/>
				)}
				<div className="grid  text-left">
					<p className="truncate-1 w-min overflow-hidden truncate text-ellipsis font-medium">
						{local.user.name} ({formatDate(local.lastLogin, true)})
					</p>
					<p className="truncate-1 w-min overflow-hidden truncate text-ellipsis font-light text-gray-500">
						{local.user.email}
					</p>
				</div>
				{expanded ? (
					<>
						<hr className="h-full w-[0.5px] bg-gray-300" />
						<div className="flex flex-col text-center">
							<p className="font-medium">
								{keys.length} key{keys.length > 1 && 's'} associated to this
								account
							</p>
							<p className="font-light text-gray-500">
								last login since {formatDate(local.lastLogin)}
							</p>
						</div>
						<button
							className="grid h-12 w-12 transform place-items-center justify-items-center rounded-full border-2 border-red-600 p-2 text-xl text-red-600 transition-all duration-300 ease-in-out hover:bg-red-100 aria-disabled:rotate-180 aria-disabled:border-primary-600 aria-disabled:text-primary-600 aria-disabled:hover:bg-primary-100"
							onClick={() => setRemoveConfirm(!removeConfirm)}
							aria-disabled={removeConfirm}
						>
							{removeConfirm ? <AiOutlineClose /> : <BsTrash3 />}
						</button>
						<hr className="h-full w-[0.5px] bg-gray-300" />
						<button onClick={(e) => handleGoogleSignIn(e)} className="">
							<Image
								src="https://uxwing.com/wp-content/themes/uxwing/download/brands-and-social-media/google-color-icon.png"
								alt="Google"
								height={48}
								width={48}
								className="hover:opacity-50"
							/>
						</button>
						<p className="text-lg font-light text-gray-500">or</p>
						<input
							type="password"
							className="relative rounded-lg border-2 border-gray-300 px-4 py-2 text-lg font-light ring-primary-500  hover:bg-white hover:text-primary-700 focus:border-opacity-0 focus:outline-none focus:ring-2"
							checked={password !== ''}
							onChange={(e) => setPassword(e.target.value)}
						/>
						<button
							className="grid h-12 w-12 cursor-pointer place-items-center justify-items-center rounded-full border-2 border-primary-600 text-2xl text-primary-600 hover:bg-primary-100 disabled:pointer-events-none disabled:border-gray-400 disabled:text-gray-400 disabled:opacity-50"
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
		</>
	)
}

export default AccountCard
