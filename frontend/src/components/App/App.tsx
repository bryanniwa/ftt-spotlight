import '../../assets/styles/main.scss'

import * as React from 'react'
import { BrowserRouter as Router, Route } from 'react-router-dom'

import { Content } from '../Content'
import { Dashboard } from '../Dashboard'
import { Student } from '../Profile/Student'
import { Sidebar } from '../Sidebar/Sidebar'
import { Staff } from '../Staff'
import { TopNav } from '../TopNav'

import * as classNames from 'classnames'

// FIXME Remove login import
import { Login } from '../Login'
import { Schedule } from '../Schedule'

interface IState {
	menuOpen: boolean
}

interface IProps {}

export default class App extends React.Component<IProps, IState> {
	state = {
		menuOpen: true
	}

	toggleMenu = (e: any): void => {
		this.setState({ menuOpen: this.state.menuOpen === false })
	}

	render() {
		return ( 
			<>
				<Router>
					{/*<div className='login-wrap'>
						<Login />
					</div>*/}
					<div className={classNames('site-wrap', {'--menu_open': this.state.menuOpen})}>
						<Sidebar />
						<Content>
							<Route exact path='/' component={Dashboard} />
							<Route path='/staff' component={Staff} />
							<Route path='/students' component={Student} />
						</Content>
					</div>

				</Router>
			</>
		)
	}
}