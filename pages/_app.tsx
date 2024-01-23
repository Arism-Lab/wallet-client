import type { AppProps } from 'next/app'
import Head from 'next/head'
import Router from 'next/router'
import ProgressBar from 'react-scroll-progress-bar'
import NProgress from 'nprogress'
import { useRouter } from 'next/router'
import LayoutWrapper from '@/components/LayoutWrapper'
import '@/styles/tailwind.css'
import '@/styles/extra.css'
import { SessionProvider } from 'next-auth/react'
import Analytics from '@/components/Analytics'

// NProgress.configure({ showSpinner: false });

Router.events.on('routeChangeStart', () => {
  NProgress.start()
})

Router.events.on('routeChangeComplete', () => {
  NProgress.done()
})

Router.events.on('routeChangeError', () => {
  NProgress.done()
})

const MyApp = ({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps): JSX.Element => {
  return (
    <>
      <SessionProvider session={session}>
        <ProgressBar bgcolor="#5b21b6" />
        <Head>
          <title>Arism Wallet</title>
          <meta
            name="viewport"
            content="initial-scale=1.0, width=device-width"
          />
        </Head>
        <Analytics />
        <LayoutWrapper>
          <Component {...pageProps} />
        </LayoutWrapper>
      </SessionProvider>
    </>
  )
}

export default MyApp
