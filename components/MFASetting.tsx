'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'

import Alert from '@components/Common/Alert'
import { enableMfa } from '@helpers/recoveryFactor'

import Button from './Common/Button'

interface MFASettingProps {
	userSession: SessionUser
	enabledMfa: boolean
}
const MFASetting = ({ userSession, enabledMfa }: MFASettingProps) => {
	const [password, setPassword] = useState<string>('')
	const [currentEnabledMfa, setCurrentEnabledMfa] = useState<boolean>(enabledMfa)
	const [onSubmit, setOnSubmit] = useState<boolean>(false)
	const router = useRouter()

	const handleSubmit = async () => {
		setOnSubmit(true)
		await enableMfa(userSession, password)
		setCurrentEnabledMfa(true)
		router.refresh()
		setOnSubmit(false)
	}

	return (
		<>
			<Alert
				type={currentEnabledMfa ? 'success' : 'error'}
				title={currentEnabledMfa ? 'MFA Enabled' : 'MFA Disabled'}
				description={
					currentEnabledMfa
						? 'You can now recover your account or login with other devices using your password.'
						: 'You will lose this account forever if you clear the local storage or lose this device.'
				}
			/>

			{!currentEnabledMfa && (
				<>
					<label htmlFor="password" className="mt-10 text-lg font-semibold">
						Password
					</label>
					<input
						type="password"
						id="password"
						name="password"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						className="text-input my-5 w-1/3 p-2"
					/>
					<Button variant="primary" size="lg" onClick={handleSubmit} onLoading={onSubmit}>
						Submit
					</Button>
				</>
			)}
		</>
	)
}

export default MFASetting
