import React, { Component } from 'react'
import { Button, TextField, FormControlLabel, Checkbox, Grid } from '@material-ui/core'

export default class SignUpFormComponent extends Component {
	state = {
		current_value_role: '',
	}

	__toHandleRoleChange = event => {
		this.setState({ current_value_role: event.target.value })

		this.props.onSignUpFormRoleChange(event.target.value)
	}

	render() {
		const {
			onSignUpFormChange,
			isTermsChecked,
			onSignUpClicked,
			onClickBackLogin,
			changedTermsChecked,
			toClickTerms,
			onUploadImage,
		} = this.props

		return (
			<div className="signup-option">
				<form onSubmit={onSignUpClicked}>
					<span className="font-xl pb-30">REGISTER</span>
					<div className="pb-form-body">
						{/* <FormControl fullWidth>
							<InputLabel htmlFor="pb_role">Select Role</InputLabel>
							<Select
								label="Select Role"
								placeholder="Choose Role"
								inputProps={{
									name: 'pb_register_role',
									id: 'pb_role',
								}}
								value={
									this.state.current_value_role === ''
										? currentValueState.pb_register_role
										: this.state.current_value_role
								}
								onChange={this.__toHandleRoleChange}
							>
								<MenuItem value="building_manager">Building Manager</MenuItem>
								<MenuItem value="property_manager">Property Manager</MenuItem>
								<MenuItem value="owner">Owner</MenuItem>
							</Select>
						</FormControl> */}

						<Grid container spacing={16}>
							<Grid item xs={6}>
								<TextField
									fullWidth
									required
									label="First Name"
									type="text"
									autoComplete=""
									margin="normal"
									name="pb_register_first_name"
									onChange={onSignUpFormChange}
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
									name="pb_register_last_name"
									onChange={onSignUpFormChange}
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
							name="pb_register_address"
							onChange={onSignUpFormChange}
						/>

						<TextField
							fullWidth
							required
							label="Company Name"
							type="text"
							autoComplete=""
							margin="normal"
							name="pb_register_company_name"
							onChange={onSignUpFormChange}
						/>

						<TextField
							fullWidth
							required
							label="Mobile Number"
							type="text"
							autoComplete=""
							margin="normal"
							name="pb_register_mobile_phone"
							onChange={onSignUpFormChange}
						/>

						<TextField
							fullWidth
							required
							label="Email"
							type="text"
							autoComplete=""
							margin="normal"
							name="pb_register_email_address"
							onChange={onSignUpFormChange}
						/>

						<TextField
							fullWidth
							required
							label="Password"
							type="password"
							autoComplete=""
							margin="normal"
							name="pb_register_password"
							onChange={onSignUpFormChange}
						/>

						<TextField
							fullWidth
							required
							label="Confirm Password"
							type="password"
							autoComplete=""
							margin="normal"
							name="pb_register_confirm_password"
							onChange={onSignUpFormChange}
						/>

						<div style={{ display: 'flex', flexDirection: 'column', margin: '10px 0' }}>
							<label htmlFor="photo">Photo</label>

							<input
								ref={'file-upload-register-image'}
								type="file"
								id="photo"
								className="file-upload"
								onChange={onUploadImage}
							/>
						</div>

						<FormControlLabel
							control={
								<Checkbox
									checked={isTermsChecked}
									onChange={changedTermsChecked}
									value="is_accept_terms"
									color="primary"
									name="is_accept_terms"
									required
								/>
							}
							label={
								<span>
									I accept the{' '}
									<button
										style={{ color: 'blue', background: 'none', border: 0 }}
										onClick={toClickTerms}
										type="button"
									>
										Terms and Condtions
									</button>
								</span>
							}
						/>
					</div>

					<div className="button-actions d-flex flex-row justify-content-between align-items-center">
						<span className="link-action" onClick={onClickBackLogin}>
							Already have an account?
						</span>
						<Button className="button-action-register" type="submit">
							REGISTER
						</Button>
					</div>
				</form>
				{/* <RoleSelectComponent
					onOpenDialog={openDialogRoleSelection}
					onSelectedRole={onSelectedRole}
					onCloseDialog={closeDialogRoleSelection}
					selectedRole={onSelectedRole}
					onTransistionDialog={onTransistionDialog}
					onValueBuildingInfo={onValueBuildingInfo}
					onChangeValueBuildingInfo={onChangeValueBuildingInfo}
				/> */}
			</div>
		)
	}
}
