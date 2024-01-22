import Card from "@/components/Card";
import Link from "@/components/Link";
import { HomeSEO } from "@/components/PageSEO";
import { signIn, useSession } from "next-auth/react";

const Home = (): JSX.Element => {
	const { data: session } = useSession();

	return (
		<>
			<HomeSEO />
			<div className="h-screen w-screen flex bg-global">
				<main>
					<div className="flex flex-col items-center justify-center h-full w-5/6 mx-auto text-center space-y-10">
						<h1 className="text-6xl font-extralight text-gray-800 leading-snug">
							A Distributed Key and Identifier Management Protocol powered by{" "}
							<span className="bg-primary-800 px-3 text-white">
								Zero Knowledge
							</span>
						</h1>
						{session ? (
							<Link href="/dashboard">
								<Card className="relative py-6 px-8 text-xl group-hover:text-primary-800">
									<p>Get Started</p>
								</Card>
							</Link>
						) : (
							<button
								onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
							>
								<Card className="relative py-6 px-8 text-xl group-hover:text-primary-800">
									<p>Get Started</p>
								</Card>
							</button>
						)}
					</div>
				</main>
			</div>
		</>
	);
};

export default Home;
