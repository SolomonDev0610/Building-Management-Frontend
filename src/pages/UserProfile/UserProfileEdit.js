import React, { Component } from 'react'
import './userprofile.style.scss'
import {
	Button,
	TextField,
	Grid,
	Dialog,
	DialogTitle,
	DialogContent,
	DialogContentText,
	DialogActions,
	Paper,
	Typography,
} from '@material-ui/core'
import ContentHeader from 'components/ContentHeader/ContentHeader.component'
import FormComponent from 'components/FormComponent/Form.component'
import DialogEvent from 'components/DialogEvent/DialogEvent.component'
import { getUserQuery, editUserQuery, changePasswordQuery } from 'queries/user_queries'
import { loginUserQuery } from 'queries/auth_queries'
import { compose, graphql } from 'react-apollo'
import Page from 'components/Page'
import defaultUserPhoto from 'assets/img/default-user.png'

import config from 'config'
import axios from 'axios'
import { getDecodedToken } from 'util/helpers'
import withTitle from 'util/withTitle'
import query from 'util/query'

@query((_) => ({
	query: getUserQuery,
	variables: {
		token: localStorage.getItem('pb_user_token'),
		id: getDecodedToken().user.id,
	},
	fetchPolicy: 'cache-and-network',
}))
@compose(
	graphql(editUserQuery, { name: 'edit_user_query' }),
	graphql(changePasswordQuery, { name: 'change_pass_query' }),
	graphql(loginUserQuery, { name: 'user_logged_to_enter' })
)
@withTitle
class UserProfile extends Component {
	state = {
		form: {},
		password_form: {
			pb_edit_password: '',
			pb_edit_confirm_password: '',
			error_change_password: false,
		},
		password: '',
		passwordDialog: false,
		successChangePassDialog: false,
		successEditUserDialog: false,
	}

	__handleOpenDialogPassword = () => {
		this.setState({
			passwordDialog: true,
		})
	}

	__handleCloseDialogPassword = () => {
		this.setState({
			passwordDialog: false,
		})
	}

	__handleCloseEventDialogChangePass = () => {
		this.setState({
			successChangePassDialog: false,
		})
	}

	__handleCloseEventDialogEditUserData = () => {
		this.setState({
			successEditUserDialog: false,
		})
		window.location.reload()
	}

	__handleUploadFileEdit = (event) => {
		if (event.target.files[0] && event.target.files[0] !== this.state.edit_form.pb_edit_image_profile) {
			this.setState({
				edit_form: {
					...this.state.edit_form,
					pb_edit_image_profile: event.target.files[0],
				},
				image_recently_upload: URL.createObjectURL(event.target.files[0]),
			})
		}
	}

	__submitEditData = () => {
		let { form } = this.state

		this.props
			.user_logged_to_enter({
				variables: {
					email: this.getFormValue('email'),
					password: this.state.password,
				},
			})
			.then((result) => {
				if (result.data) {
					this.setState({
						passwordDialog: false,
					})
					if (form.image !== undefined) {
						const image_profile_data = new FormData()
						image_profile_data.append('file', form.image)
						image_profile_data.append('token', localStorage.getItem('pb_user_token'))
						image_profile_data.append('user_id', getDecodedToken().user.id)

						axios.post('/photo/avatar', image_profile_data).then((res) => {
							if (res.data) {
								this.props
									.edit_user_query({
										variables: {
											token: localStorage.getItem('pb_user_token'),
											...this.props.query.data.users[0],
											...form,
											photo_id: res.data.id,
										},
									})
									.then((result) => {
										if (result.data) {
											this.props.history.push('/dashboard')
										}
									})
							}
						})
					} else {
						this.props
							.edit_user_query({
								variables: {
									token: localStorage.getItem('pb_user_token'),
									...this.props.query.data.users[0],
									...form,
								},
							})
							.then((result) => {
								if (result.data) {
									this.props.history.push('/dashboard')
								}
							})
					}
				} else {
					alert('Wrong Password')
				}
			})
	}

	__submitChangePassword = () => {
		let { password_form } = this.state
		if (password_form.pb_edit_password !== password_form.pb_edit_confirm_password) {
			password_form.error_change_password = true
			this.setState({ password_form })
		} else {
			this.props
				.change_pass_query({
					variables: {
						token: localStorage.getItem('pb_user_token'),
						id: getDecodedToken().user.id,
						password: password_form.pb_edit_password,
					},
				})
				.then((result) => {
					if (result.data) {
						this.setState({
							successChangePassDialog: true,
							password_form: {
								pb_edit_password: '',
								pb_edit_confirm_password: '',
							},
						})
					}
				})
		}
	}

	setFormValue = (form) => (event) => {
		this.setState({
			[form]: {
				...this.state[form],
				[event.target.name]:
					event.target.files && event.target.files.length ? event.target.files[0] : event.target.value,
			},
		})
	}

	getFormValue = (key, defaultValue = '') => {
		return this.state.form[key] !== undefined
			? this.state.form[key]
			: this.props.query.data.users
			? this.props.query.data.users[0][key]
			: defaultValue
	}

	render() {
		let { password_form, successChangePassDialog, successEditUserDialog } = this.state

		let user_photo = this.state.form.image
			? URL.createObjectURL(this.state.form.image)
			: this.props.query.data.users && this.props.query.data.users[0].photo
			? config.URL + this.props.query.data.users[0].photo.path
			: null

		return (
			<Page>
				<div className="page-content profile-form-content">
					<ContentHeader
						addbutton={{
							visible: false,
							onClick: this._clickAdd,
						}}
						visibleBack={true}
						title="Edit Profile"
						breadcrumb={[
							{
								name: 'Dashboard',
								link: '/dashboard',
							},
							{
								name: 'Edit Profile',
							},
						]}
					/>
					<div className="body d-flex">
						<FormComponent>
							<div className="pb-form-description mb-10">
								<span>All fields marked with an asterisk (*) are compulsory.</span>
							</div>
							<div className="row">
								<div className="col-4  d-flex align-items-center justify-content-center flex-column">
									<div className="profile-container">
										<img
											src={user_photo || defaultUserPhoto}
											alt="edit profile"
											style={{ objectFit: 'cover' }}
										/>
									</div>
									<input
										ref={'edit-profile-image'}
										type="file"
										className="file-upload"
										name="image"
										onChange={this.setFormValue('form')}
									/>
								</div>
								<div className="col-8 form-col">
									<Grid container spacing={16}>
										<Grid item xs={6}>
											<TextField
												fullWidth
												required
												label="First Name"
												type="text"
												autoComplete=""
												margin="normal"
												name="firstname"
												value={this.getFormValue('firstname')}
												onChange={this.setFormValue('form')}
											/>
										</Grid>
										<Grid item xs={6}>
											<TextField
												fullWidth
												required
												label="Last Name"
												type="text"
												autoComplete=""
												margin="normal"
												name="lastname"
												value={this.getFormValue('lastname')}
												onChange={this.setFormValue('form')}
											/>
										</Grid>
									</Grid>

									<TextField
										fullWidth
										required
										label="Address"
										type="text"
										autoComplete=""
										margin="normal"
										value={this.getFormValue('lastname')}
										onChange={this.setFormValue('form')}
									/>

									{/* <TextField
											fullWidth
											label="Company Name"
											type="text"
											autoComplete=""
											margin="normal"
											name="company"
											value={this.getFormValue('company')}
											onChange={this.setFormValue('form')}
										/> */}

									<TextField
										fullWidth
										required
										label="Email"
										type="text"
										autoComplete=""
										margin="normal"
										name="email"
										value={this.getFormValue('email')}
										onChange={this.setFormValue('form')}
									/>

									<TextField
										fullWidth
										required
										label="Mobile Number"
										type="text"
										autoComplete=""
										margin="normal"
										name="phonenumber"
										value={this.getFormValue('phonenumber')}
										onChange={this.setFormValue('form')}
									/>

									<div className="mt-30 submit-edit-profile">
										<p>
											<Button
												size="large"
												margin="normal"
												color="primary"
												className="file-upload-button"
												style={{
													marginRight: '5px',
												}}
												onClick={this.__handleOpenDialogPassword}
											>
												Save
											</Button>
										</p>
									</div>

									<div className="pb-form-description mt-30 mb-10">
										<span>Change Password</span>
									</div>

									<TextField
										error={password_form.error_change_password}
										fullWidth
										label="Password"
										type="password"
										autoComplete=""
										margin="normal"
										name="pb_edit_password"
										value={password_form.pb_edit_password}
										onChange={this.setFormValue('password_form')}
									/>

									<TextField
										error={password_form.error_change_password}
										fullWidth
										label="Confirm Password"
										type="password"
										autoComplete=""
										margin="normal"
										name="pb_edit_confirm_password"
										value={password_form.pb_edit_confirm_password}
										onChange={this.setFormValue('password_form')}
									/>
									{password_form.error_change_password === true ? (
										<Paper elevation={1} className="error-card-edit">
											<Typography variant="h1">Error:</Typography>
											<Typography variant="body1">Password fields are not equal</Typography>
										</Paper>
									) : null}
									<div className="mt-30 submit-edit-profile">
										<p>
											<Button
												size="large"
												margin="normal"
												color="primary"
												className="file-upload-button"
												style={{
													marginRight: '5px',
												}}
												onClick={this.__submitChangePassword}
											>
												Save
											</Button>
										</p>
									</div>
								</div>
							</div>
							<DialogEvent
								openEventDialog={successChangePassDialog}
								closeEventDialog={this.__handleCloseEventDialogChangePass}
								contentDialog={'Success Changed Password'}
								eventTypeDialog={successChangePassDialog === true ? 'Success' : 'Error'}
							/>
							<DialogEvent
								openEventDialog={successEditUserDialog}
								closeEventDialog={this.__handleCloseEventDialogEditUserData}
								contentDialog={'Success Edit User'}
								eventTypeDialog={successEditUserDialog === true ? 'Success' : 'Error'}
							/>
							<Dialog
								open={this.state.passwordDialog}
								onClose={this.__handleCloseDialogPassword}
								aria-labelledby="form_edit_password"
							>
								<DialogTitle id="form_edit_password">Enter Password</DialogTitle>
								<DialogContent>
									<DialogContentText>
										To submit this new user data, please enter your password
									</DialogContentText>

									<TextField
										autoFocus
										type="password"
										margin="normal"
										label="Enter Password"
										onChange={(e) => this.setState({ password: e.target.value })}
										value={this.state.password}
										fullWidth
									/>
								</DialogContent>
								<DialogActions>
									<Button
										onClick={this.__handleCloseDialogPassword}
										style={{
											backgroundColor: '#757575',
											color: 'white',
										}}
									>
										Cancel
									</Button>
									<Button color="primary" variant="contained" onClick={this.__submitEditData}>
										Submit
									</Button>
								</DialogActions>
							</Dialog>
						</FormComponent>
					</div>
				</div>
			</Page>
		)
	}
}

export default UserProfile
