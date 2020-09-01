import React from 'react'
import { Dialog, DialogActions, DialogContent, DialogTitle, Button, Slide, DialogContentText } from '@material-ui/core'
import { graphql } from 'react-apollo'
import { loginUserQuery } from 'queries/auth_queries'
import LoginFormComponent from './LoginFormComponent'
import PrivacyPolicyComponent from './PrivacyPolicyComponent'
import TermsAndConditions from './TermsConditionsComponent'
// import '../DemoContainer/Demo.container.scss'
import './SignIn.style.scss'
import withTitle from 'util/withTitle'
import axios from 'axios'

@withTitle
@graphql(loginUserQuery, { name: 'login_user_query' })
class SignIn extends React.Component {
	state = {
		loginDialogModal: {
			show: false,
		},
		forgotPasswordModal: {
			show: false,
		},
		resendEmailModal: {
			show: false,
		},
		tAndCModal: {
			show: false,
		},
		pPModal: {
			show: false,
		},
		signInForm: {
			state: true,
			form: {
				pb_login_email_address: '',
				pb_login_password: '',
			},
			error: '',
			is_error: false,
		},
		buildingsModal: {
			type: '',
			loadCurrentData: true,
			show: false,
			data: {
				tenancyManagers: [],
				buildingManagers: [],
				buildingOwners: [],
			},
		},
		userToSetLocalItem: {
			pb_user_token: '',
			pb_user_id: '',
			pb_photo_user_id: '',
		},
	}

	// fullscreen modal transition
	_transition = props => {
		return <Slide direction="up" {...props} />
	}

	// on click forgot password link, shows form modal
	_handleClickForgotPass = () => {
		this.setState({ forgotPasswordModal: { show: true } })
	}

	// on click forgot password cancel
	_handleClickForgotPassCancel = () => {
		this.setState({ forgotPasswordModal: { show: false } })
	}

	handleSubmitForgotPass = async (e, data) => {
		e.preventDefault()

		console.log('forgot password', data)

		await axios.post('/request-password-reset', { email: data.email })

		alert('yeah boy')

		this.setState({ forgotPasswordModal: { show: false } })
	}

	// on click resend email link, shows form modal
	_handleClickResendEmail = () => {
		this.setState({ resendEmailModal: { show: true } })
	}

	// on click resend email cancel
	_handleClickResendEmailCancel = () => {
		this.setState({ resendEmailModal: { show: false } })
	}

	// on click terms and condition link, shows modal
	_handleClickTandCLink = () => {
		this.setState({ tAndCModal: { show: true } })
	}

	// on click T&C cancel
	_handleClickTandClinkCancel = () => {
		this.setState({ tAndCModal: { show: false } })
	}

	// on click PP link, shows modal
	_handleClickPPLink = () => {
		this.setState({ pPModal: { show: true } })
	}

	// on click PP cancel
	_handleClickPPCancel = () => {
		this.setState({ pPModal: { show: false } })
	}

	_handleLoginDialog = async event => {
		event.preventDefault()

		let { pb_login_email_address, pb_login_password } = this.state.signInForm.form

		try {
			let result = await this.props.login_user_query({
				variables: {
					email: pb_login_email_address,
					password: pb_login_password,
				},
			})

			if (result.data) {
				localStorage.setItem('pb_user_token', result.data.Login.token)
				this.props.history.push('/dashboard')
			}
		} catch (err) {
			console.log(err)

			this.setState({
				signInForm: {
					...this.state.signInForm,
					is_error: true,
					error: 'Invalid Credentials',
				},
			})
		}
	}

	__setErrorModal = () => {}

	_handleCloseLoginDialog = () => {
		this.setState({ loginDialogModal: { show: false } })
	}

	// button handle that switches sign in to sign up form
	_handleRegisterLink = () => {
		this.props.history.push('/signup')
	}

	// button handle that switches sign up to sign in form
	_handleLoginLink = () => {
		let { signInForm, signUpForm } = this.state
		signUpForm.state = false
		signInForm.state = true
		this.setState({ signInForm, signUpForm })
	}

	// on change text for sign in
	_handleSignInFormChange = event => {
		let { signInForm } = this.state
		signInForm.form[event.target.name] = event.target.value.toString()
		this.setState({ signInForm })
	}

	_handleCheckTermsandCondition = event => {
		let { signUpForm } = this.state
		let target = event.target,
			value = target.checked
		signUpForm.form[event.target.name] = value

		this.setState({ signUpForm })
	}

	_handleCloseErrorToast = () => {}

	_handleCloseDashCard = () => {}

	__handleErrorUserCredentialsOpen = () => {
		let { is_error, error } = this.state.signInForm
		is_error = true
		error = 'Invalid Credentials'
		this.setState({ is_error, error })
	}
	__handleErrorUserCredentialsClose = () => {
		this.setState({
			signInForm: {
				...this.state.signInForm,
				is_error: false,
				error: '',
			},
		})
	}

	render() {
		let { forgotPasswordModal, resendEmailModal, tAndCModal, pPModal } = this.state

		let { error, is_error } = this.state.signInForm

		return (
			<div className="sign-in-wrapper d-flex">
				<div className="sign-in-img-bg" />
				<div className="sign-in-bg-color" />
				<div className="sign-in-body d-flex flex-column">
					<div className="pb-logo-wrapper">
						<div className="pb-logo" />
					</div>

					<div className="pb-login-wrapper d-flex">
						<div className="pb-login flex-column">
							<LoginFormComponent
								onSignInFormChange={this._handleSignInFormChange}
								onForgotPasswordShow={forgotPasswordModal.show}
								onForgotPasswordClose={this._handleClickForgotPassCancel}
								onForgotPasswordClicked={this._handleClickForgotPass}
								onForgotPasswordSubmit={this.handleSubmitForgotPass}
								onResendEmailShow={resendEmailModal.show}
								onResendEmailClose={this._handleClickResendEmailCancel}
								onResendEmailClicked={this._handleClickResendEmail}
								onSignInClicked={this._handleLoginDialog}
								onClickRegister={this._handleRegisterLink}
								onErrorLogin={is_error}
							/>
						</div>
					</div>

					<div className="pb-login-footer d-flex">
						<span className="fs-14">© Copyright 2018 Propertee Butler, All rights reserved.</span>
						<span className="fs-14">
							<button onClick={this._handleClickTandCLink}>Terms and Conditions Apply</button> ||{' '}
							<button onClick={this._handleClickPPLink}>Privacy Policy</button>
							<TermsAndConditions
								dialogOnShow={tAndCModal.show}
								dialogOnClose={this._handleClickTandClinkCancel}
								dialogOnTransition={this._transition}
							/>
							<PrivacyPolicyComponent
								dialogOnShow={pPModal.show}
								dialogOnClose={this._handleClickPPCancel}
								dialogOnTransition={this._transition}
							/>
						</span>
					</div>
				</div>
				{is_error === true ? (
					<Dialog
						open={is_error}
						onClose={this.__handleErrorUserCredentialsClose}
						aria-labelledby="error_user_credentials"
						aria-describedby="error_user_credentials_description"
						style={{
							maxHeight: 280,
							position: 'absolute',
							margin: 'auto',
							top: 0,
							right: 0,
							bottom: 0,
							left: 0,
						}}
					>
						<DialogTitle id="error_user_credentials">Error: </DialogTitle>
						<DialogContent>
							<DialogContentText id="error_user_credentials_description">{error}</DialogContentText>
						</DialogContent>
						<DialogActions>
							<Button
								onClick={this.__handleErrorUserCredentialsClose}
								color="primary"
								variant="contained"
								autoFocus
							>
								Close
							</Button>
						</DialogActions>
					</Dialog>
				) : null}
			</div>
		)
	}
}

export default SignIn
