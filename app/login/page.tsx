import dynamic from 'next/dynamic'

import { getUser } from '@helpers/userMetadata'
import { auth } from '@libs/auth'

const LoginIndicator = dynamic(() => import('@components/LoginIndicator'), { ssr: false })

interface LoginProps {
	info: Info
	password: string
}
const Login = async ({ params }: { params: LoginProps }) => {
	if (params.info && params.password) {
		const userMetadata: Metadata = (await getUser(params.info.email, false))!

		return <LoginIndicator userMetadata={userMetadata} sessionUser={null} localLoginProps={params} />
	} else {
		const sessionUser: SessionUser = (await auth())!
		const userMetadata: Metadata | null = await getUser(sessionUser.info.email, false)

		return <LoginIndicator userMetadata={userMetadata} sessionUser={sessionUser} localLoginProps={null} />
	}
}

export default Login
