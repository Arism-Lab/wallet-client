import { TA } from '@types'
import React, { useEffect, useState } from 'react'
import Image from './Image'
import { LuChevronLeft, LuChevronRight } from 'react-icons/lu'
import { formatDate } from '@libs/date'
import { signIn } from 'next-auth/react'
import { getRecoveryKey } from '@helpers/metadata'
import { formatKey } from '@libs/blockchain'
import { BsTrash3 } from 'react-icons/bs'
import { removeMetadata, storeMetadata, storeWallet } from '@libs/storage'
import { useRouter } from 'next/navigation'
import { deriveRecoveryFactor } from '@helpers/recoveryFactor'
import { deriveDeviceFactor } from '@helpers/deviceFactor'
import {
	constructPrivateFactor,
	verifyPrivateKey,
} from '@helpers/privateFactor'
import { getPublicKeyFromPrivateKey } from '@common/secp256k1'

const AccountCard = ({
	metadata,
	click,
	hidden,
	focus,
}: {
	metadata: TA.MetadataStorage
	click: () => void
	hidden: boolean
	focus: boolean
}): JSX.Element => {
	const [removeConfirm, setRemoveConfirm] = useState(false)
	const [password, setPassword] = useState('')
	const [enabledMfa, setEnabledMfa] = useState(false)

	useEffect(() => {
		;(async () => {
			const mfa = await getRecoveryKey(metadata.user.email!)
			console.log({ mfa })
			setEnabledMfa(mfa != '0')
		})()
	}, [])

	const router = useRouter()
	const removeAccount = () => {
		removeMetadata(metadata.user.email!)
		router.refresh()
	}

	const handleGoogleSignIn = (e: React.MouseEvent<HTMLButtonElement>) => {
		e.preventDefault()
		signIn('google', {
			callbackUrl: '/login',
			login_hint: metadata.user.email,
			prompt: 'select_account+consent',
		})
	}

	const handlePasswordSignIn = async () => {
		const recoveryFactor = await deriveRecoveryFactor(
			metadata.user.email!,
			password
		)
		const deviceFactor: TA.Factor = deriveDeviceFactor(
			metadata.user.email!
		) as TA.Factor
		const privateFactor: TA.Factor = constructPrivateFactor(
			recoveryFactor,
			deviceFactor
		)
		const verify = await verifyPrivateKey(metadata.user.email!, privateFactor.y)

		if (verify) {
			storeWallet({
				address: metadata.address,
				publicKey: getPublicKeyFromPrivateKey(privateFactor.y),
				privateKey: privateFactor.y.toString(16, 64),
				user: metadata.user,
			})
			storeMetadata({
				deviceFactor,
				user: metadata.user,
				address: metadata.address,
				lastLogin: new Date().toISOString(),
			})

			router.push('/dashboard')
		} else {
			alert('Invalid password')
		}
	}

	return (
		<>
			{removeConfirm && (
				<div className="absolute inset-x-0 -top-28 z-10 grid h-max w-full items-center justify-center gap-2 rounded-2xl border-2 border-primary-600 bg-white px-5 pb-3 pt-2 text-lg">
					<p className="font-light">
						Are you sure to remove{' '}
						<span className="font-medium">{metadata.user.name}</span> account?
						You can manually log in via Google again next time.
					</p>
					<div className="text-medium mx-auto flex w-1/2 gap-5">
						<button
							className="border-red w-full rounded-lg border-2 border-primary-500 px-4 pb-1 text-primary-500 hover:bg-primary-100"
							onClick={() => setRemoveConfirm(false)}
						>
							cancel
						</button>
						<button
							className="w-full rounded-lg border-2 border-red-600  bg-red-600 px-4 pb-1 text-white hover:border-red-800 hover:bg-red-800"
							onClick={() => removeAccount()}
						>
							remove
						</button>
					</div>
				</div>
			)}
			<button
				className="card relative w-fit cursor-default disabled:hidden"
				disabled={hidden}
			>
				{!hidden && focus ? (
					<LuChevronLeft
						className="h-12 w-12 cursor-pointer rounded-full border-2 border-primary-600 p-2 text-xl text-primary-600 hover:bg-primary-100"
						onClick={click}
					/>
				) : (
					<Image
						src={metadata.user.image!}
						alt={metadata.user.email!}
						height={48}
						width={48}
						className="rounded-full"
					/>
				)}
				<div className="flex flex-col text-left">
					<p className="font-medium">
						{metadata.user.name} ({formatDate(metadata.lastLogin, true)})
					</p>
					<p className="font-light text-gray-500">{metadata.user.email}</p>
				</div>
				{!hidden && focus ? (
					<>
						<hr className="h-full w-[0.5px] bg-gray-300" />
						<div className="flex flex-col text-center">
							<p className="font-medium">{formatKey(metadata.address)}</p>
							<p className="font-light text-gray-500">
								last login since {formatDate(metadata.lastLogin)}
							</p>
						</div>
						<button
							className="rounded-full border-2 border-red-600 text-red-600 hover:bg-red-100 disabled:pointer-events-none disabled:border-2 disabled:border-red-600 disabled:bg-red-100 disabled:text-red-600"
							disabled={removeConfirm}
							onClick={() => setRemoveConfirm(true)}
						>
							<BsTrash3 className="h-12 w-12 p-[12px] " />
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
