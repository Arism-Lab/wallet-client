import { signOut } from 'next-auth/react'
import React from 'react'

import Card from '@components/Card'

const LostAccount = () => {
	const logout = async () => {
		await signOut({ callbackUrl: '/' })
	}

	return (
		<main className="bg-global relative flex h-screen w-screen">
			<div className="m-auto grid w-full place-items-center justify-items-center gap-10 p-10 text-3xl font-extralight">
				<p>{`You cannot sign in your account on new device since you haven't turned on MFA.`}</p>
				<p className="mb-10">{`If you have cleared the local storage or lost the original device, you will loss access to this account forever.`}</p>
				<button onClick={() => logout()}>
					<Card className="relative px-8 py-6 text-xl font-light group-hover:text-primary-800">
						<p>Sign out</p>
					</Card>
				</button>
			</div>
		</main>
	)
}

export default LostAccount
