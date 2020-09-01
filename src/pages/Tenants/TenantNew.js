import React from 'react'
import './TenantList.style.scss'
import ContentHeader from 'components/ContentHeader/ContentHeader.component'
import FormComponent from 'components/FormComponent/Form.component'
import LoadingComponent from 'components/LoadingComponent/Loading.component'
import { graphql, compose } from 'react-apollo'
import { addTenants } from 'queries/tenant_mutations'
import { changeImageuser } from 'queries/user_queries'
import { Paper, TextField, Button, Typography, Snackbar } from '@material-ui/core'
import axios from 'axios'
import Page from 'components/Page'
import { propertiesQueryDetails } from 'queries/tenancies_queries'
import query from 'util/query'
import withTitle from 'util/withTitle'
import { Link } from 'react-router-dom'
import ImageUploader from 'components/ImageUploader'

@query((props) => ({
	query: propertiesQueryDetails,
	variables: {
		token: localStorage.getItem('pb_user_token'),
		id: props.match.params.tenancy_id,
	},
	fetchPolicy: 'cache-and-network',
}))
@compose(
	graphql(addTenants, { name: 'add_tenant_form' }),
	graphql(changeImageuser, { name: 'change_photo_user' })
)
@withTitle
class TenantNew extends React.Component {
	state = {
		form: {
			firstname: '',
			lastname: '',
			email: '',
			phonenumber: '',
			address: '',
			move_in_date: '',
			move_out_date: '',
		},
		image: '',
		currentImage: null,
		loadingSubmitTenant: false,
		submitNewTenant: false,
	}

	__onChangeForm = (evt) => {
		let { form } = this.state
		form[evt.target.name] = evt.target.value
		this.setState({ form })
	}

	_handleRegisterTenant = async (evt) => {
		evt.preventDefault()

		let { form, image } = this.state

		let building = this.getBuilding()
		let tenancy = this.getTenancy()

		this.setState({
			loadingSubmitTenant: true,
		})

		try {
			let result = await this.props.add_tenant_form({
				variables: {
					token: localStorage.getItem('pb_user_token'),
					email: form.email,
					firstname: form.firstname,
					lastname: form.lastname,
					phonenumber: form.phonenumber,
					tenancy_id: tenancy.id,
					move_in_date: form.move_in_date,
					move_out_date: form.move_out_date,
					active: true,
				},
			})

			if (result.data.TenantUserAdd && image) {
				const image_new_tenant = new FormData()
				image_new_tenant.append('token', localStorage.getItem('pb_user_token'))
				image_new_tenant.append('file', image, image.name)
				image_new_tenant.append('user_id', result.data.TenantUserAdd.id)

				let image_upload = await axios.post('/photo/avatar', image_new_tenant)

				if (image_upload.data) {
					await this.props.change_photo_user({
						variables: {
							token: localStorage.getItem('pb_user_token'),
							id: result.data.TenantUserAdd.id,
							photo_id: image_upload.data.id,
						},
					})
				}

				this.props.history.push(`/building/${building.id}/tenancy/${tenancy.id}`)
			}
		} catch (e) {
			console.log('error', e)
			alert('Something went wrong')
			this.setState({
				loadingSubmitTenant: false,
			})
		}
	}

	__successCloseDialogSubmitAddForm = () => {
		this.setState({
			submitNewTenant: false,
		})
	}

	getTenancy = () => {
		if (this.props.query.data.tenancies) {
			return this.props.query.data.tenancies[0]
		}

		return null
	}

	getBuilding = () => {
		if (this.props.query.data.tenancies) {
			return this.props.query.data.tenancies[0].building
		}

		return null
	}

	render() {
		let { form, loadingSubmitTenant } = this.state

		let building = this.getBuilding()
		let tenancy = this.getTenancy()

		if (!building) return <Page />

		return (
			<Page>
				<div className="page-content tenant-form-content">
					{loadingSubmitTenant === true ? <LoadingComponent /> : null}
					<ContentHeader
						visibleBack={true}
						title="New Tenant"
						addbutton={{
							visible: false,
							onClick: this._clickAdd,
						}}
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
								name: tenancy.name,
								link: `/building/${building.id}/tenancy/${tenancy.id}`,
							},
							{
								name: 'New Tenant',
							},
						]}
					/>
					<div className="body">
						<FormComponent>
							<div className="pb-form-description">
								<span>All fields marked with an asterisk (*) are compulsory.</span>
							</div>
							<form onSubmit={this._handleRegisterTenant}>
								<div className="pb-form-body row">
									<div className="pb-section col-lg-12 col-md-12 col-sm-12">
										<div className="pb-section-title">
											<span>Information</span>
										</div>
										<div className="pb-section-body">
											<div className="main-contact-name">
												<TextField
													required
													margin="normal"
													id="name"
													name="firstname"
													value={form.firstname}
													onChange={this.__onChangeForm}
													label="First Name"
													fullWidth
												/>
											</div>
											<div className="main-contact-name">
												<TextField
													required
													margin="normal"
													id="name"
													name="lastname"
													value={form.lastname}
													onChange={this.__onChangeForm}
													label="Last Name"
													fullWidth
												/>
											</div>
											<div className="pb-label">
												<span>Identification Photo</span>
											</div>
											<ImageUploader
												onChange={(file) => {
													this.setState({ image: file })
												}}
												value={this.state.image}
											/>
										</div>

										<div className="pb-section-title mt-15">
											<span>Contact Information</span>
										</div>
										<div className="pb-section-body">
											<div className="main-contact-name">
												<TextField
													required
													margin="normal"
													id="name"
													name="email"
													value={form.email}
													onChange={this.__onChangeForm}
													label="Email Address"
													type="email"
													fullWidth
												/>
											</div>
											<div className="main-contact-name">
												<TextField
													required
													margin="normal"
													id="name"
													name="phonenumber"
													value={form.phonenumber}
													onChange={this.__onChangeForm}
													label="Mobile Number"
													fullWidth
												/>
											</div>
										</div>
									</div>
									<div className="pb-section col-lg-12 col-md-12 col-sm-12">
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
													{tenancy.name}
												</Typography>
												<Typography
													variant="body1"
													component="p"
													className="tenant-create-note-body"
												>
													{/**"To assign to a tenancy go to the tenancy and Add Tenant, at which point you can select and existing tenant or add a new tenants details at the same time" */}
													{building.name}
												</Typography>
											</Paper>

											<TextField
												label="Move in Date*"
												type="date"
												InputLabelProps={{
													shrink: true,
												}}
												fullWidth
												value={form.move_in_date}
												name="move_in_date"
												onChange={this.__onChangeForm}
												margin="normal"
											/>
											<TextField
												label="Move out Date"
												type="date"
												InputLabelProps={{
													shrink: true,
												}}
												value={form.move_out_date}
												onChange={this.__onChangeForm}
												fullWidth
												name="move_out_date"
												margin="normal"
											/>
										</div>
									</div>
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
											to={`/building/${building.id}/tenancy/${tenancy.id}`}
										>
											Cancel
										</Button>
										<Button variant="contained" color="primary" size="large" type="submit">
											Save
										</Button>
									</div>
								</div>
							</form>
						</FormComponent>
					</div>
					<Snackbar
						anchorOrigin={{
							vertical: 'bottom',
							horizontal: 'right',
						}}
						open={this.state.submitNewTenant}
						onClose={this.__successCloseDialogSubmitAddForm}
						ContentProps={{
							'aria-describedby': 'message-id',
						}}
						message={<span id="message-id">Success Create Tenant</span>}
					/>
				</div>
			</Page>
		)
	}
}
export default TenantNew
