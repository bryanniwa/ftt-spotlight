import * as React from 'react'
import ContentLoader from 'react-content-loader'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import { fetchStarred, starItem, unstarItem } from '../../actions/starActions'

import {
    Drawer,
    Fade,
    Grow,
    Icon,
    IconButton,
    List,
    ListItem
} from '@material-ui/core'

import { EmptyStateIcon } from '../EmptyStateIcon'
import { NavItem } from '../Sidebar/NavItem'
import { IStarredList } from '../../reducers/starReducer'

interface IStarredGroup {
    value: string
    label: string
}

interface IState {
    open: boolean
    loading: boolean
}

interface IProps {
    fetchStarred: () => any
    starred: IStarredList
}

const starredGroups: IStarredGroup[] = [
    { value: 'students', label: 'Students' },
    { value: 'staff', label: 'Staff' },
    { value: 'courses', label: 'Courses' },
    { value: 'clusters', label: 'Clusters' },
]

class StarredWidget extends React.Component<IProps, IState> {
    constructor(props: IProps) {
        super(props)
        this.escFunction = this.escFunction.bind(this)
    }

    state: IState = {
        open: true,
        loading: false
    }

    handleClickOpen = () => {
        this.setState({ open: true })
    }

    handleClose = () => {
        this.setState({ open: false })
    }

    escFunction = (event: any) => {
        if (event.keyCode === 27) {
            this.setState({ open: false })
        }
    }

    componentDidMount() {
        document.addEventListener('keydown', this.escFunction, false)
        this.setState({ loading: true })
        this.props.fetchStarred().then(
            (res: any) => this.setState({ loading: false })
        )
    }

    componentWillUnmount() {
        document.removeEventListener('keydown', this.escFunction, false)
    }

    render () {
        const starredCount: number = this.props.starred ? (
            starredGroups.reduce((count: number, itemGroup: IStarredGroup) => {
                return count + this.props.starred[itemGroup.value] ? this.props.starred[itemGroup.value].length : 0
            }, 0)
        ) : 0

        return (
            <>
                <NavItem title='Starred' icon='star' onClick={this.handleClickOpen} />
                <Drawer open={this.state.open}>
					<div className='sidebar_modal starred_modal items_modal'>
                        <div className='sidebar_modal__header'>
                            <IconButton className='button_back' onClick={this.handleClose}><Icon>arrow_back</Icon></IconButton>
                            <h3>Starred</h3>
                        </div>
                        <div className='sidebar_modal__content starred_modal__content items_modal__content'>
                            <Grow in={!this.state.loading && starredCount > 0} timeout={{enter: 200, exit: 0}}>
                                <div className='content-inner'>
                                    {starredGroups.filter((starredGroup: IStarredGroup) => this.props.starred[starredGroup.value])
                                        .map((starredGroup: IStarredGroup, index: number) => (
                                            <>
                                                <h4 className='items-group_header'>{starredGroup.label}</h4>
                                                <List className='items-group_list'>
                                                    {this.props.starred[starredGroup.value].map((item: any, index: number) => {
                                                        let url: string
                                                        let value: string
                                                        switch (starredGroup.value) {
                                                            case 'students':
                                                                value = `${item.first_name} ${item.last_name}`
                                                                url = `/students/${item.id}`
                                                                break
                                                            case 'staff':
                                                                value = `${item.title} ${item.last_name}, ${item.first_name}`
                                                                url = `/staff/${item.id}`
                                                                break
                                                            case 'courses':
                                                                value = item.name
                                                                url = `/courses/${item.short_name}`
                                                                break
                                                            case 'clusters':
                                                                value = item.name
                                                                url = `/clusters/${item.id}`
                                                                break
                                                        }
                                                        return (
                                                            <Link key={index} to={url} onClick={this.handleClose}>
                                                                <ListItem key={index} className='items-group_list__item'>{value}</ListItem>
                                                            </Link>
                                                        )
                                                    })}
                                                </List>
                                            </>
                                        ))
                                    }
                                </div>
                            </Grow>
                            <Fade in={this.state.loading} timeout={{enter: 200, exit: 0}}>
                                <div className='items_modal__content-loader'>
                                    <ContentLoader width={500} height={436}>
                                        <rect x='64' y='0' rx='4' ry='4' height='24' width='96' />
                                        <rect x='64' y='40' rx='4' ry='4' height='36' width='400' />
                                        <rect x='64' y='84' rx='4' ry='4' height='36' width='400' />
                                        <rect x='64' y='128' rx='4' ry='4' height='36' width='400' />
                                        <rect x='64' y='180' rx='4' ry='4' height='24' width='160' />
                                        <rect x='64' y='220' rx='4' ry='4' height='36' width='400' />
                                        <rect x='64' y='264' rx='4' ry='4' height='36' width='400' />
                                        <rect x='64' y='308' rx='4' ry='4' height='36' width='400' />
                                        <rect x='64' y='360' rx='4' ry='4' height='24' width='80' />
                                        <rect x='64' y='400' rx='4' ry='4' height='36' width='400' />
                                    </ContentLoader>
                                </div>
                            </Fade>
                            {!this.state.loading && starredCount === 0 && (
                                <EmptyStateIcon variant='starred'>
                                    <h2>No Starred items found</h2>
                                    <h3>Items you add to your Starred list will appear here.</h3>
                                </EmptyStateIcon>
                            )}
                        </div>
					</div>
				</Drawer>
            </>
        )
    }
}

/**
 * @TODO IProps for this....
 */
const mapStateToProps = (state: any) => ({
    starred: state.starred.items,
    newStarredItem: state.starred.item
})

const mapDispatchToProps = {
    fetchStarred,
    // starItem,
    // unstarItem
}
export default connect(mapStateToProps, mapDispatchToProps)(StarredWidget)