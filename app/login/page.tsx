import LoginIndicator from '@components/LoginIndicator'
import { auth } from '@libs/auth'
import { find } from '@services/metadata'

interface LoginProps {
	info: Info
	password: string
}
const Login = async ({ params }: { params: LoginProps }) => {
	if (params.info && params.password) {
		const userMetadata: Metadata = (await find(params.info.email))!

		return <LoginIndicator userMetadata={userMetadata} sessionUser={null} localLoginProps={params} />
	} else {
		const sessionUser: SessionUser = (await auth())!
		const userMetadata: Metadata | null = await find(sessionUser.info.email)

		return <LoginIndicator userMetadata={userMetadata} sessionUser={sessionUser} localLoginProps={null} />
	}
}

export default Login
