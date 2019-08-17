import * as React from 'react'
import classNames from 'classnames'
import ContentLoader from 'react-content-loader'
import { connect } from 'react-redux'
import { Theme, withTheme } from '@material-ui/core/styles'

import { AccountWidget } from '../Modals/AccountWidget'
import { MenuItem } from './MenuItem'
import { NavItem } from './NavItem'
import NotificationsWidget from '../Modals/NotificationsWidget'
import CheckInWidget from '../Modals/CheckInWidget'
import { SearchWidget } from '../Modals/SearchWidget'
import StarredWidget from '../Modals/StarredWidget'
import { HelpWidget } from './HelpWidget'

interface ReduxProps {
	currentUser: any
}

interface StyleProps {
	theme: Theme
}

interface IProps extends ReduxProps, StyleProps {
	onSignOut: () => void
	loading: boolean
	schoolName?: string
}

/**
 * @TODO Need to handle the case where the screen is very narrow,
 * in which a modal nav manu should be used.
 */
class Sidebar extends React.Component<IProps> {
	render() {
		const details = this.props.currentUser.details
		const { initials, color } = details || { initials: '', color: '' }
		const style = {
			backgroundColor: this.props.theme.palette.primary.main
		}
		return (
			<div className='sidebar'>
				<nav className='sidebar__nav' style={style}>
					{this.props.loading ? (
						<>
							<div style={{height: 200, width: 48}}>
								<ContentLoader height={196} width={48} primaryColor='#4f00bd' secondaryColor='#4a00b3'>
									<rect x={0} y={0} rx={24} ry={24} height={48} width={48}/>
									<rect x={6} y={64} rx={24} ry={24} height={36} width={36}/>
									<rect x={6} y={112} rx={24} ry={24} height={36} width={36}/>
									<rect x={6} y={160} rx={24} ry={24} height={36} width={36}/>
								</ContentLoader>
							</div>
							<div style={{height: 148, width: 48}}>
								<ContentLoader height={148} width={48} primaryColor='#4f00bd' secondaryColor='#4a00b3'>
									<rect x={6} y={0} rx={24} ry={24} height={36} width={36}/>
									<rect x={6} y={52} rx={24} ry={24} height={36} width={36}/>
									<rect x={0} y={100} rx={24} ry={24} height={48} width={48}/>
								</ContentLoader>
							</div>
						</>
					) : (
						<>
							<div className='nav_top'>
								<NavItem title='Spotlight' to='/' icon='home' />
								<SearchWidget />
								<StarredWidget />
								<CheckInWidget />
							</div>
							<div className='nav_bottom'>
								<NotificationsWidget />
								<HelpWidget />
								<AccountWidget onSignOut={this.props.onSignOut} initials={initials} background={`#${color}`} />								
							</div>
						</>
					)}
				</nav>
				<div className='sidebar__menu'>
					{this.props.loading ? (
						<div style={{height: 600, width:256}}>
							<ContentLoader height={600} width={256}>
								<rect x={16} y={16} rx={4} ry={4} height={48} width={48}/>
								<rect x={72} y={32} rx={4} ry={4} height={16} width={96}/>
								<rect x={16} y={92} rx={24} ry={24} height={32} width={32}/>
								<rect x={64} y={100} rx={4} ry={4} height={16} width={64}/>
								<rect x={16} y={144} rx={24} ry={24} height={32} width={32}/>
								<rect x={64} y={152} rx={4} ry={4} height={16} width={176}/>

								<rect x={16} y={196} rx={24} ry={24} height={32} width={32}/>
								<rect x={64} y={204} rx={4} ry={4} height={16} width={96}/>

								<rect x={16} y={248} rx={24} ry={24} height={32} width={32}/>
								<rect x={64} y={256} rx={4} ry={4} height={16} width={64}/>

								<rect x={16} y={300} rx={24} ry={24} height={32} width={32}/>
								<rect x={64} y={308} rx={4} ry={4} height={16} width={80}/>

								<rect x={16} y={352} rx={24} ry={24} height={32} width={32}/>
								<rect x={64} y={360} rx={4} ry={4} height={16} width={136}/>
							</ContentLoader>
						</div>
					) : (
						<>
							{(!this.props.loading && this.props.schoolName) && (
								<div className='menu_header'>
									<div className='menu_header__logo'></div>
									<h4>{this.props.schoolName}</h4>
								</div>
							)}
							<ul className='menu_list'>
								<MenuItem to='/staff' icon='supervisor_account' label='Staff' />
								<MenuItem to='/students' icon='face' label='Students' />
								<MenuItem to='/clusters' icon='group' label='Cluster' />
								<MenuItem to='/class-schedule' icon='date_range' label='Class Schedule' />
								<MenuItem to='/event' icon='event' label='Events' />
								<MenuItem to='/reporting' icon='assignment' label='Reporting' />
								<MenuItem to='/settings' icon='settings' label='Settings' />
								<MenuItem to='/parents' icon='contact_mail' label='Parents' />
							</ul>
							{//<SnackbarProvider />
							}
						</>
					)}
				</div>
			</div>
		)
	}
}

const mapStateToProps = (state: any) => ({
	currentUser: state.auth.user
})

export default connect(mapStateToProps, null)(withTheme(Sidebar))
