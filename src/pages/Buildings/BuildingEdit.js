import React from 'react'
import './BuildingView.style.scss'
import { Add, Close, Edit, AddPhotoAlternate } from '@material-ui/icons'
import FormComponent from 'components/FormComponent/Form.component'
import ContentHeader from 'components/ContentHeader/ContentHeader.component'
import {
	Paper,
	FormControl,
	TextField,
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	Snackbar,
} from '@material-ui/core'
import { compose, graphql } from 'react-apollo'
import { buildingViewQuery } from 'queries/building_queries'
import { editBuilding, editFloors, addFloor } from 'queries/building_mutations'
import config from 'config'
import axios from 'axios'
import LoadingComponent from 'components/LoadingComponent/Loading.component'
import Page from 'components/Page'
import query from 'util/query'
import withTitle from 'util/withTitle'

@query((props) => ({
	query: buildingViewQuery,
	variables: {
		token: localStorage.getItem('pb_user_token'),
		id: props.match.params.building_id,
	},
	fetchPolicy: 'cache-and-network',
}))
@compose(
	graphql(editBuilding, { name: 'edit_building_form' }),
	graphql(editFloors, { name: 'edit_floors_form' }),
	graphql(addFloor, { name: 'add_new_floor' })
)
@withTitle
class BuildingEditForm extends React.Component {
	state = {
		form: {},
		newFloorSections: [],
		floorSections: [],
		floorAddFormInput: '',
		floorEditFormInput: '',
		floorIndexFormInput: null,
		floorEditAddFormInput: '',
		floorIndexAddFormInput: null,
		newMsgFloorAdd: {
			show: false,
		},
		newMsgFloorEdit: {
			show: false,
		},
		newMsgFloorAddEdit: {
			show: false,
		},
		building_photo: '',
		building_photo_id: null,
		imageUploadBuildingEdit: '',
		currentOutputImageEditBuilding: '',
		queryDoneLoading: false,
		loadingForSubmitForm: false,
		loadingDoneSubmitForm: false,
	}

	componentDidUpdate(prevProps) {
		if (prevProps.query.data !== this.props.query.data) {
			let building = this.getBuilding()

			if (building) {
				this.setState({
					floorSections: building.floors,
				})
			}
		}
	}

	uploadEditImageBuilding = React.createRef()

	_renderModalViewSpan = () => {
		let windowWidth = document.getElementById('root').offsetWidth
		return windowWidth <= 768
	}

	_addSectionList = () => {
		let { newFloorSections } = this.state
		let newFloorData = {
			name: this.state.floorAddFormInput,
		}

		newFloorSections.push(newFloorData)
		this.setState({ newFloorSections })
		this._handleCloseModalAddFloor()
	}

	_removeSectionList = (section) => {
		///
	}

	__setFormAddonChange = (event) => {
		this.setState({
			floorAddFormInput: event.target.value,
		})
	}

	__setFormEditonChange = (event) => {
		this.setState({
			floorEditFormInput: event.target.value,
		})
	}

	__setFormEditAddonChange = (event) => {
		this.setState({
			floorEditAddFormInput: event.target.value,
		})
	}

	_handleCloseModalAddFloor = () => {
		this.setState({
			newMsgFloorAdd: { show: false },
			newMsgFloorEdit: { show: false },
			newMsgFloorAddEdit: { show: false },
			floorAddFormInput: '',
			floorEditFormInput: '',
			floorIndexFormInput: null,
		})
	}

	_handleOpenModalAddFloor = () => {
		this.setState({
			newMsgFloorAdd: { show: true },
		})
	}

	_handleOpenModalEditFloor = (floor, index) => {
		this.setState({
			newMsgFloorEdit: { show: true },
			floorEditFormInput: floor,
			floorIndexFormInput: index,
		})
	}

	_handleOpenModalEditAddFloor = (floor, index) => {
		this.setState({
			newMsgFloorAddEdit: { show: true },
			floorEditAddFormInput: floor,
			floorIndexAddFormInput: index,
		})
	}

	__handleTextChange = (event) => {
		this.setState({
			form: {
				...this.state.form,
				[event.target.name]: event.target.value,
			},
		})
	}

	__handleCloseSnackbar = () => {
		this.setState({
			loadingDoneSubmitForm: false,
		})
	}

	__handleEditFloorSubmit = () => {
		console.log('clicked')
		let { floorSections, floorEditFormInput, floorIndexFormInput } = this.state
		floorSections[floorIndexFormInput].name = floorEditFormInput
		this.setState({ floorSections })
		this._handleCloseModalAddFloor()
	}

	__handleEditAddFloorSubmit = () => {
		let { newFloorSections, floorEditFormInput, floorIndexAddFormInput } = this.state
		newFloorSections[floorIndexAddFormInput].name = floorEditFormInput
		this.setState({ newFloorSections })
		this._handleCloseModalAddFloor()
	}

	__handleOpenFileBuildingImage = () => {
		this.uploadEditImageBuilding.current.click()
	}

	__handleUploadBuildingEdit = (evt) => {
		this.setState({
			imageUploadBuildingEdit: evt.target.files[0],
			currentOutputImageEditBuilding: URL.createObjectURL(evt.target.files[0]),
		})
	}

	__submitEditForm = async () => {
		this.setState({
			loadingForSubmitForm: true,
		})
		let { imageUploadBuildingEdit, form, floorSections, newFloorSections } = this.state

		let building = this.getBuilding()

		try {
			if (imageUploadBuildingEdit !== '') {
				const image_edit_building_data = new FormData()
				image_edit_building_data.append('file', imageUploadBuildingEdit, imageUploadBuildingEdit.name)
				image_edit_building_data.append('token', localStorage.getItem('pb_user_token'))
				image_edit_building_data.append('building_id', localStorage.getItem('pb_building_id'))

				let res = await axios.post('/photo/building', image_edit_building_data, {})

				if (res.data) {
					let buildingRes = this.props.edit_building_form({
						variables: {
							token: localStorage.getItem('pb_user_token'),
							...building,
							...form,
							photo_id: res.data.id,
						},
					})

					if (buildingRes.data) {
						await Promise.all(
							floorSections.map((item) => {
								return this.props.edit_floors_form({
									variables: {
										token: localStorage.getItem('pb_user_token'),
										id: item.id,
										building_id: building.id,
										name: item.name,
										number: item.number,
									},
								})
							})
						)

						if (newFloorSections.length !== 0) {
							let increment_add_floor = floorSections.length

							await Promise.all(
								newFloorSections.map((newFloors, floor_index) => {
									return this.props
										.add_new_floor({
											variables: {
												token: localStorage.getItem('pb_user_token'),
												building_id: building.id,
												name: newFloors.name,
												number: increment_add_floor,
											},
										})
										.then(() => {
											increment_add_floor++
										})
								})
							)
						}
					}
				}
			} else {
				let result = await this.props.edit_building_form({
					variables: {
						token: localStorage.getItem('pb_user_token'),
						...building,
						...form,
						photo_id: this.state.building_photo_id,
					},
				})

				if (result.data) {
					await Promise.all(
						floorSections.map((item) => {
							return this.props.edit_floors_form({
								variables: {
									token: localStorage.getItem('pb_user_token'),
									id: item.id,
									building_id: building.id,
									name: item.name,
									number: item.number,
								},
							})
						})
					)

					if (newFloorSections.length !== 0) {
						let increment_add_floor = floorSections.length

						await Promise.all(
							newFloorSections.map((newFloors, floor_index) => {
								return this.props
									.add_new_floor({
										variables: {
											token: localStorage.getItem('pb_user_token'),
											building_id: building.id,
											name: newFloors.name,
											number: increment_add_floor,
										},
									})
									.then(() => {
										increment_add_floor++
									})
							})
						)
					}
				}
			}

			this.setState({
				loadingForSubmitForm: false,
				loadingDoneSubmitForm: true,
			})
		} catch (e) {
			console.log('e')
			this.setState({
				loadingForSubmitForm: false,
			})
		}
	}

	getFormValue = (key, defaultValue = '') => {
		return this.state.form[key] !== undefined
			? this.state.form[key]
			: this.props.query.data.buildings
			? this.props.query.data.buildings[0][key]
			: defaultValue
	}

	getBuilding = () => {
		if (this.props.query.data.buildings) {
			return this.props.query.data.buildings[0]
		}

		return null
	}

	render() {
		let {
			newMsgFloorAdd,
			newMsgFloorEdit,
			building_photo,
			currentOutputImageEditBuilding,
			loadingForSubmitForm,
			newFloorSections,
			newMsgFloorAddEdit,
		} = this.state

		let building = this.getBuilding()

		if (!building) return <Page />

		return (
			<Page>
				<div className="page-content building-list-content">
					{loadingForSubmitForm === true ? <LoadingComponent /> : null}

					<ContentHeader
						visibleBack={true}
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
								name: 'Edit',
							},
						]}
						title={building.name}
					/>
					<div className="body">
						<FormComponent>
							<div className="pb-form-title">
								<span>BUILDING EDIT FORM</span>
							</div>
							<div className="pb-form-description">
								<span>All fields marked with an asterisk (*) are compulsory.</span>
							</div>
							<div className="pb-form-body row">
								<div className="pb-section col-lg-6 col-md-12 col-sm-12">
									<div className="pb-section-title">
										<span>Building Info</span>
									</div>
									<div className="pb-section-body">
										<FormControl className="form-item" fullWidth>
											<TextField
												label="Building Name *"
												value={this.getFormValue('name')}
												name="name"
												onChange={this.__handleTextChange}
												margin="normal"
											/>
										</FormControl>
										<FormControl className="form-item" fullWidth>
											<TextField
												label="Street address *"
												value={this.getFormValue('street_address')}
												name="street_address"
												onChange={this.__handleTextChange}
												margin="normal"
											/>
										</FormControl>
										<FormControl className="form-item" fullWidth>
											<TextField
												label="Suburb"
												value={this.getFormValue('suburb')}
												name="suburb"
												onChange={this.__handleTextChange}
												margin="normal"
											/>
										</FormControl>
										<FormControl className="form-item" fullWidth>
											<TextField
												label="City *"
												value={this.getFormValue('city')}
												name="city"
												onChange={this.__handleTextChange}
												margin="normal"
											/>
										</FormControl>
										<FormControl className="form-item" fullWidth>
											<TextField
												label="Postcode *"
												value={this.getFormValue('postcode')}
												name="postcode"
												onChange={this.__handleTextChange}
												margin="normal"
											/>
										</FormControl>

										{/* <FormControl className="form-item" fullWidth margin="normal">
															<InputLabel htmlFor="country_list">Country</InputLabel>
															<Select
																value={form.building_country}
																inputProps={{
																	name: 'building_country',
																	id: 'country_list',
																}}
																onChange={this.__handleTextChange}
															>
																{countryListData.map((r, i) => (
																	<MenuItem key={i} value={r.code}>
																		{r.code}
																	</MenuItem>
																))}
															</Select>
														</FormControl> */}

										<div className="step-form row mt-30 mb-25">
											<div className="col-lg-12 col-md-12 h-100">
												<div className="pb-label">
													<span>Building Photo</span>
												</div>
												<div className="pb-form-button">
													<input
														ref={this.uploadEditImageBuilding}
														type="file"
														className="file-upload"
														onChange={this.__handleUploadBuildingEdit}
													/>
													<Button
														className="pb-take-photo"
														onClick={this.__handleOpenFileBuildingImage}
													>
														<AddPhotoAlternate fontSize="large" />
													</Button>
													<div className="taken-photo-container">
														{currentOutputImageEditBuilding === '' ? (
															<div
																className="taken-photo"
																style={{
																	backgroundImage:
																		'url(' +
																		(building_photo.includes('https://') ||
																		building_photo.includes('http://')
																			? building_photo
																			: config.URL + building_photo) +
																		')',
																}}
															/>
														) : (
															<img
																src={currentOutputImageEditBuilding}
																alt="building edit"
															/>
														)}
													</div>
												</div>
											</div>
										</div>
									</div>
								</div>
								<div className="pb-section col-lg-6 col-md-12 col-sm-12">
									<div className="row">
										{building.floors
											.sort((a, b) => a.number - b.number)
											.map((floor, i) => (
												<div className="col-3 mb-10" key={floor.id}>
													<Paper className="card-floor">
														<div className="icon-logo-delete">
															{building.floors.length > 1 && (
																<Close
																	onClick={() => {
																		this._removeSectionList(floor)
																	}}
																/>
															)}
														</div>
														<div className="card-floor-component">
															<h1 id={`{$i}_floor_key`}>{floor.name}</h1>
														</div>
														<div className="icon-logo-edit">
															<Edit
																onClick={() => {
																	this._handleOpenModalEditFloor(floor.name, i)
																}}
															/>
														</div>
													</Paper>
												</div>
											))}
										{newFloorSections.length !== 0
											? newFloorSections.map((section, i) => (
													<div className="col-3 mb-10" key={i}>
														<Paper className="card-floor">
															<div className="icon-logo-delete">
																{newFloorSections.length > 1 && (
																	<Close
																		onClick={() => {
																			this._removeSectionList(section)
																		}}
																	/>
																)}
															</div>
															<div className="card-floor-component">
																<h1 id={`{$i}_floor_key`}>{section.name}</h1>
															</div>
															<div className="icon-logo-edit">
																<Edit
																	onClick={() => {
																		this._handleOpenModalEditAddFloor(
																			section.name,
																			i
																		)
																	}}
																/>
															</div>
														</Paper>
													</div>
											  ))
											: null}
										<div className="col-3 mb-10">
											<Paper className="card-floor">
												<div
													className="card-floor-component-add"
													onClick={this._handleOpenModalAddFloor}
												>
													<Add />
													<p>Add Floor</p>
												</div>
											</Paper>
										</div>
									</div>
								</div>
								<div className="pb-form-button tenant col-12 justify-content-end">
									<Button
										size="large"
										variant="contained"
										style={{
											marginRight: '10px',
											backgroundColor: '#757575',
											color: 'white',
										}}
										onClick={() => this.props.history.push(`/building/${building.id}`)}
									>
										Cancel
									</Button>
									<Button
										size="large"
										variant="contained"
										color="primary"
										onClick={this.__submitEditForm}
									>
										SAVE
									</Button>
								</div>
							</div>
						</FormComponent>
					</div>

					<Snackbar
						anchorOrigin={{
							vertical: 'bottom',
							horizontal: 'right',
						}}
						open={this.state.loadingDoneSubmitForm}
						onClose={this.__handleCloseSnackbar}
						ContentProps={{
							'aria-describedby': 'message-id',
						}}
						message={<span id="message-id">Success Edit Building</span>}
					/>
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
								name="name"
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

					<Dialog
						open={newMsgFloorAddEdit.show}
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
								name="name"
								onChange={this.__setFormEditonChange}
								defaultValue={this.state.floorEditAddFormInput}
							/>
						</DialogContent>
						<DialogActions>
							<Button onClick={this._handleCloseModalAddFloor} color="secondary" variant="contained">
								Cancel
							</Button>
							<Button color="primary" variant="contained" onClick={this.__handleEditAddFloorSubmit}>
								Save
							</Button>
						</DialogActions>
					</Dialog>
				</div>
			</Page>
		)
	}
}

export default BuildingEditForm
