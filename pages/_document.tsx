import Document, { Html, Head, Main, NextScript } from "next/document";

class MyDocument extends Document {
	render() {
		return (
			<Html lang="en" className="scroll-smooth">
				<Head>
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
					<link
						rel="icon"
						href="/static/logo.png"
						sizes="any"
						type="image/png"
					/>
				</Head>
				<body>
					<Main />
					<NextScript />
				</body>
			</Html>
		);
	}
}

export default MyDocument;
