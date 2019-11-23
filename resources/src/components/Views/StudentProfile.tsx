import classNames from 'classnames'
import React from 'react'
import ContentLoader from 'react-content-loader'
import { connect } from 'react-redux'
import { RouteComponentProps } from 'react-router-dom'

import {
	Avatar,
	Button,
	Icon,
	IconButton,
	Menu,
	MenuItem,
	TextField,
	Tooltip
} from '@material-ui/core'

import { logout } from '../../actions/authActions'
import { ISnackbar, queueSnackbar } from '../../actions/snackbarActions'
import { starItem, unstarItem } from '../../actions/starActions'
import { fetchStudentProfile } from '../../actions/studentProfileActions'
import {
	createAppointment,
	deleteAppointment,
	fetchStudentSchedule,
	IAppointmentRequest
} from '../../actions/studentScheduleActions'
import { IStarredItem } from '../../reducers/starReducer'
import { IUser } from '../../types/auth'
import {
	IAmendment,
	IAppointment,
	IBlockDetails,
	ICalendarBlock,
	ICalendarBlockVariant,
	ICalendarDay,
	ICalendarDialogGroup,
	ILedgerEntry,
	IScheduled,
} from '../../types/calendar'
import { IStudent } from '../../types/student'
import { isEmpty, listToTruncatedString, makeArray } from '../../utils/utils'

import { Calendar } from '../Calendar/Calendar'
import { CancelAppointment } from '../Calendar/CancelAppointment'
import NewAmendment from '../Calendar/NewAmendment'
import { NewAppointment } from '../Calendar/NewAppointment'
import { LoadingIconButton } from '../Form/LoadingIconButton'
import ChangePasswordWidget from '../Modals/ChangePasswordWidget'
import PlanWidget from '../Modals/PlanWidget'
import { StudentInfoDialog } from '../Modals/StudentInfoDialog'
import { StarButton } from '../StarButton'
import { TopNav } from '../TopNav'

interface IReduxProps {
	currentUser: IUser
	student: any
	schedule: any
	newStarred: IStarredItem
	fetchStudentProfile: (studentID: number) => any
	starItem: (item: IStarredItem) => any
	unstarItem: (item: IStarredItem) => any
	fetchStudentSchedule: (studentID: number, dateTime?: string) => any
	logout: () => Promise<any>
	queueSnackbar: (snackbar: ISnackbar) => void
}

interface IProps extends RouteComponentProps, IReduxProps {
	onSignOut?: () => void
}

interface IState {
	loadingProfile: boolean
	loadingSchedule: boolean
	loadingSignOut: boolean
	editDialogOpen: boolean
	calendarDialogOpen: boolean
	studentID: number
	menuRef: any
	blockDetails: IBlockDetails
	cancelAppointmentDialogOpen: boolean
	cancelAppointmentDialogItem: any
	cancelAppointment: IAppointment
}

class StudentProfile extends React.Component<IProps, IState> {
	state: IState = {
		loadingProfile: false,
		loadingSchedule: false,
		loadingSignOut: false,
		editDialogOpen: false,
		calendarDialogOpen: false,
		studentID: -1,
		menuRef: null,
		blockDetails: null,
		cancelAppointmentDialogOpen: false,
		cancelAppointmentDialogItem: null,
		cancelAppointment: null,
	}

	toggleStarred = (isStarred: boolean) => {
		if (this.props.currentUser.account_type !== 'staff') {
			return
		}
		const starredItem: IStarredItem = {
			item_id: this.props.student.id,
			item_type: 'student'
		}
		if (isStarred) {
            this.props.unstarItem(starredItem)
        } else {
            this.props.starItem(starredItem)
        }
	}

	handleMenuOpen = (event: any) => {
		this.setState({ menuRef: event.currentTarget })
	}

	handleMenuClose = () => {
		this.setState({ menuRef: null })
	}

	handleOpenEditDialog = () => {
		this.handleMenuClose()
		this.setState({ editDialogOpen: true })
	}

	handleCloseEditDialog = () => {
		this.setState({ editDialogOpen: false })
	}

	getURLDateTime = (): string => {
		const searchParams = new URLSearchParams(this.props.location.search)
		return searchParams.get('date')
	}

	setURLDateTime = (dateTime: string) => {
		this.props.history.push({
			pathname: this.props.location.pathname,
			search: `?date=${dateTime}`
		})
	}

	fetchSchedule = (dateTime?: string) => {
		this.setState({ loadingSchedule: true })
		if (!this.props.currentUser) {
			return
		}
		const studentID: number = this.isOwnProfile() ? undefined : this.state.studentID
		this.props.fetchStudentSchedule(studentID, dateTime || this.getURLDateTime()).then(
			(res: any) => {
				this.setState({ loadingSchedule: false })
			}
		)
	}

	handlePrevious = () => {
		if (this.props.schedule.previous) {
			this.fetchSchedule(this.props.schedule.previous)
			this.setURLDateTime(this.props.schedule.previous)
		}
	}

	handleNext = () => {
		if (this.props.schedule.next) {
			this.fetchSchedule(this.props.schedule.next)
			this.setURLDateTime(this.props.schedule.next)
		}
	}

	handleDatePickerChange = (date: Date) => {
		this.fetchSchedule(date.toISOString())
		this.setURLDateTime(date.toISOString())
	}

	handleBlockClick = (blockDetails: IBlockDetails) => {
		this.setState({ blockDetails })
	}

	handleCalendarDialogOpen = () => {
		this.setState({ calendarDialogOpen: true })
	}

	handleCalendarDialogClose = () => {
		this.setState({ calendarDialogOpen: false })
	}

	handleCancelAppointmentDialogOpen = (appointment: IAppointment) => {
		this.setState({
			cancelAppointmentDialogOpen: true,
			cancelAppointment: appointment
		})
	}

	handleCancelAppointmentDialogClose = () => {
		this.setState({
			cancelAppointmentDialogOpen: false,
			calendarDialogOpen: false
		})
	}

	handleCancelAppointment = (appointment: IAppointment): Promise<any> => {
		const appointmentID: number = appointment.id
		const studentID: number = this.isOwnProfile() ? undefined : this.state.studentID
		return deleteAppointment(appointmentID)
			.then((res: any) => {
				return this.props.fetchStudentSchedule(studentID, this.getURLDateTime())
			})
	}

	handleCreateAppointment = (memo: string): Promise<any> => {
		const studentID: number = this.isOwnProfile() ? undefined : this.state.studentID
		const appointment: IAppointmentRequest = {
			student_id: studentID,
			memo,
			block_id: this.state.blockDetails.block_id,
			date: this.state.blockDetails.date
		}
		return createAppointment(appointment)
			.then(() => {
				return this.props.fetchStudentSchedule(studentID, this.getURLDateTime())
			})
			.catch((error: any) => {
				const { response } = error
				if (response && response.data.message) {
					this.props.queueSnackbar({ message: response.data.message })
				} else {
					this.props.queueSnackbar({ message: 'The appointment could not be created.' })
				}
			})
	}

	getStudentID = (): number => {
		return this.props.currentUser.account_type === 'student'
			? this.props.currentUser.details.id
			: this.state.studentID
	}

	isOwnProfile = (): boolean => {
		return this.props.currentUser
			&& this.props.currentUser.account_type === 'student'
	}

	handleSignOut = () => {
		this.setState({ loadingSignOut: true })
		this.props.logout()
			.then(() => {
				this.props.onSignOut()
			})
			.catch(() => {
				this.props.onSignOut()
			})
	}

	onSetStudentPlan = (): Promise<any> => {
		return this.props.fetchStudentSchedule(undefined, this.getURLDateTime())
			.then(() => {
				this.props.queueSnackbar({
					message: 'Set Plan successfully.'
				})
			})
	}

	handleCreateAmendment = (): Promise<any> => {
		const studentID: number = this.isOwnProfile() ? undefined : this.state.studentID
		return this.props.fetchStudentSchedule(studentID, this.getURLDateTime())
			.then(() => {
				this.setState({ calendarDialogOpen: false })
			})
	}

	componentWillMount() {
		const params: any = this.props.match.params
		const { studentID } = params
		this.setState({ studentID })
	}

	componentDidMount() {
		const studentID: number = this.isOwnProfile() ? undefined : this.state.studentID
		this.fetchSchedule()
		this.setState({ loadingProfile: true })
		this.props.fetchStudentSchedule(studentID).then(
			(res: any) => {
				this.setState({ loadingSchedule: false })
			}
		)
		this.props.fetchStudentProfile(studentID).then(
			(res: any) => {
				this.setState({ loadingProfile: false })
			}
		)
	}

	render() {
		const starred: boolean = this.props.newStarred
		&& this.props.newStarred.item_id === this.props.student.id
		&& this.props.newStarred.item_type === 'student' ? (
			this.props.newStarred.isStarred !== false
		) : this.props.student.starred

		const avatarColor = this.props.student.color || 'red'
		const studentID: number = this.getStudentID()

		const { menuRef, editDialogOpen } = this.state
		const menuOpen: boolean = Boolean(this.state.menuRef)
		const studentDetails: IStudent = {
			id: this.props.student.id,
			first_name: this.props.student.first_name,
			last_name: this.props.student.last_name,
			grade: this.props.student.grade,
			student_number: this.props.student.student_number || undefined,
			initials: this.props.student.initials,
			color: this.props.student.color
		}

		let calendar: ICalendarDay[] = null
		if (this.props.schedule && !isEmpty(this.props.schedule)) {
			calendar = this.props.schedule.schedule.map((scheduleDay: any) => {
				const calendarDay: ICalendarDay = {
					date: scheduleDay.date,
					events: scheduleDay.events,
					blocks: scheduleDay.blocks.map((block: any) => {
						const title: string = block.amendments && block.amendments.length > 0 ? (
							'Block Amended'
						) : (
							block.flex ? (
								block.logs[0] ? (
									block.logs[0].staff.name
								) : (
									block.scheduled ? block.scheduled.name : 'No Schedule'
								)
							) : (
								block.scheduled.name
							)
						)
						const memo = block.amendments && block.amendments.length > 0 ? (
							null
						) : (
							block.logs[0] && block.flex && block.logs[0].topic ? block.logs[0].topic.memo : null
						)
						const variant: ICalendarBlockVariant = block.amendments && block.amendments.length ? 'void' : (
							block.logs[0] ? 'attended' : (
								block.pending ? 'pending' : 'missed'
							)
						)
						const data: any = {
							amendments: makeArray(block.amendments),
							appointments: makeArray(block.appointments),
							ledgerEntries: makeArray(block.logs),
							scheduled: makeArray(block.scheduled)
						}
						const details: IBlockDetails = {
							block_id: block.id,
							date: `${scheduleDay.date.day} ${scheduleDay.date.full_date}`,
							start: block.start,
							end: block.end,
							flex: block.flex,
							label: block.label,
							pending: block.pending,
							data
						}
						const calendarBlock: ICalendarBlock = {
							title,
							variant,
							badgeCount: block.appointments.length || 0,
							memo,
							details
						}
						return calendarBlock
					})
				}
				return calendarDay
			})
		}

		const calendarDialogGroups: ICalendarDialogGroup[] = [
			{
				name: 'Logs',
				keys: ['ledgerEntries', 'amendments'],
				itemMaps: [
					(log: ILedgerEntry) => ({
						id: log.id,
						time: log.time,
						title: log.staff.name,
						memo: log.topic ? log.topic.memo : 'No Topic',
						variant: 'success',
						method: log.method
					}),
					(amendment: IAmendment) => ({
						id: amendment.id,
						time: 'Amended',
						title: amendment.staff.name,
						memo: amendment.memo,
						method: 'amendment',
						variant: 'default'
					})
				],
				emptyState: (blockDetails: IBlockDetails) => (
					<>
						<p className='empty_text'>No attendance recorded</p>
						{this.props.currentUser.account_type === 'staff' && (
							<NewAmendment blockDetails={blockDetails} studentID={studentID} onSubmit={this.handleCreateAmendment} />
						)}
					</>
				)
			},
			{
				name: 'Appointments',
				keys: ['appointments'],
				itemMaps: [
					(appointment: IAppointment, blockDetails: IBlockDetails) => ({
						id: appointment.id,
						title: appointment.staff.name,
						memo: appointment.memo,
						variant: blockDetails.pending ? 'pending' : (
							blockDetails.data.ledgerEntries
							&& blockDetails.data.ledgerEntries.some(((log: any) => (
								log.staff.id === appointment.staff.id
							))) ? 'success' : 'fail'
						)
					})
				],
				emptyState: () => (
					<p className='empty_text'>No appointments booked</p>
				),
				child: (blockDetails: IBlockDetails) => {
					return blockDetails.pending && this.props.currentUser.account_type === 'staff' ? (
						<NewAppointment
							onSubmit={this.handleCreateAppointment}
							onClose={this.handleCalendarDialogClose}
						/>
					) : undefined
				},
				actions: (appointment: IAppointment, blockDetails: IBlockDetails) => {
					return !isEmpty(appointment)
					&& this.props.currentUser.account_type === 'staff'
					&& (
						this.props.currentUser.details.administrator === true
						|| this.props.currentUser.details.id === appointment.staff.id
					)
					&& blockDetails.pending ?
					[
						{
							value: 'Cancel Appointment',
							callback: () => Promise.resolve(this.handleCancelAppointmentDialogOpen(appointment))
						}
					] : undefined
				}
			},
			{
				name: 'Scheduled',
				keys: ['scheduled'],
				itemMaps: [
					(scheduledItem: IScheduled, blockDetails: IBlockDetails) => ({
						title: scheduledItem.name,
						variant: blockDetails.pending ? null : (
							blockDetails.flex === true ? (
								blockDetails.data.ledgerEntries
								&& blockDetails.data.ledgerEntries.some(((log: any) => (
									log.staff.id === scheduledItem.id))
								) ? 'success' : 'fail'
							) : (
								blockDetails.data && blockDetails.data.ledgerEntries
								&& blockDetails.data.ledgerEntries.length > 0 ? 'success' : 'fail'
							)
						),
						memo: scheduledItem.topic ? scheduledItem.topic.memo : undefined
					})
				],
				emptyState: () => (
					<p className='empty_text'>Nothing scheduled</p>
				),
				child: (blockDetails: IBlockDetails) => (
					blockDetails.pending && this.isOwnProfile() ? (
						<PlanWidget
							blockDetails={blockDetails}
							onSubmit={this.onSetStudentPlan}
						/>
					) : undefined
				)
			}
		]

		return (
			<div className='content' id='content'>
				<CancelAppointment
					open={this.state.cancelAppointmentDialogOpen}
					appointment={this.state.cancelAppointment}
					onClose={this.handleCancelAppointmentDialogClose}
					onSubmit={this.handleCancelAppointment}
				/>
				<StudentInfoDialog
					open={editDialogOpen}
					onClose={this.handleCloseEditDialog}
					onSubmit={null}
					edit={true}
					studentDetails={studentDetails}
				/>
				<div className='profile'>
					<TopNav>
						<ul>
							<li className='profile_title'>
								{this.state.loadingProfile ? (
									<div style={{height: 56, width: 368}}>
										<ContentLoader height={56} width={368}>
											<rect x={0} y={4} rx={24} ry={24} height={48} width={48}/>
											<rect x={64} y={8} rx={4} ry={4} height={24} width={164}/>
											<rect x={240} y={8} rx={4} ry={4} height={24} width={128}/>
											<rect x={64} y={40} rx={4} ry={4} height={12} width={84}/>
										</ContentLoader>
									</div>
								) : (
									<>
										<Avatar
											className={classNames('profile_avatar', `--${avatarColor}`)}
										>
											{this.props.student.initials}
										</Avatar>
										<div>
											<h3 className='name'>
												{`${this.props.student.first_name} ${this.props.student.last_name}`}
												<span className='grade'>{`Grade ${this.props.student.grade}`}</span>
											</h3>
											<a onClick={() => null}>
												<h5 className='cluster-list'>{this.props.student.clusters && (
													listToTruncatedString(this.props.student.clusters.map((cluster: any) => cluster.name), 'Cluster')
												)}</h5>
											</a>
										</div>
									</>
								)}
							</li>
						</ul>
						{this.state.loadingProfile ? (
							<div style={{height: 56, width: 80}}>
								<ContentLoader height={56} width={80}>
									<rect x={0} y={12} rx={24} ry={24} height={36} width={36}/>
									<rect x={44} y={12} rx={24} ry={24} height={36} width={36}/>
								</ContentLoader>
							</div>
						) : (
							<ul className='right_col'>
								{this.isOwnProfile() ? (
									<>
										<li>
											<ChangePasswordWidget variant='dialog' />
										</li>
										<li>
											<Tooltip title='Sign Out'>
												<LoadingIconButton loading={this.state.loadingSignOut} onClick={() => this.handleSignOut()}>
													<Icon>exit_to_app</Icon>
												</LoadingIconButton>
											</Tooltip>
										</li>
									</>
								) : (
									<li>
										<StarButton onClick={() => this.toggleStarred(starred)} isStarred={starred} />
									</li>
								)}
							</ul>
						)}
					</TopNav>
					<Calendar
						hasNext={Boolean(this.props.schedule.next)}
						hasPrevious={Boolean(this.props.schedule.previous)}
						loading={this.state.loadingSchedule || !calendar}
						rangeLabel={this.props.schedule.range}
						minDate={this.props.schedule.min_date}
						maxDate={this.props.schedule.max_date}
						calendar={calendar}
						calendarDialogGroups={calendarDialogGroups}
						onNext={this.handleNext}
						onPrevious={this.handlePrevious}
						onDatePickerChange={this.handleDatePickerChange}
						onBlockClick={this.handleBlockClick}
						dialogOpen={this.state.calendarDialogOpen}
						onDialogOpen={this.handleCalendarDialogOpen}
						onDialogClose={this.handleCalendarDialogClose}
						onRefresh={() => this.fetchSchedule()}
					/>
				</div>
			</div>
		)
	}
}

const mapStateToProps = (state: any) => ({
	currentUser: state.auth.user,
	student: state.studentProfile.student,
	schedule: state.studentSchedule.schedule,
	newStarred: state.starred.item
})

const mapDispatchToProps = {
	fetchStudentProfile,
	fetchStudentSchedule,
	starItem,
	unstarItem,
	logout,
	queueSnackbar
}

export default connect(mapStateToProps, mapDispatchToProps)(StudentProfile)
