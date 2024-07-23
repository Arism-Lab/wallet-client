import { PiAppWindow, PiAppWindowFill } from 'react-icons/pi'

const Devices = ({ fill, className }: { fill: boolean; className?: string }) => {
	return fill ? <PiAppWindowFill className={className} /> : <PiAppWindow className={className} />
}

export default Devices
