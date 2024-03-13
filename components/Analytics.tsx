import * as VA from '@vercel/analytics/react'
import Script from 'next/script'

import siteMetadata from '@/data/siteMetadata.json'

// https://developers.google.com/analytics/devguides/collection/gtagjs/events
export const logEvent = (
	action: any,
	category: any,
	label: any,
	value: any
) => {
	;(window as any)?.gtag('event', action, {
		event_category: category,
		event_label: label,
		value: value,
	})
}

const GoogleScript = (): JSX.Element => {
	return (
		<>
			<Script
				async
				src={`https://www.googletagmanager.com/gtag/js?id=${siteMetadata.analytics.googleAnalyticsId}`}
			/>

			<Script strategy="lazyOnload" id="ga-script">
				{`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${siteMetadata.analytics.googleAnalyticsId}');
        `}
			</Script>
		</>
	)
}

const UmamiScript = (): JSX.Element => {
	return (
		<>
			<Script
				async
				defer
				data-website-id={siteMetadata.analytics.umamiWebsiteId}
				src="https://analytics.umami.is/script.js"
			/>
		</>
	)
}

const VercelScript = (): JSX.Element => {
	return (
		<>
			<VA.Analytics />
		</>
	)
}

const isProduction = process.env.NODE_ENV === 'production'

const Analytics = (): JSX.Element => {
	return (
		<>
			{isProduction && <GoogleScript />}
			{isProduction && <UmamiScript />}
			{isProduction && <VercelScript />}
		</>
	)
}

export default Analytics
