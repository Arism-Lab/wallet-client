'use client'

import Image from 'next/image'
import { signIn } from 'next-auth/react'

const LoginButton = () => {
	const handleSignIn = () => {
		signIn('google', { callbackUrl: '/login' })
	}

	return (
		<div className="mx-auto grid gap-5">
			<button
				onClick={() => handleSignIn()}
				className="card-secondary w-fit text-center text-lg font-light tracking-wide"
			>
				<Image
					src="https://uxwing.com/wp-content/themes/uxwing/download/brands-and-social-media/google-color-icon.png"
					alt="Google"
					height={35}
					width={35}
				/>
				<p className="w-full">
					Sign in via <span className="font-medium">Google</span>
				</p>
			</button>
		</div>
	)
}

export default LoginButton
