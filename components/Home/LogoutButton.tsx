'use client'

import { signOut } from 'next-auth/react'
import { AiOutlineLogout } from 'react-icons/ai'

const LogoutButton = () => {
	const logout = async () => {
		await signOut({ callbackUrl: '/' })
	}

	return (
		<button
			onClick={() => logout()}
			className="rounded-full bg-white p-2 text-red-600 transition-all duration-200 ease-in-out hover:bg-red-600 hover:text-white"
		>
			<AiOutlineLogout className="h-7 w-7" />
		</button>
	)
}

export default LogoutButton
