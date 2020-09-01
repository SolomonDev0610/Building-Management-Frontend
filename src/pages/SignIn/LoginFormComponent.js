import React, { Component } from 'react'
import { Button, TextField } from '@material-ui/core'

import ForgotPasswordDialog from './ForgotPasswordDialog'
import ResendEmailDialog from './ResendEmailDialog'

export default class LoginFormComponent extends Component {
	render() {
		const {
			onSignInFormChange,
			onForgotPasswordShow,
			onForgotPasswordClose,
			onForgotPasswordClicked,
			onResendEmailShow,
			onResendEmailClose,
			onResendEmailClicked,
			onSignInClicked,
			onClickRegister,
			onForgotPasswordSubmit,
		} = this.props
		return (
			<div className="login-option">
				<ForgotPasswordDialog
					show={onForgotPasswordShow}
					onClose={onForgotPasswordClose}
					onSubmit={onForgotPasswordSubmit}
				/>

				<ResendEmailDialog
					onResendEmailClicked={onResendEmailClicked}
					onResendEmailShow={onResendEmailShow}
					onResendEmailClose={onResendEmailClose}
				/>

				<form onSubmit={onSignInClicked}>
					<span className="font-xl pb-30">LOGIN</span>
					<div className="pb-form-body">
						<TextField
							id="email"
							label="Email Address"
							fullWidth
							required
							margin="normal"
							name="pb_login_email_address"
							onChange={onSignInFormChange}
						/>
						<TextField
							id="password-input"
							fullWidth
							required
							label="Password"
							type="password"
							autoComplete="current-password"
							margin="normal"
							name="pb_login_password"
							onChange={onSignInFormChange}
						/>
						<div className="d-flex pt-20 flex-row justify-content-between">
							<span className="login-links" onClick={onForgotPasswordClicked}>
								Forgot Password
							</span>

							<span className="login-links text-right" onClick={onResendEmailClicked}>
								Didn&#39;t get verification email?
							</span>
						</div>
					</div>

					<div className="button-actions d-flex pt-50 flex-row justify-content-end align-items-center">
						<Button className="button-action-login ml-10" type="submit">
							LOGIN
						</Button>
						<Button className="button-action-register ml-10" onClick={onClickRegister}>
							REGISTER
						</Button>
					</div>
				</form>
			</div>
		)
	}
}
