import { BsDiagram3, BsDiagram3Fill } from 'react-icons/bs'

const Wallets = ({ fill, className }: { fill: boolean; className?: string }) => {
	return fill ? <BsDiagram3Fill className={className} /> : <BsDiagram3 className={className} />
}

export default Wallets
