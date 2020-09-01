import React from 'react'
import ContentHeader from 'components/ContentHeader/ContentHeader.component'
import './PropertyList.style.scss'
import FormComponent from 'components/FormComponent/Form.component'
import { InputLabel, Select, FormControl, TextField, MenuItem, Button, Snackbar } from '@material-ui/core'
import LoadingComponent from 'components/LoadingComponent/Loading.component'
import { graphql, compose } from 'react-apollo'
import { tenancyEditQuery } from 'queries/tenancies_queries'
import { changeTenancy } from 'queries/tenancies_mutations'
import axios from 'axios'
import Page from 'components/Page'
import query from 'util/query'
import withTitle from 'util/withTitle'
import { Link } from 'react-router-dom'
import ImageUploader from 'components/ImageUploader'

@query(({ match }) => ({
	query: tenancyEditQuery,
	variables: {
		token: localStorage.getItem('pb_user_token'),
		id: match.params.tenancy_id,
	},
	fetchPolicy: 'cache-and-network',
}))
@compose(graphql(changeTenancy, { name: 'edit_tenancy_form' }))
@withTitle
class TenancyEdit extends React.Component {
	state = {
		form: {},
		tenancyImage: '',
		tenancyTempoImage: '',
		finishedQuery: false,
		loadingForSubmitForm: false,
		dialogSuccessSubmit: false,
	}

	componentDidUpdate(prevProps) {
		if (prevProps.query.data !== this.props.query.data) {
			if (this.props.query.data.tenancies) {
				this.setState({
					form: {
						...this.state.form,
						floor: this.props.query.data.tenancies[0].floor.id,
						managed_status: this.props.query.data.tenancies[0].managed_status.id,
					},
				})
			}
		}
	}

	_handleFormChange = event => {
		this.setState({
			form: {
				...this.state.form,
				[event.target.name]: event.target.value,
			},
		})
	}

	__handleChangeTenancyImage = evt => {
		this.setState({
			tenancyImage: evt.target.files[0],
			tenancyTempoImage: URL.createObjectURL(evt.target.files[0]),
		})
	}

	__handleSubmit = async evt => {
		evt.preventDefault()

		let { tenancyImage } = this.state

		let building = this.getBuilding()
		let tenancy = this.getTenancy()

		let form = { ...tenancy, ...this.state.form }

		this.setState({
			loadingForSubmitForm: true,
		})

		try {
			let variables = {
				token: localStorage.getItem('pb_user_token'),
				id: tenancy.id,
				floor_id: form.floor,
				name: form.name,
				number: form.number,
				max_tenants: form.max_tenants,
				intercom: form.intercom,
				managed_status_id: form.managed_status,
			}

			if (tenancyImage) {
				const image_add_tenancy_data = new FormData()
				image_add_tenancy_data.append('file', tenancyImage, tenancyImage.name)
				image_add_tenancy_data.append('token', localStorage.getItem('pb_user_token'))
				image_add_tenancy_data.append('tenancy_id', tenancy.id)

				let res = await axios.post('/photo/tenancy', image_add_tenancy_data)
				variables.photo_id = res.data.id
			}

			await this.props.edit_tenancy_form({ variables })

			this.props.history.push(`/building/${building.id}/tenancy/${tenancy.id}`)
		} catch (err) {
			console.log('err', err)
			this.setState({
				loadingForSubmitForm: false,
			})
			alert('Something went wrong')
		}
	}

	__successCloseDialogSubmitAddForm = () => {
		this.setState({
			dialogSuccessSubmit: false,
		})
	}

	getFormValue = (key, defaultValue = '') => {
		return this.state.form[key] !== undefined
			? this.state.form[key]
			: this.props.query.data.tenancies && this.props.query.data.tenancies[0][key] !== null
			? this.props.query.data.tenancies[0][key]
			: defaultValue
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
		let { loadingForSubmitForm } = this.state

		let building = this.getBuilding()
		let tenancy = this.getTenancy()

		if (!tenancy) return <Page />

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
						title="Edit Tenancy"
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
								name: 'Edit',
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
														value={this.getFormValue('floor')}
														inputProps={{
															name: 'floor',
															id: 'floors_selection',
														}}
														onChange={this._handleFormChange}
													>
														{building.floors
															.sort((a, b) => +a.number - +b.number)
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
													name="name"
													value={this.getFormValue('name')}
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
													name="number"
													value={this.getFormValue('number')}
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
													name="max_tenants"
													value={this.getFormValue('max_tenants')}
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
													name="intercom"
													value={this.getFormValue('intercom')}
													onChange={this._handleFormChange}
													label="Intercom Number"
													type="number"
													fullWidth
												/>
											</div>
											<FormControl className="d-flex" margin="normal">
												<InputLabel htmlFor="managed-status">Managed Status *</InputLabel>
												<Select
													value={this.getFormValue('managed_status')}
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
export default TenancyEdit
