import Script from "next/script";
import * as VA from "@vercel/analytics/react";

// https://developers.google.com/analytics/devguides/collection/gtagjs/events
export const logEvent = (
	action: any,
	category: any,
	label: any,
	value: any
) => {
	(window as any)?.gtag("event", action, {
		event_category: category,
		event_label: label,
		value: value,
	});
};

const GoogleScript = (): JSX.Element => {
	return (
		<>
			<Script
				async
				src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID}`}
			/>

			<Script strategy="lazyOnload" id="ga-script">
				{`
                    window.dataLayer = window.dataLayer || [];
                    function gtag(){dataLayer.push(arguments);}
                    gtag('js', new Date());

                    gtag('config', 'G-V2EES3R603');
                `}
			</Script>
		</>
	);
};

const UmamiScript = (): JSX.Element => {
	return (
		<>
			<Script
				async
				defer
				data-website-id={process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID}
				src="https://analytics.umami.is/script.js"
			/>
		</>
	);
};

const VercelScript = (): JSX.Element => {
	return (
		<>
			<VA.Analytics />
		</>
	);
};

const isProduction = process.env.NODE_ENV === "production";

const Analytics = (): JSX.Element => {
	return (
		<>
			{isProduction && <GoogleScript />}
			{isProduction && <UmamiScript />}
			{isProduction && <VercelScript />}
		</>
	);
};

export default Analytics;
