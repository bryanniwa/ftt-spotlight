import * as React from 'react'

import axios from 'axios'

import Icon from '@material-ui/core/Icon'
import IconButton from '@material-ui/core/IconButton'
import ListItemIcon from '@material-ui/core/ListItemIcon'
// import { Link } from 'react-router-dom'


export class Sidebar extends React.Component {
	componentDidMount() {
		axios.defaults.headers.post['Content-Type'] ='application/json';
		axios.defaults.headers.post['Access-Control-Allow-Origin'] = '*';
		axios.get('http://localhost:8000/api/staff')
			.then(res => {
				const data = res.data
				console.log(data)
			})
	}

	render() {
		return (
			<>
				<div className='sidebar'>
					<nav className='sidebar__nav'>
						<div className='nav_top'>
							<IconButton><Icon>home</Icon></IconButton>
							<IconButton><Icon>search</Icon></IconButton>
							<IconButton><Icon>star</Icon></IconButton>
							<IconButton><Icon>assignment_turned_in</Icon></IconButton>
						</div>
						<div className='nav_bottom'>
							<IconButton><Icon>notifications</Icon></IconButton>
							<IconButton><Icon>help</Icon></IconButton>
							<IconButton><Icon>perm_identity</Icon></IconButton>
						</div>
					</nav>
					<div className='sidebar__menu'>
						<div className='menu_header'>
							<div className='menu_header__logo'></div>
							<h4>Oak Bay High</h4>
						</div>
						<ul className='menu_list'>
							<li className='menu_list__item'><ListItemIcon><Icon>home</Icon></ListItemIcon>My Classroom</li>
							<li className='menu_list__item'><ListItemIcon><Icon>supervisor_account</Icon></ListItemIcon>Staff</li>
							<li className='menu_list__item'><ListItemIcon><Icon>face</Icon></ListItemIcon>Students</li>
							<li className='menu_list__item'><ListItemIcon><Icon>group</Icon></ListItemIcon>Cohort</li>
							<li className='menu_list__item'><ListItemIcon><Icon>date_range</Icon></ListItemIcon>Class Schedule</li>
							<li className='menu_list__item'><ListItemIcon><Icon>access_time</Icon></ListItemIcon>Appointments</li>
							<li className='menu_list__item'><ListItemIcon><Icon>event</Icon></ListItemIcon>Events</li>
							<li className='menu_list__item'><ListItemIcon><Icon>assessment</Icon></ListItemIcon>Reporting</li>
							<li className='menu_list__item'><ListItemIcon><Icon>settings</Icon></ListItemIcon>Settings</li>
						</ul>
					</div>
				</div>
			</>
		)
	}
}