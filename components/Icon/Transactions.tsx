import { PiFlowArrow, PiFlowArrowFill } from 'react-icons/pi'

const Transactions = ({ fill, className }: { fill: boolean; className?: string }) => {
	return fill ? <PiFlowArrowFill className={className} /> : <PiFlowArrow className={className} />
}

export default Transactions
