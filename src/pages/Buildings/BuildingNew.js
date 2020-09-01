import React from 'react'
import ContentHeader from 'components/ContentHeader/ContentHeader.component'
import FormComponent from 'components/FormComponent/Form.component'
import './BuildingList.style.scss'

import {
	Paper,
	InputLabel,
	Select,
	FormControl,
	TextField,
	MenuItem,
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	Snackbar,
} from '@material-ui/core'
import { Add, Close, Edit } from '@material-ui/icons'
import LoadingComponent from 'components/LoadingComponent/Loading.component'
import Page from 'components/Page'
import { compose, graphql } from 'react-apollo'
import { addBuilding, addFloor, editBuilding } from 'queries/building_mutations'
import axios from 'axios'
import withTitle from 'util/withTitle'
import ImageUploader from 'components/ImageUploader'

@compose(
	graphql(addBuilding, { name: 'add_building_form' }),
	graphql(addFloor, { name: 'add_floor_form' }),
	graphql(editBuilding, { name: 'edit_building_form' })
)
@withTitle
class BuildingNewForm extends React.Component {
	state = {
		form: {
			building_name: '',
			building_street_address: '',
			building_suburb: '',
			building_city: '',
			building_postcode: '',
			builidng_country: 'NZ',
			building_managed_status: '',
		},
		floorSections: [
			{
				floor: 'G',
			},
		],
		floorAddFormInput: '',
		floorEditFormInput: '',
		floorIndexFormInput: null,
		newMsgFloorAdd: {
			show: false,
		},
		newMsgFloorEdit: {
			show: false,
		},
		currentOutputImageAddBuilding: '',
		builidng_photo_upload: '',
		loadingForSubmitForm: false,
		dialogSuccessSubmit: false,
	}

	__handleChangeForm = evt => {
		let { form } = this.state
		form[evt.target.name] = evt.target.value
		this.setState({ form })
	}

	__setFormAddonChange = event => {
		this.setState({
			floorAddFormInput: event.target.value,
		})
	}

	__setFormEditonChange = event => {
		this.setState({
			floorEditFormInput: event.target.value,
		})
	}

	_handleCloseModalAddFloor = () => {
		this.setState({
			newMsgFloorAdd: { show: false },
			newMsgFloorEdit: { show: false },
			floorAddFormInput: '',
			floorEditFormInput: '',
		})
	}

	_handleOpenModalAddFloor = () => {
		this.setState({ newMsgFloorAdd: { show: true } })
	}

	_handleOpenModalEditFloor = (floor, index) => {
		this.setState({
			newMsgFloorEdit: { show: true },
			floorEditFormInput: floor,
			floorIndexFormInput: index,
		})
	}

	__handleEditFloorSubmit = () => {
		let { floorSections, floorEditFormInput, floorIndexFormInput } = this.state
		floorSections[floorIndexFormInput].floor = floorEditFormInput
		this.setState({ floorSections })
		this._handleCloseModalAddFloor()
	}

	_addSectionList = () => {
		this.setState({
			floorSections: [
				...this.state.floorSections,
				{
					floor: this.state.floorAddFormInput,
				},
			],
		})
		this._handleCloseModalAddFloor()
	}

	_removeSectionList = section => {
		this.setState({
			floorSections: this.state.floorSections.filter(x => x !== section),
		})
	}

	__handleChangeImageAddBuilding = file => {
		this.setState({
			builidng_photo_upload: file,
		})
	}

	__submitFormAddBuilding = async evt => {
		evt.preventDefault()

		let { form, builidng_photo_upload, floorSections } = this.state

		this.setState({
			loadingForSubmitForm: true,
		})

		try {
			let result = await this.props.add_building_form({
				variables: {
					token: localStorage.getItem('pb_user_token'),
					name: form.building_name,
					street_address: form.building_street_address,
					suburb: form.building_suburb,
					city: form.building_city,
					postcode: form.building_postcode,
					country: form.builidng_country,
					managed_status_id: form.building_managed_status,
				},
			})

			if (builidng_photo_upload) {
				const image_add_building_data = new FormData()
				image_add_building_data.append('file', builidng_photo_upload, builidng_photo_upload.name)
				image_add_building_data.append('token', localStorage.getItem('pb_user_token'))
				image_add_building_data.append('building_id', result.data.BuildingAdd.id)

				try {
					let res = await axios.post('/photo/building', image_add_building_data, {})

					await this.props.edit_building_form({
						variables: {
							token: localStorage.getItem('pb_user_token'),
							id: result.data.BuildingAdd.id,
							photo_id: res.data.id,
						},
					})
				} catch (err) {
					console.log('err', err)
				}
			}

			await Promise.all(
				floorSections.map((item, index) =>
					this.props.add_floor_form({
						variables: {
							token: localStorage.getItem('pb_user_token'),
							building_id: result.data.BuildingAdd.id,
							name: item.floor,
							number: index,
						},
					})
				)
			)

			this.props.history.push(`/building/${result.data.BuildingAdd.id}`)
		} catch (err) {
			console.log('err', err)
		}
	}

	__successCloseDialogSubmitAddForm = () => {
		this.setState({
			dialogSuccessSubmit: false,
		})
		this.props.history.push('/dashboard')
	}

	_renderStepOne = () => {
		let { form, floorSections, newMsgFloorAdd, newMsgFloorEdit, loadingForSubmitForm } = this.state

		return (
			<div className="step-two">
				{loadingForSubmitForm === true ? <LoadingComponent /> : null}
				<div className="row">
					<div className="col-5 mb-30">
						<div className="step-form">
							<FormControl className="form-item" fullWidth>
								<TextField
									label="Building Name"
									margin="normal"
									onChange={this.__handleChangeForm}
									value={form.building_name}
									name="building_name"
									required
								/>
							</FormControl>
							<FormControl className="form-item" fullWidth>
								<TextField
									label="Street address"
									margin="normal"
									onChange={this.__handleChangeForm}
									value={form.building_street_address}
									name="building_street_address"
									required
								/>
							</FormControl>
							<FormControl className="form-item" fullWidth>
								<TextField
									label="Suburb"
									margin="normal"
									onChange={this.__handleChangeForm}
									value={form.building_suburb}
									name="building_suburb"
								/>
							</FormControl>
							<FormControl className="form-item" fullWidth>
								<TextField
									label="City"
									margin="normal"
									onChange={this.__handleChangeForm}
									value={form.building_city}
									name="building_city"
									required
								/>
							</FormControl>
							<FormControl className="form-item" fullWidth>
								<TextField
									label="Postcode"
									margin="normal"
									onChange={this.__handleChangeForm}
									value={form.building_postcode}
									name="building_postcode"
									type="number"
									required
								/>
							</FormControl>

							{/* <FormControl className="form-item" fullWidth margin="normal">
									<InputLabel htmlFor="country_list">Country</InputLabel>
									<Select
										value={this.state.form.builidng_country}
										inputProps={{
											name: "builidng_country",
											id: "country_list"
										}}
										onChange={this._handleFormChange}
									>
										{countryListData.map((r, i) => (
											<MenuItem key={i} value={r.code}>
												{r.code}
											</MenuItem>
										))}
									</Select>
								</FormControl> */}
							<FormControl className="form-item" fullWidth margin="normal">
								<InputLabel htmlFor="building_managed_status">Managed Status *</InputLabel>
								<Select
									value={this.state.form.building_managed_status}
									inputProps={{
										name: 'building_managed_status',
										id: 'building_managed_status',
									}}
									onChange={this.__handleChangeForm}
									required
								>
									<MenuItem value={1}>Managed by property manager</MenuItem>
									<MenuItem value={2}>Managed by owner</MenuItem>
									<MenuItem value={3}>Currently owner occupied</MenuItem>
								</Select>
							</FormControl>
						</div>
						<div className="step-form row mt-30 mb-25">
							<div className="col-lg-12 col-md-12 h-100">
								<div className="pb-label">
									<span>Building Photo</span>
								</div>
								<ImageUploader
									onChange={file => this.setState({ building_photo_upload: file })}
									value={this.state.building_photo_upload}
								/>
							</div>
						</div>
					</div>
					<div className="col-7">
						<div className="row">
							{floorSections.map((section, i) => (
								<div className="col-3 mb-10" key={i}>
									<Paper className="card-floor">
										<div className="icon-logo-delete">
											{floorSections.length > 1 && (
												<Close
													onClick={() => {
														this._removeSectionList(section)
													}}
												/>
											)}
										</div>
										<div className="card-floor-component">
											<h1 id={`{$i}_floor_key`}>{section.floor}</h1>
										</div>
										<div className="icon-logo-edit">
											<Edit
												onClick={() => {
													this._handleOpenModalEditFloor(section.floor, i)
												}}
											/>
										</div>
									</Paper>
								</div>
							))}
							<div className="col-3 mb-10">
								<Paper className="card-floor">
									<div className="card-floor-component-add" onClick={this._handleOpenModalAddFloor}>
										<Add />
										<p>Add Floor</p>
									</div>
								</Paper>
							</div>
						</div>
					</div>
				</div>
				<Dialog
					open={newMsgFloorAdd.show}
					onClose={this._handleCloseModalAddFloor}
					aria-labelledby="form-dialog-title"
					fullWidth
				>
					<DialogTitle id="form-dialog-title">Add new Floor</DialogTitle>
					<DialogContent>
						<TextField
							id="outlined-bare"
							margin="normal"
							fullWidth
							name="form_add_floors"
							onChange={this.__setFormAddonChange}
							defaultValue={this.state.floorAddFormInput}
							label="Enter Floor . . ."
						/>
					</DialogContent>
					<DialogActions>
						<Button onClick={this._handleCloseModalAddFloor} color="secondary" variant="contained">
							Cancel
						</Button>
						<Button onClick={this._addSectionList} color="primary" variant="contained">
							<Add /> Add
						</Button>
					</DialogActions>
				</Dialog>

				<Dialog
					open={newMsgFloorEdit.show}
					onClose={this._handleCloseModalAddFloor}
					aria-labelledby="form-dialog-title"
					fullWidth
				>
					<DialogTitle id="form-dialog-title">Edit Floor</DialogTitle>
					<DialogContent>
						<TextField
							id="outlined-bare"
							margin="normal"
							fullWidth
							name="form_add_floors"
							onChange={this.__setFormEditonChange}
							defaultValue={this.state.floorEditFormInput}
						/>
					</DialogContent>
					<DialogActions>
						<Button onClick={this._handleCloseModalAddFloor} color="secondary" variant="contained">
							Cancel
						</Button>
						<Button color="primary" variant="contained" onClick={this.__handleEditFloorSubmit}>
							Save
						</Button>
					</DialogActions>
				</Dialog>
				<Snackbar
					anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
					open={this.state.dialogSuccessSubmit}
					onClose={this.__successCloseDialogSubmitAddForm}
					ContentProps={{
						'aria-describedby': 'message-id',
					}}
					message={<span id="message-id">Success Create Building</span>}
				/>
			</div>
		)
	}

	render() {
		return (
			<Page>
				<div className="page-content building-new-content">
					<ContentHeader
						visibleBack={true}
						title="Add Building"
						breadcrumb={[
							{
								name: 'Dashboard',
								link: '/dashboard',
							},
							{
								name: 'Add Building',
							},
						]}
					/>
					<div className="body d-flex">
						<FormComponent>
							<form method="post" onSubmit={this.__submitFormAddBuilding}>
								<div className="pb-form-description mb-5 mt-5">
									<span>All fields marked with an asterisk (*) are compulsory.</span>
								</div>
								<div className="stepper-content">{this._renderStepOne()}</div>
								<div className="stepper-footer">
									<Button
										variant="contained"
										size="large"
										style={{
											marginRight: '10px',
											backgroundColor: '#757575',
											color: 'white',
										}}
										onClick={() => this.props.history.push('/dashboard')}
									>
										Cancel
									</Button>

									<Button variant="contained" color="primary" size="large" type="submit">
										Save
									</Button>
								</div>
							</form>
						</FormComponent>
					</div>
				</div>
			</Page>
		)
	}
}
export default BuildingNewForm
