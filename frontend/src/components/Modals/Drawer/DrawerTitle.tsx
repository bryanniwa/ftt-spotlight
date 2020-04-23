import React from 'react'

import {
    Icon,
    IconButton,
    Typography
} from '@material-ui/core'

import Flexbox from '../../Layout/Flexbox'

interface IDrawerTitleProps {
    title?: string
    onClose: () => void
    children?: any
}

class DrawerTitle extends React.Component<IDrawerTitleProps> {
    componentDidMount() {
        console.log('DrawerTitle.componentDidMount()')
    }

    componentWillUnmount() {
        console.log('DrawerTitle.componentWillUnmount()')
    }

    render() {
        return (
            <Flexbox className='drawer__title'>
                <IconButton onClick={() => this.props.onClose()}><Icon>arrow_back</Icon></IconButton>
                {this.props.title && (
                    <Typography>{this.props.title}</Typography>
                )}
                {this.props.children && (
                    this.props.children
                )}
            </Flexbox>
        )
    }
}

export { DrawerTitle }
