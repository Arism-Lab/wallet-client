import { Metadata } from 'next'
import { useState } from 'react'

import siteMetadata from '@data/siteMetadata.json'
import { constructRecoveryFactor } from '@helpers/recoveryFactor'
import { useAppSelector } from '@store'

const metadata = siteMetadata.internalLinks.find(
	(link) => link.title === 'Dashboard'
)!

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

const Settings = () => {
	const [password, setPassword] = useState('')

	const sessionUserReducer = useAppSelector((state) => state.sessionUserReducer)

	const handleSubmit = async () => {
		await constructRecoveryFactor(sessionUserReducer.data!, password)
	}

	return (
		<>
			<div className="container mx-auto px-4">
				<h1 className="my-8 text-3xl font-bold">Settings</h1>
				<div className="flex flex-col">
					<label htmlFor="password" className="text-lg font-semibold">
						Password
					</label>
					<input
						type="password"
						id="password"
						name="password"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						className="rounded-md border border-zinc-300 p-2"
					/>
					<button
						onClick={handleSubmit}
						className="mt-4 rounded-md bg-blue-500 p-2 text-white"
					>
						Submit
					</button>
				</div>
			</div>
		</>
	)
}

export default Settings
