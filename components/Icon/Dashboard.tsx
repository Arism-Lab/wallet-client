import { RiHomeFill, RiHomeLine } from 'react-icons/ri'

const Dashboard = ({ fill, className }: { fill: boolean; className?: string }) => {
	return fill ? <RiHomeFill className={className} /> : <RiHomeLine className={className} />
}

export default Dashboard
