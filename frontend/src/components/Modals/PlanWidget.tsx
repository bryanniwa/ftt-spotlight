import React from 'react'
import { connect } from 'react-redux'

import {
    Button,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
} from '@material-ui/core'

import {
    fetchStaffList,
    ISchedulePlanRequest,
    IStaffTopic,
    setStudentPlan
} from '../../actions/studentScheduleActions'
import { IBlockDetails } from '../../types/calendar'

import { CalendarDialogItem } from '../Calendar/CalendarDialogItem'
import { LoadingButton } from '../Form/LoadingButton'
import { EnhancedDialogTitle } from './EnhancedDialogTitle'

interface IReduxProps {
    fetchStaffList: (blockID: number, dateTime: string) => Promise<any>
    setStudentPlan: (schedulePlan: ISchedulePlanRequest) => Promise<any>
    staffList: IStaffTopic[]
}

interface IProps extends IReduxProps {
    blockDetails: IBlockDetails
    onSubmit: () => Promise<any>
}

interface IState {
    loadingStaffList: boolean
    open: boolean
    uploading: boolean
}

class PlanWidget extends React.Component<IProps, IState> {
    state: IState = {
        loadingStaffList: false,
        open: false,
        uploading: false
    }

    handleOpen = () => {
        this.setState({ open: true })
    }

    handleClose = () => {
        this.setState({ open: false })
    }

    handleSubmit = (staffTopic: IStaffTopic) => {
        this.setState({
            open: false,
            uploading: true
        })
        const schedulePlan: ISchedulePlanRequest = {
            staff_id: staffTopic.staff.id,
            block_id: this.props.blockDetails.block_id,
            date: this.props.blockDetails.date
        }
        this.props.setStudentPlan(schedulePlan)
            .then(() => {
                // Signal to refresh profile
                return this.props.onSubmit()
                    .then(() => {
                        // this.props.onClose()
                        this.setState({
                            uploading: false
                        })
                    })
            })
    }

    componentDidMount() {
        const { block_id, date } = this.props.blockDetails
        this.setState({ loadingStaffList: true })
        this.props.fetchStaffList(block_id, date)
            .then(() => {
                this.setState({ loadingStaffList: false })
            })
    }

    render() {
        const disabled: boolean = this.props.blockDetails.data.appointments && this.props.blockDetails.data.appointments.length

        return (
            <>
                <LoadingButton
                    loading={this.state.uploading}
                    variant='text'
                    color='primary'
                    onClick={() => this.handleOpen()}
                    disabled={disabled}
                >Set Plan</LoadingButton>
                <Dialog open={this.state.open}>
                    <EnhancedDialogTitle title='Plan Schedule' onClose={this.handleClose}/>
                    <DialogContent>
                        <DialogContentText>Select a teacher from the list below.</DialogContentText>
                        {this.state.loadingStaffList ? (
                            <CircularProgress />
                        ) : (
                            this.props.staffList.map((staffTopic: IStaffTopic, index: number) => (
                                <CalendarDialogItem
                                    onCloseDialog={this.handleClose}
                                    onClick={() => this.handleSubmit(staffTopic)}
                                    details={{
                                        variant: staffTopic.topic ? staffTopic.topic.color : undefined,
                                        title: staffTopic.staff.name,
                                        memo: staffTopic.topic ? staffTopic.topic.memo : 'No Topic',
                                        time: `${staffTopic.num_remaining} of ${staffTopic.staff.capacity} remaining`
                                    }}
                                    disabled={staffTopic.num_remaining === 0}
                                    unavailable={staffTopic.topic && staffTopic.topic.unavailable}
                                    key={index}
                                />
                            ))
                        )}
                    </DialogContent>
                    <DialogActions>
                        <Button variant='text' onClick={() => this.handleClose()}>Cancel</Button>
                    </DialogActions>
                </Dialog>
            </>
        )
    }
}

const mapStateToProps = (state: any) => ({
    staffList: state.staffTopics.items
})

const mapDispatchToProps = { fetchStaffList, setStudentPlan }

export default connect(mapStateToProps, mapDispatchToProps)(PlanWidget)
