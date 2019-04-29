import * as React from 'react'

import { TopNav } from './TopNav'

export class Staff extends React.Component {
	componentDidMount() {
		document.title = 'Staff - Spotlight'
	}

	render() {
		return (
			<>
				<TopNav>
					<ul><h3>Staff</h3></ul>
				</TopNav>
				<p>Welcome to the staff page!</p>
			</>
		)
	}
}