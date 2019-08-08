import * as React from 'react'

import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    TextField
} from '@material-ui/core'

import { LoadingButton } from '../Form/LoadingButton'
import { verifyPassword } from '../../utils/utils'
// import { EnhancedDialogTitle } from './EnhancedDialogTitle'

interface IProps {
    open: boolean
    onClose: () => void
    onSubmit: (password: string) => void
}

export const ConfirmPasswordDialog = (props: IProps) => {
    const [password, setPassword]: [string, React.Dispatch<React.SetStateAction<string>>] = React.useState('')
    const [loading, setLoading]: [boolean, React.Dispatch<React.SetStateAction<boolean>>] = React.useState(false)
    const [errored, setErrored]: [boolean, React.Dispatch<React.SetStateAction<boolean>>] = React.useState(false)

    const helperText: string = 'That didn\'t work. Please try again.'

    const handleAuthorization = () => {
        setLoading(true)
        setErrored(false)
        verifyPassword(password)
            .then((res: any) => {
                setLoading(false)
                props.onClose()
                
        props.onSubmit(password)
            })
            .catch((reason: any) => {
                setLoading(false)
                setErrored(true)
            })
        return
    }

    const onExited = () => {
        setPassword('')
    }

    return (
        <Dialog open={props.open} onExited={() => onExited()}>
            <DialogTitle>Confirm Authorization</DialogTitle>
            <DialogContent>
                <DialogContentText>This action requires you to confirm your password.</DialogContentText>
                <TextField
                    name='password'
                    value={password}
                    autoComplete={'off'}
                    onChange={(event: any) => setPassword(event.target.value)}
                    disabled={loading}
                    error={errored}
                    helperText={errored ? helperText : undefined}
                    variant='outlined'
                    type='password'
                    label="Password"
                    fullWidth
                    required
                    margin='normal'
                />
            </DialogContent>
            <DialogActions>
                <Button variant='text' onClick={() => props.onClose()}>Cancel</Button>
                <LoadingButton
                    type='submit'
                    loading={loading}
                    variant='text'
                    color='primary'
                    disabled={password.length === 0}
                    onClick={() => handleAuthorization()}
                >Continue</LoadingButton>
            </DialogActions>
        </Dialog>
    )
}