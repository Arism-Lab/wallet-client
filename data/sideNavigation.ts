import React from 'react'
import { IconType } from 'react-icons'
import { RiHomeLine, RiHomeFill } from 'react-icons/ri'
import { PiFlowArrow, PiFlowArrowFill } from 'react-icons/pi'
import { PiNewspaperClipping, PiNewspaperClippingFill } from 'react-icons/pi'
import { PiAppWindow, PiAppWindowFill } from 'react-icons/pi'
import { RiSettingsLine, RiSettingsFill } from 'react-icons/ri'
import { BsDiagram3, BsDiagram3Fill } from 'react-icons/bs'

const icon = (ActiveIcon: IconType, DefaultIcon: IconType) => {
    function Icon(props: { active: boolean; className: string }): JSX.Element {
        const { active, className } = props
        if (active) {
            return React.createElement(ActiveIcon, { className })
        } else {
            return React.createElement(DefaultIcon, { className })
        }
    }

    return Icon
}

const navigation = [
    {
        title: 'Dashboard',
        path: '/dashboard',
        description: 'View your wallet general information',
        icon: icon(RiHomeFill, RiHomeLine),
    },
    {
        title: 'DIDs',
        path: '/dids',
        description: 'Manage your Decentralized Identifiers',
        icon: icon(PiNewspaperClippingFill, PiNewspaperClipping),
    },
    {
        title: 'Manage Keys',
        path: '/manage-keys',
        description: 'Manage keys associated with your account',
        icon: icon(BsDiagram3Fill, BsDiagram3),
    },
    {
        title: 'Devices',
        path: '/devices',
        description: 'Manage your shares and devices for each key',
        icon: icon(PiAppWindowFill, PiAppWindow),
    },
    {
        title: 'Transactions',
        path: '/transactions',
        description: 'View your transaction history',
        icon: icon(PiFlowArrowFill, PiFlowArrow),
    },
    {
        title: 'Settings',
        path: '/settings',
        description: 'Account preferences and 2FA settings',
        icon: icon(RiSettingsFill, RiSettingsLine),
    },
]

export default navigation
