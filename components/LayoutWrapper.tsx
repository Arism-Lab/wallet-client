import { useRouter } from 'next/router'
import { getSession, signOut } from 'next-auth/react'
import { useEffect, useState } from 'react'
import Image from 'next/image'
import { AiOutlineLogout } from 'react-icons/ai'
import { IoIosWarning } from 'react-icons/io'
import sideNavigation from '@/data/sideNavigation'
import Link from '@/components/Link'
import { siteMetadata } from '@/data/siteMetadata'
import Loading from '@/components/Loading'
import TransitionWrapper from '@/components/TransitionWrapper'

const LayoutWrapper = ({ children }: Wrapper): JSX.Element => {
  const [session, setSession] = useState<any | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const router = useRouter()
  const currPath = router.pathname
  const isHome = router.pathname === '/' || router.pathname === '/login'

  useEffect(() => {
    ;(async () => {
      const _session = await getSession()
      setSession(_session)
      setLoading(false)
      if (!_session) {
        await router.push('/')
      }
    })()
  }, [])

  const pageTitle = sideNavigation.find((item) => item.path === currPath)?.title

  if (isHome) {
    return <TransitionWrapper router={router}>{children}</TransitionWrapper>
  }

  if (loading) {
    return (
      <TransitionWrapper router={router}>
        <Loading />
      </TransitionWrapper>
    )
  }

  return (
    <>
      <TransitionWrapper router={router}>
        <div className="h-screen w-screen flex bg-global">
          <div className="flex flex-col w-1/5 text-gray-800">
            <Link
              className="flex items-center place-items-center py-10 mx-auto"
              href="/"
            >
              <Image
                alt="Arism logo"
                src="/static/logo.png"
                width={65}
                height={65}
              />
              <div className="flex flex-col">
                <h1 className="text-4xl font-extralight">Arism Wallet</h1>
                <p className="text-center text-xs font-light tracking-widest">
                  THE NEXT-GEN WALLET
                </p>
              </div>
            </Link>
            <div className="flex flex-col items-center justify-center transition duration-150 ease-in-out space-y-2">
              {sideNavigation.map((item, index) => (
                <Link
                  href={item.path}
                  key={index}
                  className={`${
                    currPath === item.path ? 'text-black' : 'text-gray-500'
                  } flex items-center justify-items-start w-5/6 h-14 mx-auto py-3 hover:rounded-full hover:bg-black hover:bg-opacity-10 transition-all duration-200 ease-in-out`}
                >
                  {item.icon({
                    active: currPath === item.path,
                    className: 'h-6 w-1/3',
                  })}
                  <span className="w-2/3 text-base">{item.title}</span>
                </Link>
              ))}
            </div>
            <div className="mt-auto mb-10 flex flex-col ml-[20%] space-y-5">
              {siteMetadata.externalLinks.map((item) => (
                <Link
                  href={item.url}
                  key={item.name}
                  className="flex items-start text-base text-gray-500 hover:text-black transition-all duration-200 ease-in-out"
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
          <hr className="w-[0.75px] h-full self-center bg-black bg-opacity-10" />
          <main className="w-full">
            <div className="p-12 flex flex-col">
              <div className="flex justify-between w-full">
                <p className="text-5xl font-extrabold">{pageTitle}</p>
                <div className="flex gap-5 place-items-center">
                  <div className="flex items-center space-x-2 ">
                    <button className="flex place-items-center text-sm bg-white py-2 pl-3 pr-2 hover:bg-yellow-600 rounded-full transition-all duration-200 ease-in-out h-12 group">
                      <IoIosWarning className="w-5 h-5 text-yellow-600 group-hover:text-white " />
                      <p className="px-2 text-black group-hover:text-white">
                        Turn on MFA
                      </p>
                    </button>
                  </div>
                  <hr className="h-full w-[0.75px] bg-black bg-opacity-10" />
                  <div className="flex items-center space-x-2 ">
                    <button className="flex place-items-center text-sm bg-white py-2 pl-3 pr-2 hover:text-white hover:bg-primary-600 rounded-full transition-all duration-200 ease-in-out">
                      <Image
                        alt="User avatar"
                        src={session?.user?.image ?? '/images/avatar.png'}
                        width={30}
                        height={30}
                        className="rounded-full"
                      />
                      <p className="px-2">{session?.user?.name ?? 'User'}</p>
                    </button>
                    <button
                      onClick={() => signOut({ callbackUrl: '/' })}
                      className="rounded-full p-2 bg-white text-red-600 hover:bg-red-600 hover:text-white transition-all duration-200 ease-in-out"
                    >
                      <AiOutlineLogout className="w-7 h-7" />
                    </button>
                  </div>
                </div>
              </div>
              {children}
            </div>
          </main>
        </div>
      </TransitionWrapper>
    </>
  )
}

export default LayoutWrapper
