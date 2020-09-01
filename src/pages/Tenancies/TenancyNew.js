import React from 'react'
import ContentHeader from 'components/ContentHeader/ContentHeader.component'
import './PropertyList.style.scss'
import FormComponent from 'components/FormComponent/Form.component'
import { InputLabel, Select, FormControl, TextField, MenuItem, Button, Snackbar } from '@material-ui/core'
import LoadingComponent from 'components/LoadingComponent/Loading.component'
import { graphql, compose } from 'react-apollo'
import { buildingViewQuery } from 'queries/building_queries'
import { addTenancy, changeTenancy } from 'queries/tenancies_mutations'
import axios from 'axios'
import Page from 'components/Page'
import query from 'util/query'
import withTitle from 'util/withTitle'
import { Link } from 'react-router-dom'
import ImageUploader from 'components/ImageUploader'

@query(props => ({
	query: buildingViewQuery,
	variables: {
		token: localStorage.getItem('pb_user_token'),
		id: props.match.params.building_id,
	},
	fetchPolicy: 'cache-and-network',
}))
@compose(
	graphql(addTenancy, { name: 'add_tenancy_form' }),
	graphql(changeTenancy, { name: 'edit_tenancy_form' })
)
@withTitle
class TenancyNew extends React.Component {
	state = {
		form: {
			propertyNumber: '',
			floorsCurrentSelected: '',
			intercomNumber: '',
			managed_status: '',
			maximumNumberOfTenants: '',
			tenancyName: '',
		},
		tenancyImage: '',
		finishedQuery: false,
		loadingForSubmitForm: false,
		dialogSuccessSubmit: false,
	}

	componentDidUpdate(prevProps) {
		if (prevProps.query.data !== this.props.query.data) {
			if (this.props.query.data.buildings) {
				if (this.props.query.data.buildings[0].floors.length === 1) {
					this.setState({
						form: {
							...this.state.form,
							floorsCurrentSelected: this.props.query.data.buildings[0].floors[0].id,
						},
					})
				}
			}
		}
	}

	_backToList = () => {
		this.props.router.navigate('buildings.view', { buildings: this.props.route.params.buildings }, { reload: true })
	}

	_handleFormChange = event => {
		this.setState({
			form: {
				...this.state.form,
				[event.target.name]: event.target.value,
			},
		})
	}

	__handleSubmit = async evt => {
		evt.preventDefault()

		let { form, tenancyImage } = this.state

		this.setState({
			loadingForSubmitForm: true,
		})

		try {
			let result = await this.props.add_tenancy_form({
				variables: {
					token: localStorage.getItem('pb_user_token'),
					floor_id: form.floorsCurrentSelected,
					name: form.tenancyName,
					number: form.propertyNumber,
					max_tenants: form.maximumNumberOfTenants,
					intercom: form.intercomNumber,
					managed_status_id: form.managed_status,
				},
			})

			if (tenancyImage) {
				const image_add_tenancy_data = new FormData()
				image_add_tenancy_data.append('file', tenancyImage, tenancyImage.name)
				image_add_tenancy_data.append('token', localStorage.getItem('pb_user_token'))
				image_add_tenancy_data.append('tenancy_id', result.data.TenancyAdd.id)

				try {
					let res = await axios.post('/photo/tenancy', image_add_tenancy_data, {})
					await this.props.edit_tenancy_form({
						variables: {
							token: localStorage.getItem('pb_user_token'),
							id: result.data.TenancyAdd.id,
							floor_id: form.floorsCurrentSelected,
							photo_id: res.data.id,
							name: form.tenancyName,
							number: form.propertyNumber,
							max_tenants: form.maximumNumberOfTenants,
							intercom: form.intercomNumber,
						},
					})
				} catch (err) {
					console.log('err', err)
				}
			}

			let building = this.getBuilding()

			this.props.history.push(`/building/${building.id}/tenancy/${result.data.TenancyAdd.id}`)
		} catch (err) {
			console.log('err', err)
		}
	}

	__successCloseDialogSubmitAddForm = () => {
		this.setState({
			dialogSuccessSubmit: false,
		})
	}

	getBuilding = () => {
		if (this.props.query.data.buildings) {
			return this.props.query.data.buildings[0]
		}

		return null
	}

	render() {
		let { form, loadingForSubmitForm } = this.state

		let building = this.getBuilding()

		if (!building) return <Page />

		return (
			<Page>
				<div className="page-content building-new-content">
					{loadingForSubmitForm === true ? <LoadingComponent /> : null}
					<ContentHeader
						addbutton={{
							visible: false,
							onClick: this._clickAdd,
						}}
						visibleBack={true}
						title="New Tenancy"
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
								name: 'New Tenancy',
							},
						]}
					/>
					<div className="body">
						<FormComponent>
							<form method="post" onSubmit={this.__handleSubmit}>
								<div className="pb-form-description">
									<span>All fields marked with an asterisk (*) are compulsory.</span>
								</div>
								<div className="pb-form-body row">
									<div className="pb-section col-md-12 col-sm-12">
										<div className="pb-section-title">
											<span>Tenancy Info</span>
										</div>
										<div className="pb-section-body">
											<div className="main-contact-name">
												<FormControl fullWidth margin="normal">
													<InputLabel htmlFor="floors_selection">Select a floor *</InputLabel>
													<Select
														value={this.state.form.floorsCurrentSelected}
														inputProps={{
															name: 'floorsCurrentSelected',
															id: 'floors_selection',
														}}
														onChange={this._handleFormChange}
													>
														{building.floors
															.sort((a, b) => a.number - b.number)
															.map(floor => (
																<MenuItem value={floor.id} key={floor.id}>
																	{floor.name}
																</MenuItem>
															))}
													</Select>
												</FormControl>
											</div>
											<div className="main-contact-name">
												<TextField
													margin="normal"
													id="name"
													name="tenancyName"
													onChange={this._handleFormChange}
													label="Tenancy Name"
													fullWidth
													required
												/>
											</div>
											<div className="main-contact-name">
												<TextField
													margin="normal"
													id="name"
													name="propertyNumber"
													onChange={this._handleFormChange}
													label="Tenancy Number"
													type="number"
													fullWidth
													required
												/>
											</div>
											<div className="main-contact-name">
												<TextField
													margin="normal"
													id="maxNumber"
													type="number"
													name="maximumNumberOfTenants"
													onChange={this._handleFormChange}
													label="Max Number of Tenants"
													fullWidth
													required
												/>
											</div>

											<div className="main-contact-name">
												<TextField
													margin="normal"
													id="name"
													name="intercomNumber"
													onChange={this._handleFormChange}
													label="Intercom Number"
													type="number"
													fullWidth
												/>
											</div>
											<FormControl className="d-flex" margin="normal">
												<InputLabel htmlFor="managed-status">Managed Status *</InputLabel>
												<Select
													value={form.managed_status}
													onChange={this._handleFormChange}
													inputProps={{
														name: 'managed_status',
														id: 'managed_status',
													}}
													required
												>
													<MenuItem value={1}>Managed by property manager</MenuItem>
													<MenuItem value={2}>Managed by owner</MenuItem>
													<MenuItem value={3}>Currently owner occupied</MenuItem>
												</Select>
											</FormControl>
											<div className="pb-label">
												<span>Tenancy Photo</span>
											</div>

											<ImageUploader
												onChange={file => this.setState({ tenancyImage: file })}
												value={this.state.tenancyImage}
											/>
										</div>
									</div>
									<div className="pb-form-button tenant col-12 justify-content-end">
										<Button
											variant="contained"
											size="large"
											style={{
												marginRight: '10px',
												backgroundColor: '#757575',
												color: 'white',
											}}
											component={Link}
											to={`/building/${building.id}`}
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
						open={this.state.dialogSuccessSubmit}
						onClose={this.__successCloseDialogSubmitAddForm}
						ContentProps={{
							'aria-describedby': 'message-id',
						}}
						message={<span id="message-id">Success Create Tenancy</span>}
					/>
				</div>
			</Page>
		)
	}
}
export default TenancyNew
