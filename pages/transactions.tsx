import { PageSEO } from "@/components/PageSEO";
import sideNavigation from "@/data/sideNavigation";
import { GetStaticProps } from "next";

export const getStaticProps: GetStaticProps = async (a) => {
	let siteInfo = sideNavigation.find((item) => item.path === "/transactions");

	return {
		props: {
			title: siteInfo?.title,
			description: siteInfo?.description,
		},
	};
};

const Transactions = ({ title, description }: PageSEOProps) => {
	return (
		<>
			<PageSEO title={title} description={description} />
		</>
	);
};

export default Transactions;
