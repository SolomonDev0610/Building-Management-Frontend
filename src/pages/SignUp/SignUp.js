import React, { Component } from 'react'
import SignUpFormComponent from './SignUpFormComponent'

import { Slide, Snackbar, IconButton } from '@material-ui/core'
import { Close } from '@material-ui/icons'

import { graphql, compose } from 'react-apollo'
import { registerUserQuery, loginUserQuery } from 'queries/auth_queries'
import { editUserQuery } from 'queries/user_queries'

import PrivacyPolicyComponent from '../SignIn/PrivacyPolicyComponent'
import TermsAndConditions from '../SignIn/TermsConditionsComponent'

import './SignUp.style.scss'
import axios from 'axios'
import withTitle from 'util/withTitle'

const TransistionDialog = props => {
	return <Slide direction="up" {...props} />
}

@withTitle
@compose(
	graphql(registerUserQuery, { name: 'register_user_query' }),
	graphql(loginUserQuery, { name: 'login_user_query' }),
	graphql(editUserQuery, { name: 'edit_user_query' })
)
class SignUp extends Component {
	constructor() {
		super()

		this.state = {
			is_accept_terms: false,
			tAndCModal: {
				show: false,
			},
			pPModal: {
				show: false,
			},
			signUpForm: {
				pb_register_role: '',
				pb_register_first_name: '',
				pb_register_last_name: '',
				pb_register_company_name: '',
				pb_register_address: '',
				pb_register_mobile_phone: '',
				pb_register_email_address: '',
				pb_register_password: '',
				pb_register_confirm_password: '',
				building_name: '',
				isError: false,
			},
			pb_register_image_profile: null,
			errors: [],
			onSelectedRole: false,
		}
	}

	_transition = props => {
		return <Slide direction="up" {...props} />
	}
	// on click terms and condition link, shows modal
	_handleClickTandCLink = () => {
		this.setState({ tAndCModal: { show: true } })
	}
	_handleClickPPLink = () => {
		this.setState({ pPModal: { show: true } })
	}
	_handleClickTandClinkCancel = () => {
		this.setState({ tAndCModal: { show: false } })
	}
	_handleClickPPCancel = () => {
		this.setState({ pPModal: { show: false } })
	}
	_handleSignUpFormChange = event => {
		let { signUpForm } = this.state
		signUpForm[event.target.name] = event.target.value
		this.setState({ signUpForm })
	}
	__handleSignUpRoleChange = role => {
		this.setState({
			signUpForm: {
				pb_register_role: role,
			},
		})
	}
	_handleSubmitForm = async e => {
		e.preventDefault()
		let {
			pb_register_email_address,
			pb_register_first_name,
			pb_register_last_name,
			pb_register_address,
			pb_register_mobile_phone,
			pb_register_password,
		} = this.state.signUpForm

		let { pb_register_image_profile } = this.state

		if (this.__handleFormValidation().form_is_valid) {
			try {
				await this.props.register_user_query({
					variables: {
						email: pb_register_email_address,
						password: pb_register_password,
						address: pb_register_address,
						firstname: pb_register_first_name,
						lastname: pb_register_last_name,
						phonenumber: pb_register_mobile_phone,
					},
				})

				let loginResult = await this.props.login_user_query({
					variables: {
						email: pb_register_email_address,
						password: pb_register_password,
					},
				})

				localStorage.setItem('pb_user_token', loginResult.data.Login.token)

				if (pb_register_image_profile) {
					//Uploading File of User Request
					const image_profile_data = new FormData()
					image_profile_data.append('file', pb_register_image_profile)
					image_profile_data.append('token', localStorage.getItem('pb_user_token'))
					image_profile_data.append('user_id', loginResult.data.Login.user.id)

					let uploadResponse = await axios.post('/photo/avatar', image_profile_data)

					await this.props.edit_user_query({
						variables: {
							token: localStorage.getItem('pb_user_token'),
							id: loginResult.data.Login.user.id,
							email: pb_register_email_address,
							password: pb_register_password,
							address: pb_register_address,
							firstname: pb_register_first_name,
							lastname: pb_register_last_name,
							phonenumber: pb_register_mobile_phone,
							photo_id: uploadResponse.data.id,
						},
					})
				}

				this.props.history.push('/dashboard')
			} catch (e) {
				console.log('error', e)
				this.setState({
					signUpForm: {
						isError: true,
					},
					errors: [...this.state.errors, e.message],
				})
			}
		} else {
			this.setState({
				signUpForm: {
					isError: true,
				},
				errors: [...this.state.errors, this.__handleFormValidation().errors],
			})
		}
	}
	__handleFormValidation = () => {
		let signupFields = this.state.signUpForm
		let errors = []
		let formIsValid = true

		//First Name
		if (typeof signupFields['pb_register_first_name'] !== 'undefined') {
			if (!signupFields['pb_register_first_name'].match(/^[a-zA-Z]+$/)) {
				formIsValid = false
				errors.push('Letter only format')
			}
		}
		//Last Name
		if (typeof signupFields['pb_register_last_name'] !== 'undefined') {
			if (!signupFields['pb_register_last_name'].match(/^[a-zA-Z]+$/)) {
				formIsValid = false
				errors.push('Letter only format')
			}
		}

		//Email
		if (typeof signupFields['pb_register_email_address'] !== 'undefined') {
			let lastAtPos = signupFields['pb_register_email_address'].lastIndexOf('@'),
				lastDotPos = signupFields['pb_register_email_address'].lastIndexOf('.')

			if (
				!(
					lastAtPos < lastDotPos &&
					lastAtPos > 0 &&
					signupFields['pb_register_email_address'].indexOf('@@') === -1 &&
					lastDotPos > 2 &&
					signupFields['pb_register_email_address'].length - lastDotPos > 2
				)
			) {
				formIsValid = false
				errors.push('Email not valid')
			}
		}

		//Password Field
		if (
			typeof signupFields['pb_register_password'] !== 'undefined' ||
			typeof signupFields['pb_register_confirm_password'] !== 'undefined'
		) {
			if (signupFields['pb_register_password'] !== signupFields['pb_register_confirm_password']) {
				formIsValid = false
				errors.push('Password Fields not equal')
			}

			if (
				signupFields['pb_register_password'].length < 7 ||
				signupFields['pb_register_confirm_password'].length < 7
			) {
				formIsValid = false
				errors.push('Password length must be 8 letters')
			}
		}

		return {
			form_is_valid: formIsValid,
			errors: errors.length !== 0 ? errors : 'No Errors',
		}
	}
	_handleUploadFileSelected = event => {
		this.setState({
			pb_register_image_profile: event.target.files[0],
		})
	}

	_handleCheckTermsandCondition = event => {
		let { is_accept_terms } = this.state
		let target = event.target,
			value = target.checked
		is_accept_terms = value

		this.setState({ is_accept_terms })
	}

	_handleLoginLink = () => {
		this.props.history.push('/signin')
	}

	_handleChangeBuildingInfo = event => {
		let { signUpForm } = this.state
		signUpForm[event.target.name] = event.target.value
		this.setState({ signUpForm })
	}

	_handleCloseModalRoleSelector = () => {
		this.setState({ onSelectedRole: false })
	}

	__handleOpenErrorSignUpForm = () => {
		this.setState({
			signUpForm: {
				isError: true,
			},
		})
	}

	__handleCloseErrorSignUpForm = (event, reason) => {
		if (reason === 'clickaway') {
			return
		}

		this.setState({
			signUpForm: {
				isError: false,
			},
		})
	}

	render() {
		let { signUpForm, tAndCModal, pPModal, onSelectedRole, is_accept_terms, errors } = this.state
		let { pb_register_role } = this.state.signUpForm
		return (
			<div className="sign-up-wrapper">
				<div className="sign-up-img-bg" />
				<div className="sign-up-bg-color" />
				<div className="sign-up-body d-flex flex-column">
					<div className="pb-logo-wrapper">
						<div className="pb-logo" />
					</div>
					<div className="pb-register-wrapper d-flex">
						<div className="pb-register p-30 flex-column">
							<SignUpFormComponent
								onSignUpFormChange={this._handleSignUpFormChange}
								onSignUpFormRoleChange={this.__handleSignUpRoleChange}
								isTermsChecked={is_accept_terms}
								onSignUpClicked={this._handleSubmitForm}
								onClickBackLogin={this._handleLoginLink}
								onUploadImage={this._handleUploadFileSelected}
								currentValueState={signUpForm}
								changedTermsChecked={this._handleCheckTermsandCondition}
								toClickTerms={this._handleClickTandCLink}
								onSelectedRole={pb_register_role}
								openDialogRoleSelection={onSelectedRole}
								onTransistionDialog={TransistionDialog}
								onValueBuildingInfo={signUpForm.building_info}
								onChangeValueBuildingInfo={this._handleChangeBuildingInfo}
								closeDialogRoleSelection={this._handleCloseModalRoleSelector}
							/>
						</div>
					</div>

					<div className="pb-signup-footer d-flex">
						<span className="fs-14">© Copyright 2018 Propertee Butler, All rights reserved.</span>
						<span className="fs-14">
							<button onClick={this._handleClickTandCLink}>Terms and Conditions Apply</button> ||{' '}
							<button onClick={this._handleClickPPLink}>Privacy Policy</button>
							{/*START OF T&C DIALOG*/}
							<TermsAndConditions
								dialogOnShow={tAndCModal.show}
								dialogOnClose={this._handleClickTandClinkCancel}
								dialogOnTransition={this._transition}
							/>
							{/*END OF T&C DIALOG*/}
							{/*START OF PP DIALOG*/}
							<PrivacyPolicyComponent
								dialogOnShow={pPModal.show}
								dialogOnClose={this._handleClickPPCancel}
								dialogOnTransition={this._transition}
							/>
							{/*END OF PP DIALOG*/}
						</span>
					</div>
				</div>
				{errors
					? errors.map((errors, i) => (
							<Snackbar
								key={i}
								anchorOrigin={{
									vertical: 'bottom',
									horizontal: 'center',
								}}
								open={this.state.signUpForm.isError}
								autoHideDuration={5000}
								onClose={this.__handleCloseErrorSignUpForm}
								ContentProps={{
									'aria-describedby': 'error_message_signup',
								}}
								message={<span id="error_message_signup">{errors}</span>}
								action={[
									<IconButton
										key="close"
										aria-label="Close"
										color="inherit"
										onClick={this.__handleCloseErrorSignUpForm}
									>
										<Close />
									</IconButton>,
								]}
							/>
					  ))
					: null}
			</div>
		)
	}
}

export default SignUp
