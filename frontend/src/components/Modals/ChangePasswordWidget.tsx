import React from 'react'
import { connect } from 'react-redux'

import {
    Button,
    Card,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    Icon,
    IconButton,
    InputAdornment,
    TextField,
    Tooltip,
    Typography
} from '@material-ui/core'

import { ISnackbar, queueSnackbar } from '../../actions/snackbarActions'
import { changePassword } from '../../utils/http'

import { LoadingButton } from '../Form/LoadingButton'
import { EnhancedDialogTitle } from './EnhancedDialogTitle'

interface IReduxProps {
    queueSnackbar: (snackbar: ISnackbar) => void
}

interface IProps extends IReduxProps {
    disallowed?: string[]
    isRequiredChange?: boolean
    variant: 'dialog' | 'persistant'
    onChangePassword?: () => void
    onClose?: () => void
    onSignOut?: () => Promise<any>
}

interface IState {
    oldPassword: string
    newPassword: string
    confirmPassword: string
    showPassword: boolean
    loading: boolean
    loadingSignOut: boolean
    errored: boolean
    passwordTooShort: boolean
    unmatchedPasswords: boolean
    disallowedPassword: boolean
    open: boolean
}

const initialState: IState = {
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
    showPassword: false,
    loading: false,
    loadingSignOut: false,
    errored: false,
    passwordTooShort: false,
    unmatchedPasswords: false,
    disallowedPassword: false,
    open: false
}

class ChangePasswordWidget extends React.Component<IProps, IState> {
    state: IState = initialState

    handleOpen = () => {
        this.setState({ open: true })
    }

    handleClose = () => {
        this.setState({ open: false })
        if (this.props.onSignOut) {
            this.setState({ loadingSignOut: true })
            this.props.onSignOut().then(() => {
                this.setState({ loadingSignOut: false })
                if (this.props.onClose) {
                    this.props.onClose()
                }
            })
        } else if (this.props.onClose) {
            this.props.onClose()
        }
    }

    handleSubmit = () => {
        if (this.state.newPassword.length < 8) {
            this.setState({ passwordTooShort: true })
            return
        } else if (!this.state.showPassword && this.state.newPassword !== this.state.confirmPassword) {
            this.setState({ unmatchedPasswords: true })
            return
        } else if (this.props.disallowed
            && this.props.disallowed.some((password: string) => password === this.state.newPassword)) {
            this.setState({ disallowedPassword: true })
            return
        }
        this.setState({
            loading: true,
            errored: false
        })

        changePassword(this.state.oldPassword, this.state.newPassword)
            .then(() => {
                this.setState(initialState)
                if (this.props.onChangePassword) {
                    this.props.onChangePassword()
                } else {
                    this.props.queueSnackbar({ message: 'Changed passsword.' })
                }
            })
            .catch(() => {
                this.setState({
                    loading: false,
                    errored: true
                })
            })
    }

    handleChange = (event: any, field: 'old' | 'new' | 'confirm') => {
        if (this.state.loading) {
            return
        }
        const value: string = event.target.value
        this.setState({ errored: false })
        switch (field) {
            case 'old':
                this.setState({ oldPassword: value })
                return
            case 'new':
                this.setState({
                    passwordTooShort: false,
                    disallowedPassword: false,
                    newPassword: value
                })
                return
            case 'confirm':
                this.setState({
                    confirmPassword: value,
                    unmatchedPasswords: false
                })
                return
        }
    }

    toggleShowPassword = () => {
        if (this.state.loading) {
            return
        }
        if (this.state.showPassword) {
            this.setState({
                showPassword: false,
                confirmPassword: ''
            })
        } else {
            this.setState({ showPassword: true })
        }
    }

    render() {
        const passwordForm = (
            <>
                <EnhancedDialogTitle
                    title='Change Password'
                    onClose={this.props.variant === 'dialog' ? this.handleClose : undefined}
                />
                <DialogContent>
                    {this.props.isRequiredChange && (
                        // tslint:disable-next-line: max-line-length
                        <DialogContentText color='error'>Your old password has expired and must be changed.</DialogContentText>
                    )}
                    {/*tslint:disable-next-line: max-line-length*/}
                    <DialogContentText>Enter your old password, followed by your new password. Passwords must be at least 8 characters long.</DialogContentText>
                    <TextField
                        name='old_password'
                        label='Old Password'
                        variant='outlined'
                        type='password'
                        value={this.state.oldPassword}
                        onChange={(event: any) => this.handleChange(event, 'old')}
                        fullWidth
                        autoFocus
                        required
                        error={this.state.errored}
                        helperText={this.state.errored ? 'That didn\'t work. Please try again.' : undefined}
                        margin='normal'
                    />
                    <TextField
                        name='new_password'
                        label='New Password'
                        variant='outlined'
                        type={this.state.showPassword && !this.state.loading ? 'text' : 'password'}
                        value={this.state.newPassword}
                        onChange={(event: any) => this.handleChange(event, 'new')}
                        fullWidth
                        required
                        error={this.state.passwordTooShort || this.state.disallowedPassword}
                        helperText={
                            this.state.passwordTooShort
                                ? 'Password must be at least 8 characters.'
                                : (this.state.disallowedPassword ? 'You cannot use that password.' : undefined)
                        }
                        margin='normal'
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position='end'>
                                    <IconButton
                                        edge='end'
                                        onClick={() => this.toggleShowPassword()}
                                    >
                                        <Icon>{this.state.showPassword ? 'visibility_off' : 'visibility'}</Icon>
                                    </IconButton>
                                </InputAdornment>
                            ),
                        }}
                    />
                    {!this.state.showPassword && (
                        <TextField
                            name='confirm_password'
                            label='Confirm Password'
                            variant='outlined'
                            type='password'
                            value={this.state.confirmPassword}
                            onChange={(event: any) => this.handleChange(event, 'confirm')}
                            fullWidth
                            required={!this.state.showPassword}
                            error={this.state.unmatchedPasswords}
                            helperText={this.state.unmatchedPasswords ? 'Passwords don\'t match.' : undefined}
                            margin='normal'
                        />
                    )}
                </DialogContent>
                <DialogActions>
                    <LoadingButton
                        variant='text'
                        onClick={() => this.handleClose()}
                        loading={this.state.loadingSignOut}
                    >Cancel</LoadingButton>
                    <LoadingButton
                        variant='contained'
                        color='primary'
                        onClick={() => this.handleSubmit()}
                        loading={this.state.loading}
                        disabled={this.state.oldPassword.length === 0 || this.state.newPassword.length === 0}
                    >Submit</LoadingButton>
                </DialogActions>
            </>
        )

        return (
            this.props.variant === 'persistant' ? (
                <Card className='change_password_card'>{passwordForm}</Card>
            ) : (
                <>
                    <Tooltip title='Change Password'>
                        <IconButton onClick={() => this.handleOpen()}>
                            <Icon>lock</Icon>
                        </IconButton>
                    </Tooltip>
                    <Dialog open={this.state.open}>{passwordForm}</Dialog>
                </>
            )
        )
    }
}

const mapDispatchToProps = { queueSnackbar }
export default connect(null, mapDispatchToProps)(ChangePasswordWidget)
