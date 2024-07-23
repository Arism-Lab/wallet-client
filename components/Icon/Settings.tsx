import { RiSettingsFill, RiSettingsLine } from 'react-icons/ri'

const Settings = ({ fill, className }: { fill: boolean; className?: string }) => {
	return fill ? <RiSettingsFill className={className} /> : <RiSettingsLine className={className} />
}

export default Settings
