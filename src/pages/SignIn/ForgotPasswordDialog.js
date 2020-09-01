import React, { useState } from 'react'
import {
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogContentText,
	DialogTitle,
	TextField,
} from '@material-ui/core'

const ForgotPasswordDialog = ({ show, onClose, onSubmit }) => {
	const [email, setEmail] = useState('')

	return (
		<Dialog open={show} onClose={onClose} aria-labelledby="form-dialog-title">
			<form onSubmit={e => onSubmit(e, { email })}>
				<DialogTitle id="form-dialog-title">Reset Password</DialogTitle>
				<DialogContent>
					<DialogContentText>
						To change your password, please enter your email address here.
						<br />
						We will send your new password shortly.
					</DialogContentText>
					<TextField
						type="email"
						id="name"
						label="Email Address"
						value={email}
						onChange={e => setEmail(e.target.value)}
						margin="dense"
						autoFocus
						fullWidth
					/>
				</DialogContent>
				<DialogActions>
					<Button
						onClick={onClose}
						color="secondary"
						variant="contained"
						style={{ backgroundColor: '#757575 !important' }}
					>
						Cancel
					</Button>
					<Button type="submit" color="primary" variant="contained">
						Submit
					</Button>
				</DialogActions>
			</form>
		</Dialog>
	)
}

export default ForgotPasswordDialog
