import React from 'react'
import './TenantView.style.scss'
import ContentHeader from 'components/ContentHeader/ContentHeader.component'
import FormComponent from 'components/FormComponent/Form.component'
import LoaderComponent from 'components/LoadingComponent/Loading.component'
import './TenantView.style.scss'
import config from 'config'
import { TextField, Button, Snackbar } from '@material-ui/core'
import { graphql } from 'react-apollo'
import { editUserQuery } from 'queries/user_queries'
import { getTenantQuery } from 'queries/tenant_queries'
import axios from 'axios'
import Page from 'components/Page'
import query from 'util/query'
import withTitle from 'util/withTitle'
import { Link } from 'react-router-dom'
import ImageUploader from 'components/ImageUploader'

@query(props => ({
	query: getTenantQuery,
	variables: {
		token: localStorage.getItem('pb_user_token'),
		id: props.match.params.tenant_id,
	},
	fetchPolicy: 'cache-and-network',
}))
@graphql(editUserQuery, { name: 'edit_user_mutation' })
@withTitle
class EditTenant extends React.Component {
	state = {
		form: {},
		queryDoneLoading: false,
		currentTenantImageUpload: null,
		imageTenantToUpload: null,
		loaderSubmit: false,
		isFinishedSubmit: false,
	}

	uploadEditImageTenant = React.createRef()

	_handleFormChange = event => {
		this.setState({
			form: {
				...this.state.form,
				[event.target.name]: event.target.value,
			},
		})
	}

	__handleOpenFileTenantImage = () => {
		this.uploadEditImageTenant.current.click()
	}

	__handleUploadImage = evt => {
		this.setState({
			currentTenantImageUpload: URL.createObjectURL(evt.target.files[0]),
			imageTenantToUpload: evt.target.files[0],
		})
	}

	__handleSubmitEdit = async evt => {
		evt.preventDefault()

		this.setState({
			loaderSubmit: true,
		})

		let { imageTenantToUpload } = this.state
		let tenant = this.getTenant()

		let variables = {
			token: localStorage.getItem('pb_user_token'),
			id: tenant.user.id,
			...{ ...this.props.query.data.tenants[0].user, ...this.state.form },
		}

		try {
			if (imageTenantToUpload !== null) {
				const image_upload_owner_user = new FormData()
				image_upload_owner_user.append('token', localStorage.getItem('pb_user_token'))
				image_upload_owner_user.append('file', imageTenantToUpload, imageTenantToUpload.name)

				let upload_result = await axios.post('/photo/avatar', image_upload_owner_user, {})

				if (upload_result.data) {
					variables.photo_id = upload_result.data.id
				}
			}

			await this.props.edit_user_mutation({ variables })

			let building = this.getBuilding()
			this.props.history.push(`/building/${building.id}/tenants`)
		} catch (e) {
			console.log('err', e)
		}
	}

	__handleCloseSnackbar = () => {
		this.setState({
			isFinishedSubmit: false,
		})
	}

	getFormValue = (key, defaultValue = '') => {
		return this.state.form[key] !== undefined
			? this.state.form[key]
			: this.props.query.data.tenants
			? this.props.query.data.tenants[0].user[key]
			: defaultValue
	}

	getTenant = () => {
		if (this.props.query.data.tenants) {
			return this.props.query.data.tenants[0]
		}

		return null
	}

	getBuilding = () => {
		if (this.props.query.data.tenants) {
			return this.props.query.data.tenants[0].tenancy.building
		}

		return null
	}

	render() {
		let { loaderSubmit } = this.state

		let building = this.getBuilding()
		let tenant = this.getTenant()

		if (!building || !tenant) return <Page />

		return (
			<Page>
				<div className="page-content building-list-content">
					{loaderSubmit === true ? <LoaderComponent /> : null}
					<ContentHeader
						visibleBack={true}
						title={tenant.user.firstname + ' ' + tenant.user.lastname}
						breadcrumb={[
							{
								name: 'Dashboard',
								link: '/dashboard',
							},
							{
								name: building.name,
								link: `/building/${building.id}`,
							},
							{
								name: 'Tenants',
								link: `/building/${building.id}/tenants`,
							},
							{
								name: `Edit ${tenant.user.firstname + ' ' + tenant.user.lastname}`,
							},
						]}
					/>
					<div className="body">
						<FormComponent>
							<div className="pb-form-title">
								<span>Tenants within {building.name}</span>
							</div>
							<div className="pb-form-description">
								<span>All fields marked with an asterisk (*) are compulsory.</span>
							</div>
							<div className="pb-form-body row">
								<form onSubmit={this.__handleSubmitEdit} style={{ width: '100%' }}>
									<div className="pb-section col-lg-12 col-md-12 col-sm-12">
										<div className="pb-section-title">
											<span>Information</span>
										</div>
										<div className="pb-section-body">
											<div className="main-contact-name">
												<TextField
													required
													margin="dense"
													id="name"
													name="firstname"
													value={this.getFormValue('firstname')}
													onChange={this._handleFormChange}
													label="First Name"
													fullWidth
												/>
											</div>
											<div className="main-contact-name">
												<TextField
													required
													margin="dense"
													id="name"
													name="lastname"
													value={this.getFormValue('lastname')}
													onChange={this._handleFormChange}
													label="Last Name"
													fullWidth
												/>
											</div>
											<div className="pb-label">
												<span>Identification Photo</span>
											</div>
											<ImageUploader
												onChange={file => this.setState({ imageTenantToUpload: file })}
												value={
													this.state.imageTenantToUpload ||
													(tenant.user.photo ? config.URL + tenant.user.photo.path : null)
												}
											/>
										</div>

										<div className="pb-section-title mt-15">
											<span>Contact Information</span>
										</div>
										<div className="pb-section-body">
											<div className="main-contact-name">
												<TextField
													required
													margin="dense"
													id="name"
													name="email"
													value={this.getFormValue('email')}
													onChange={this._handleFormChange}
													label="Email Address"
													type="email"
													fullWidth
												/>
											</div>
											<div className="main-contact-name">
												<TextField
													required
													margin="dense"
													id="name"
													name="phonenumber"
													value={this.getFormValue('phonenumber')}
													onChange={this._handleFormChange}
													label="Mobile Number"
													fullWidth
												/>
											</div>
										</div>
									</div>
									{/* <div className="pb-section col-lg-12 col-md-12 col-sm-12">
											<div className="pb-section-title">
												<span>OCCUPANCY DETAILS</span>
											</div>
											<div className="pb-section-body">
												<Paper className="tenant-create-note">
													<Typography
														variant="h6"
														component="h1"
														className="tenant-create-note-header"
													>
														Note:
													</Typography>
													<Typography
														variant="body1"
														component="p"
														className="tenant-create-note-body"
													>
														"To assign to a tenancy go to the tenancy and Add Tenant, at
														which point you can select and existing tenant or add a new
														tenants details at the same time"
													</Typography>
												</Paper>
											</div>
										</div> */}
									<div
										className="pb-form-button tenant col-12 justify-content-end"
										style={{ marginTop: '25px' }}
									>
										<Button
											variant="contained"
											size="large"
											style={{
												marginRight: '10px',
												backgroundColor: '#757575',
												color: 'white',
											}}
											component={Link}
											to={`/building/${building.id}/tenants`}
										>
											Cancel
										</Button>
										<Button type="submit" variant="contained" color="primary" size="large">
											Save
										</Button>
									</div>
								</form>
							</div>
						</FormComponent>
					</div>
					<Snackbar
						anchorOrigin={{
							vertical: 'bottom',
							horizontal: 'right',
						}}
						open={this.state.isFinishedSubmit}
						onClose={this.__handleCloseSnackbar}
						ContentProps={{
							'aria-describedby': 'message-id',
						}}
						message={<span id="message-id">Success Edit Tenant</span>}
					/>
				</div>
			</Page>
		)
	}
}
export default EditTenant
