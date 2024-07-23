import React from 'react'

import Card from '@components/Card'
import Link from '@components/Link'

const LostAccount = () => {
	return (
		<main className="bg-global relative flex h-screen w-screen">
			<div className="mx-auto my-auto grid w-full place-items-center justify-items-center gap-10 p-10 text-3xl font-extralight">
				<p>{`You cannot sign in your account on new device since you haven't turned on MFA.`}</p>
				<p className="mb-10">{`If you have cleared the local storage or lost the original device, you will loss access to this account forever.`}</p>
				<Link href="/">
					<Card className="relative px-8 py-6 text-xl font-light group-hover:text-primary-800">
						<p>Go back home</p>
					</Card>
				</Link>
			</div>
		</main>
	)
}

export default LostAccount
