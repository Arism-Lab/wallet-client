import { PiNewspaperClipping, PiNewspaperClippingFill } from 'react-icons/pi'

const DIDs = ({ fill, className }: { fill: boolean; className?: string }) => {
	return fill ? <PiNewspaperClippingFill className={className} /> : <PiNewspaperClipping className={className} />
}

export default DIDs
