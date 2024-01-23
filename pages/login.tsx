import { GetStaticProps } from 'next'
import { getSession, signIn, useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'
import * as P2P from '@/types/p2p'
import Card from '@/components/Card'
import Link from '@/components/Link'
import { HomeSEO } from '@/components/PageSEO'
import { constructPrivateKey } from '@/helpers/masterKey'
import TransitionWrapper from '@/components/TransitionWrapper'
import { useRouter } from 'next/router'
import Loading from '@/components/Loading'

const Login = (): JSX.Element => {
  const [loading, setLoading] = useState<boolean>(true)
  const router = useRouter()

  useEffect(() => {
    ;(async () => {
      const session = await getSession()
      console.log(session)

      const input: P2P.GetPrivateKeyRequest = {
        idToken: session!.token.idToken,
        owner: session!.user!.email!,
        verifier: 'google',
      }
      const privateKey = await constructPrivateKey(input)
      console.log(privateKey)

      setLoading(false)
    })()
  }, [])

  if (loading) {
    return (
      <TransitionWrapper router={router}>
        <Loading />
      </TransitionWrapper>
    )
  }

  return (
    <>
      <HomeSEO />
      <div className="h-screen w-screen flex bg-global">
        <main>
          <div className="flex flex-col items-center justify-center h-full w-5/6 mx-auto text-center space-y-10">
            <h1 className="text-6xl font-extralight text-gray-800 leading-snug">
              A Distributed Key and Identifier Management Protocol powered by{' '}
              <span className="bg-primary-800 px-3 text-white">
                Zero Knowledge
              </span>
            </h1>
          </div>
        </main>
      </div>
    </>
  )
}

export default Login
