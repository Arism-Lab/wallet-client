import { PageSEO } from "@/components/PageSEO";
import sideNavigation from "@/data/sideNavigation";
import { GetStaticProps } from "next";

export const getStaticProps: GetStaticProps = async (a) => {
	let siteInfo = sideNavigation.find((item) => item.path === "/settings");

	return {
		props: {
			title: siteInfo?.title,
			description: siteInfo?.description,
		},
	};
};

const Settings = ({ title, description }: PageSEOProps) => {
	return (
		<>
			<PageSEO title={title} description={description} />
		</>
	);
};

export default Settings;
