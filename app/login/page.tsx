import LoginIndicator from '@components/LoginIndicator'
import { auth } from '@libs/auth'
import { findPrivateIndices } from '@services/metadata'

const Login = async ({ password }: { password: string | undefined }) => {
	const sessionUser: SessionUser = (await auth())!
	const keys = await findPrivateIndices(sessionUser.info.email).catch(() => [])

	console.log({ keys, password, sessionUser })

	return (
		<LoginIndicator keys={keys} password={password} sessionUser={sessionUser} />
	)
}

export default Login
