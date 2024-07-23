import { Metadata } from 'next'
import { AiOutlineEdit } from 'react-icons/ai'
import { MdDeleteOutline } from 'react-icons/md'

import siteMetadata from '@data/siteMetadata.json'
import { getDevice } from '@helpers/deviceFactor'
import { auth } from '@libs/auth'
import { formatDate } from '@libs/date'
import { extractAgent } from '@libs/device'

const metadata = siteMetadata.internalLinks.find((link) => link.title === 'Devices')!

export const generateMetadata = (): Metadata => {
	return {
		metadataBase: new URL(siteMetadata.siteUrl),
		title: metadata.title + ' | ' + siteMetadata.title,
		description: metadata.description,
		openGraph: {
			images: [siteMetadata.siteUrl + siteMetadata.siteBanner],
		},
	}
}

const Devices = async () => {
	const sessionUserReducer: SessionUser = (await auth())!
	const devices: ExtractDevice[] = await getDevice(sessionUserReducer.info.email, false).then((res) =>
		res.map((device) => ({
			...device,
			...extractAgent(device.agent),
		}))
	)

	return (
		<>
			<div className="mx-auto h-full py-4">
				<div className="grid">
					{devices.map((device, i) => (
						<div key={device.agent} className="m-2 flex flex-col rounded-[3rem] border-none bg-white p-5">
							<div className="flex place-items-center justify-between">
								<div className="flex place-items-center gap-4">
									<p className="flex size-8 place-items-center justify-center rounded-full bg-zinc-900 text-lg font-medium text-white">
										{i + 1}
									</p>
									<div className="grid">
										<p className="dashboard-subtitle font-base text-xl">
											Default Device ({device.browser.name} on {device.os.name})
										</p>
										<p className="text-sm font-light text-zinc-500">
											Last sign in since {formatDate(device.lastLogin, true)}
										</p>
									</div>
								</div>
								<div className="flex gap-2">
									<button className="flex place-items-center rounded-full bg-zinc-100 px-6 py-2 text-black hover:bg-zinc-300">
										Edit
										<AiOutlineEdit className="ml-3 size-4"></AiOutlineEdit>
									</button>
									<button className="flex place-items-center rounded-full bg-red-700 px-6 py-2 text-white hover:bg-red-900">
										Remove
										<MdDeleteOutline className="ml-3 size-4"></MdDeleteOutline>
									</button>
								</div>
							</div>
						</div>
					))}
				</div>
			</div>
		</>
	)
}

export default Devices
