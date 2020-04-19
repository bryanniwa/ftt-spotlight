import Link from 'next/link'
import React from 'react'

import {
    Icon,
    IconButton,
    Tooltip
} from '@material-ui/core'

export interface INavItemProps {
    title: string
    href?: string
    icon?: string
    src?: string
}

const NavItem = (props: INavItemProps) => {
    const Button = () => {
        return (
            <IconButton>
                {props.icon && (
                    <Icon>{props.icon}</Icon>
                )}
                {props.src && (
                    <img className='nav-item__image' src={props.src} />
                )}
            </IconButton>
        )
    }

    return (
        <div className='nav-item'>
            <Tooltip title={props.title}>
                {props.href ? (
                    <Link href={props.href}><Button /></Link>
                ) : (
                    <Button />
                )}
            </Tooltip>
        </div>
    )
}

export default NavItem
