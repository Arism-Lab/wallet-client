/* eslint-disable react-hooks/rules-of-hooks */
import Router, { useRouter } from "next/router";
import { getSession, signOut, useSession } from "next-auth/react";
import sideNavigation from "@/data/sideNavigation";
import Link from "@/components/Link";
import { useEffect, useState } from "react";
import { siteMetadata } from "@/data/siteMetadata";

const LayoutWrapper = ({ children }: Wrapper): JSX.Element => {
	const [session, setSession] = useState<any | null>(null);
	const router = useRouter();
	const currPath = router.pathname;

	useEffect(() => {
		(async () => {
			let _session = await getSession();
			setSession(_session);
			if (!_session) {
				await router.push("/");
			}
		})();
	}, []);

	const pageTitle = sideNavigation.find(
		(item) => item.path === currPath
	)?.title;

	return (
		<>
			<div className="h-screen w-screen flex bg-global">
				<div className="flex flex-col w-1/6 text-gray-800">
					<Link
						className="flex flex-col items-center justify-center py-10 space-y-2"
						href="/"
					>
						<h1 className="text-4xl font-extralight">Arism Wallet</h1>
						<p className="text-xs font-light tracking-widest">
							THE NEXT GENERATION OF WALLET
						</p>
					</Link>
					<div className="flex flex-col items-center justify-center transition duration-150 ease-in-out space-y-2">
						{sideNavigation.map((item, index) => (
							<Link
								href={item.path}
								key={index}
								className={`${
									currPath === item.path ? "text-black" : "text-gray-500"
								} flex items-center justify-items-start w-5/6 h-14 mx-auto py-3 hover:rounded-full hover:bg-black hover:bg-opacity-10 transition-all duration-200 ease-in-out`}
							>
								{item.icon({
									active: currPath === item.path,
									className: "h-6 w-1/3",
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
							<div className="flex items-center space-x-2">
								<p className="text-base font-light">Welcome,</p>
								<p className="text-base font-semibold">
									{session?.user?.name ?? "User"}
								</p>
								<button onClick={() => signOut({ callbackUrl: "/" })}>
									<p className="text-base font-light text-red-500">Log out</p>
								</button>
							</div>
						</div>
						{children}
					</div>
				</main>
			</div>
		</>
	);
};

export default LayoutWrapper;
