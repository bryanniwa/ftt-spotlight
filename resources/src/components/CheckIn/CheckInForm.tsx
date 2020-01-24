import axios from 'axios'
import classNames from 'classnames'
import copyToClipboard from 'copy-to-clipboard'
import React from 'react'
import { connect } from 'react-redux'

import {
    Avatar,
    Button,
    Chip,
    CircularProgress,
    Divider,
    FormControlLabel,
    FormHelperText,
    Icon,
    IconButton,
    InputBase,
    Menu,
    MenuItem,
    Paper,
    Switch,
    Tooltip,
    Typography
} from '@material-ui/core'

import { checkIn } from '../../actions/checkinActions'
import { ISnackbar, queueSnackbar } from '../../actions/snackbarActions'
import { ILedgerEntry } from '../../types/calendar'
import { CheckInChip, ICheckInError, ICheckInRequest, ICheckInResponse } from '../../types/checkin'
import {
    appendToLocalStorageArray,
    AUTO_SUBMIT,
    CHECK_IN_CHIPS,
    CHECK_IN_ERRORS,
    getObjectFromLocalStorage,
    writeObjectToLocalStorage,
} from '../../utils/storage'
import { downloadCsv, getCurrentTimestamp, makeArray } from '../../utils/utils'

import ChipSelect, { ISelectChip } from '../ChipSelect'
import { LoadingButton } from '../Form/LoadingButton'
import { LoadingIconButton } from '../Form/LoadingIconButton'
import { ModalSection } from '../ModalSection'
import ConfirmDeleteDialog from './ConfirmDeleteDialog'

// const AUTO_TIMEOUT = 300000 // 5 minutes

type NameFetchState = 'allow' | 'skip' | 'force-allow'

interface IReduxProps {
    checkInResponse: ICheckInResponse
    checkIn: (request: ICheckInRequest) => Promise<any>
    queueSnackbar: (snackbar: ISnackbar) => void
}

interface IProps extends IReduxProps {
    dateTime?: string
    didCheckIn?: () => Promise<any>
    handleOpenErrorsDialog?: () => void
    didReceivedChips?: () => void
    didSubmit?: () => void
    onExceedTimeouts?: () => void
}

interface IState {
    chips: Array<ISelectChip<Date>>
    confirmDeleteDialogOpen: boolean
    errored: boolean
    menuRef: any
    uploading: boolean
}

class CheckInForm extends React.Component<IProps, IState> {
    keyBuffer: number[]

    state: IState = {
        chips: [],
        confirmDeleteDialogOpen: false,
        errored: false,
        menuRef: null,
        uploading: false
    }

    handleCreateChip = (chip: ISelectChip<Date>) => {
        if (!chip) {
            return
        }
        chip.value = new Date()
        chip.title = chip.value.toString()
        this.setState((state: IState) => ({
            chips: [...state.chips, chip]
        }))
    }

    handleRemoveChip = (index: number) => {
        // const removeIndex: number = this.findChip(chip)
        this.setState((state: IState) => {
            state.chips.splice(index, 1)
            return { chips: state.chips }
        }, () => {
            writeObjectToLocalStorage(CHECK_IN_CHIPS, this.state.chips)
        })
    }

    /*
    findChip = (chip: CheckInChip): number => {
        for (let i = 0; i < this.state.chips.length; i ++) {
            const pivot: CheckInChip = this.state.chips[i]
            if (chip.type === 'id' && pivot.type === 'id') {
                if (chip.value.id === pivot.value.id) {
                    return i
                }
            } else if (chip.type === 'student_number' && this.state.chips[i].type === 'student_number') {
                if (chip.value === pivot.value) {
                    return i
                }
            }
        }
        return -1
    }
    */

    /*
    replaceChip = (newChip: CheckInChip, index: number) => {
        const newChips: CheckInChip[]
            = this.state.chips.reduce((acc: CheckInChip[], chip: CheckInChip, idx: number) => {
            if (index === idx) {
                acc.push(newChip)
            } else {
                acc.push(chip)
            }
            return acc
        }, [])
        this.setState({ chips: newChips })
    }
    */

    /*
    fetchStudent = (chip: CheckInChip) => {
        if (chip.type !== 'student_number') {
            return
        }

        const index: number = this.findChip(chip)
        let replacementChip: CheckInChip = { ...chip, loading: false }
        if (this.state.nameFetchState !== 'skip') {
            axios.get(`/api/students/student-number/${chip.value}`, { timeout: 2500 })
                .then((res: any) => {
                    replacementChip = {
                        type: 'id',
                        time: chip.time,
                        date_time: chip.date_time,
                        value: res.data,
                        loading: false
                    }
                    this.replaceChip(replacementChip, index)
                })
                .catch((error: any) => {
                    if (error.code === 'ECONNABORTED') {
                        // Connection timed out
                        this.setState((state: IState) => {
                            const skipNameFetch: boolean = state.timedOutChips >= 2 && state.nameFetchState !== 'force-allow'
                            if (skipNameFetch && this.props.onExceedTimeouts) {
                                this.props.onExceedTimeouts()
                            }
                            return {
                                nameFetchState: skipNameFetch ? 'skip' : state.nameFetchState,
                                timedOutChips: state.timedOutChips + 1
                            }
                        })
                    }
                    this.replaceChip(replacementChip, index)
                })
        }
    }
    */

    showResults = () => {
        const success: ILedgerEntry[] = this.props.checkInResponse.success
        const errors: string[] = this.props.checkInResponse.errors
        const checkInError: ICheckInError = {
            timestamp_string: this.props.checkInResponse.timestamp_string,
            errors
        }
        if (errors.length > 0) {
            appendToLocalStorageArray(CHECK_IN_ERRORS, checkInError)
        }
        const message: string = success.length > 0
            ? `Checked in ${success.length} ${success.length === 1 ? 'student' : 'students'}${errors && errors.length > 0
                ? `, but ${errors.length} ${errors.length === 1 ? 'entry' : 'entries'} could not be resolved` : ''
            }.`
            : 'No students could be checked in.'
        this.props.queueSnackbar({
            message,
            buttons: errors && errors.length > 0 && this.props.handleOpenErrorsDialog ? [{
                value: 'Show Errors', callback: () => this.props.handleOpenErrorsDialog()
            }] : undefined,
            links: !this.props.handleOpenErrorsDialog ? [{
                value: 'Show Errors', to: '/check-in/#errors'
            }] : undefined,
            key: 'CHECKED_IN_SUCCESSFULLY'
        })
    }

    handleSubmit = () => {
        if (this.state.chips.length === 0) {
            return
        }
        this.setState({ uploading: true })
        if (this.props.didSubmit) {
            this.props.didSubmit()
        }

        /*
        const request: ICheckInRequest = {
            chips: this.state.chips,
        }

        this.props.checkIn(request)
            .then(() => {
                if (this.props.didCheckIn) {
                    this.props.didCheckIn().then(() => {
                        this.showResults()
                        this.setState({
                            uploading: false,
                            chips: [],
                        })
                        localStorage.removeItem(CHECK_IN_CHIPS)
                    })
                } else {
                    this.showResults()
                    this.setState({
                        uploading: false
                    })
                }
            })
            .catch((error: any) => {
                this.setState({
                    errored: true,
                    uploading: false
                })
            })
        */
    }
/*
    toggleAutoSubmit = () => {
        this.setState((state: IState) => {
            if (state.autoSubmit) {
                this.removeAutoSubmit()
                writeObjectToLocalStorage(AUTO_SUBMIT, 0)
                return { autoSubmit: false }
            } else {
                this.refreshAutoSubmit()
                writeObjectToLocalStorage(AUTO_SUBMIT, 1)
                return { autoSubmit: true }
            }
        })
    }

    getAutoSubmitState = () => {
        this.setState({ autoSubmit: true })
    }

    refreshAutoSubmit = () => {
        if (this.timer) {
            clearInterval(this.timer)
        }
        this.timer = window.setInterval(() => this.handleSubmit(), AUTO_TIMEOUT)
    }

    removeAutoSubmit = () => {
        // Clear polling timer
        clearInterval(this.timer)
        this.timer = null
    }
*/

    handleMenuClick = (callback: () => void) => {
        this.handleMenuClose()
        callback()
    }

    handleCopyChips = () => {
        const clipboardData: string = this.state.chips
            .map((chip: ISelectChip<Date>) => chip.label.trim())
            .join(', ')
        copyToClipboard(clipboardData)
        this.props.queueSnackbar({ message: 'Copied Student Numbers to clipboard.' })
    }

    handleDownloadChips = () => {
        const rows: string[][] = [
            ['Student Number', 'Timestmap'],
            ...this.state.chips.map((chip: ISelectChip<Date>): string[] => [chip.label, chip.value.toISOString()])
        ]
        const dateString: string = new Date().toISOString()
        const filename: string = `SpotlightStudentNumbers - ${dateString}`
        downloadCsv(rows, filename)
        this.props.queueSnackbar({ message: 'Downloaded Student Numbers.' })
    }

    handleRemoveAllChips = () => {
        this.setState({ chips: [] })
        this.props.queueSnackbar({ message: 'Removed all Student Numbers.' })
    }

    handleMenuOpen = (event: any) => {
        this.setState({ menuRef: event.currentTarget })
    }

    handleMenuClose = () => {
        this.setState({ menuRef: null })
    }

    componentDidMount() {
        // const autoSubmit: boolean = Boolean(getObjectFromLocalStorage(AUTO_SUBMIT))
        // this.setState({ autoSubmit })
        // this.refreshAutoSubmit()
        /*
        this.keyBuffer = []
        const localStorageChips = makeArray(getObjectFromLocalStorage(CHECK_IN_CHIPS)) as CheckInChip[]
        if (localStorageChips.length > 0) {
            this.setState({ chips: localStorageChips }, () => {
                this.state.chips.forEach((chip: CheckInChip) => { this.fetchStudent(chip) })
            })
            this.props.didReceivedChips()
        }
        */
    }

    render() {
        const hasChips: boolean = this.state.chips.length > 0
        const menuOpen: boolean = Boolean(this.state.menuRef)

        return (
            <>
                <ModalSection
                    badgeCount={this.state.chips.length}
                    icon='keyboard'
                    title='Scan or Enter'
                    labelAdornment={
                        <>{/*
                        <FormControlLabel
                            control={
                                <Switch
                                    checked={this.state.autoSubmit}
                                    color='primary'
                                    onChange={() => this.toggleAutoSubmit()}
                                />
                            }
                            label={<Typography>Auto-Submit</Typography>}
                        />*/}
                        </>
                    }
                >
                    <ChipSelect
                        chips={this.state.chips}
                        onCreateChip={this.handleCreateChip}
                        onRemoveChip={this.handleRemoveChip}
                        loading={this.state.uploading}
                        placeholder='Enter Student Numbers'
                        helperText={undefined}
                    />
                    <div className='check_in_actions'>
                        <div>
                            <LoadingButton
                                variant='contained'
                                color='primary'
                                disabled={!hasChips}
                                loading={this.state.uploading}
                            >Check In</LoadingButton>
                        </div>
                        <div>
                            <IconButton onClick={this.handleMenuOpen} disabled={this.state.chips.length === 0}><Icon>more_horiz</Icon></IconButton>
                            <Menu
                                open={menuOpen}
                                onClose={this.handleMenuClose}
                                anchorEl={this.state.menuRef}
                                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                                getContentAnchorEl={undefined}
                                transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                            >
                                <MenuItem onClick={() => this.handleMenuClick(() => this.setState({ confirmDeleteDialogOpen: true }))}>Remove All</MenuItem>
                                <MenuItem onClick={() => this.handleMenuClick(this.handleCopyChips)}>Copy to Clipboard</MenuItem>
                                <MenuItem onClick={() => this.handleMenuClick(this.handleDownloadChips)}>Download Student Numbers</MenuItem>
                            </Menu>
                        </div>
                    </div>
                </ModalSection>
                <ConfirmDeleteDialog
                    open={this.state.confirmDeleteDialogOpen}
                    onClose={() => this.setState({ confirmDeleteDialogOpen: false })}
                    onSubmit={() => this.handleRemoveAllChips()}
                />
            </>
        )
    }
}

const mapStateToProps = (state: any) => ({
    checkInResponse: state.checkin.response
})
const mapDispatchToProps = {
    checkIn,
    queueSnackbar
}

export default connect(mapStateToProps, mapDispatchToProps)(CheckInForm)
