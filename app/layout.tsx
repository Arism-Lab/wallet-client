import { headers } from 'next/headers'
import { Session } from 'next-auth'
import NextTopLoader from 'nextjs-toploader'

import Analytics from '@components/Analytics'
import LayoutWrapper from '@components/LayoutWrapper'
import { auth } from '@libs/auth'
import '@styles/tailwind.css'
import '@styles/extra.css'

const RootLayout = async ({
	children,
}: Readonly<{
	children: React.ReactNode
}>) => {
	return (
		<html lang="en" className="scroll-smooth">
			<DocumentHead />
			<body>
				<NextTopLoader
					color="#1f1f1f"
					initialPosition={0.08}
					crawlSpeed={200}
					height={3}
					crawl={true}
					showSpinner={true}
					easing="ease"
					speed={200}
					shadow="0 0 10px #2299DD,0 0 5px #2299DD"
				/>
				<Analytics />
				<LayoutWrapper> {children} </LayoutWrapper>
			</body>
		</html>
	)
}

const DocumentHead = () => {
	return (
		<head>
			<link
				rel="icon"
				type="image/png"
				href="/static/favicons/android-chrome-192x192.png"
				sizes="192x192"
			/>
			<link
				rel="icon"
				type="image/png"
				href="/static/favicons/android-chrome-384x384.png"
				sizes="384x384"
			/>
			<link
				rel="apple-touch-icon"
				sizes="180x180"
				href="/static/favicons/apple-touch-icon.png"
			/>
			<meta
				name="msapplication-config"
				content="/static/favicons/browserconfig.xml"
			/>
			<link
				rel="icon"
				type="image/png"
				sizes="16x16"
				href="/static/favicons/favicon-16x16.png"
			/>
			<link
				rel="icon"
				type="image/png"
				sizes="32x32"
				href="/static/favicons/favicon-32x32.png"
			/>
			<link rel="icon" href="/static/favicons/favicon.ico" />
			<link
				rel="icon"
				type="image/png"
				href="/static/favicons/mstile-150x150.png"
				sizes="150x150"
			/>
			<link
				rel="mask-icon"
				href="/static/favicons/safari-pinned-tab.svg"
				color="#5bbad5"
			/>
			<link rel="manifest" href="/static/favicons/site.webmanifest" />

			<meta name="msapplication-TileColor" content="#603cba" />

			<meta
				name="theme-color"
				media="(prefers-color-scheme: light)"
				content="#fff"
			/>
			<meta
				name="theme-color"
				media="(prefers-color-scheme: dark)"
				content="#000"
			/>
			<link rel="icon" href="/static/logo.png" sizes="any" type="image/png" />

			<title>Arism Wallet</title>
			<meta name="viewport" content="initial-scale=1.0, width=device-width" />
		</head>
	)
}

export default RootLayout
