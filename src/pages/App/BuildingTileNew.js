import React from 'react'
import ContentHeader from 'components/ContentHeader/ContentHeader.component'
import FormComponent from 'components/FormComponent/Form.component'
import LoadingComponent from 'components/LoadingComponent/Loading.component'
import { Add, Close } from '@material-ui/icons'
import { FormControl, TextField, Button, Snackbar } from '@material-ui/core'
import { graphql, compose } from 'react-apollo'
import { TileAdd, TileChange, SectionAdd, SectionChange, TileFileAdd } from 'queries/tiles_mutations'
import { buildingNameQuery } from 'queries/building_queries'
import axios from 'axios'
import Page from 'components/Page'
import query from 'util/query'
import withTitle from 'util/withTitle'
import ImageUploader from 'components/ImageUploader'
import FileUploader from 'components/FileUploader'

@query(props => ({
	query: buildingNameQuery,
	variables: {
		token: localStorage.getItem('pb_user_token'),
		id: props.match.params.building_id,
	},
	fetchPolicy: 'cache-and-network',
}))
@compose(
	graphql(TileAdd, { name: 'TileAdd' }),
	graphql(TileChange, { name: 'TileChange' }),
	graphql(SectionAdd, { name: 'SectionAdd' }),
	graphql(SectionChange, { name: 'SectionChange' }),
	graphql(TileFileAdd, { name: 'TileFileAdd' })
)
@withTitle
class BuildingTileNew extends React.Component {
	state = {
		form: {
			tile_name: '',
			tile_description: '',
		},
		image: null,
		currentImage: null,
		files: [],
		sections: [],
		finishedSubmitNewTiles: false,
		responseFinishedSubmitNewTiles: false,
		responseFinishedSubmitNewTilesContent: '',
	}

	_addSectionList = () => {
		this.setState({
			sections: [
				...this.state.sections,
				{
					title: '',
					image: '',
					subtitle: '',
					link_text: '',
					link_url: '',
					content: '',
				},
			],
		})
	}

	_setSectionField = (section, field) => event => {
		let target = event.target,
			currentInputedData =
				target.type === 'text' || target.type === 'textarea'
					? target.value
					: target.files
					? target.files[0]
					: null

		this.setState({
			sections: this.state.sections.map(x => {
				if (x !== section) return x
				return { ...section, [field]: currentInputedData }
			}),
		})
	}

	_removeSectionList = section => {
		this.setState({
			sections: this.state.sections.filter(x => x !== section),
		})
	}

	_handleModalFormChange = e => {
		let { form } = this.state
		form[e.target.name] = e.target.value
		this.setState({ form })
	}

	_removeCard = i => {
		let { form } = this.state
		form.children.splice(i, 1)
		this.setState({ form })
	}

	__handleOnChangeForm = evt => {
		let { form } = this.state

		form[evt.target.name] = evt.target.value
		this.setState({ form })
	}

	__handleOnChangeUploadImage = evt => {
		this.setState({
			image: evt.target.files[0],
			currentImage: URL.createObjectURL(evt.target.files[0]),
		})
	}

	__handleOnChangeUploadFiles = evt => {
		this.setState({
			files: Array.from(evt.target.files),
		})
	}

	__handleOnDeleteUploadFiles = index => {
		this.setState({
			files: this.state.files.filter((x, i) => {
				return i !== index
			}),
		})
	}

	__onFormValidation = () => {
		let { sections } = this.state
		let isError = false

		sections.forEach(sections => {
			if (
				sections.title === '' &&
				sections.subtitle === '' &&
				sections.link_text === '' &&
				sections.link_url === '' &&
				sections.content === ''
			) {
				isError = true
			} else {
				isError = false
			}
		})

		return isError
	}

	__onSubmitTiles = async () => {
		this.setState({
			finishedSubmitNewTiles: true,
		})

		let { form, files, sections, image } = this.state

		let building = this.getBuilding()

		if (this.__onFormValidation()) {
			// validation failed
			this.setState({
				finishedSubmitNewTiles: false,
				responseFinishedSubmitNewTiles: true,
				responseFinishedSubmitNewTilesContent: 'Section Must Not Be Empty',
			})
			return
		}

		try {
			let newTile = await this.props.TileAdd({
				variables: {
					token: localStorage.getItem('pb_user_token'),
					title: form.tile_name,
					description: form.tile_description,
					assigned: false,
					building_id: building.id,
				},
			})

			let tile = newTile.data.TileAdd

			if (image) {
				const image_tile = new FormData()
				image_tile.append('token', localStorage.getItem('pb_user_token'))
				image_tile.append('tile_id', tile.id)
				image_tile.append('file', image, image.name)

				let upload_result = await axios.post('/photo/tile', image_tile, {})

				this.props.TileChange({
					variables: {
						token: localStorage.getItem('pb_user_token'),
						id: tile.id,
						photo_id: upload_result.data.id,
					},
				})
			}

			await Promise.all(
				files.map(async file => {
					const files_upload_tiles = new FormData()

					files_upload_tiles.append('token', localStorage.getItem('pb_user_token'))
					files_upload_tiles.append('building_id', localStorage.getItem('pb_building_id'))
					files_upload_tiles.append('file', file)

					let files_result = await axios.post('/file', files_upload_tiles, {})

					this.props.TileFileAdd({
						variables: {
							token: localStorage.getItem('pb_user_token'),
							tile_id: tile.id,
							file_id: files_result.data.id,
						},
					})
				})
			)

			await Promise.all(
				sections.map(async section => {
					let result = await this.props.SectionAdd({
						variables: {
							token: localStorage.getItem('pb_user_token'),
							tile_id: tile.id,
							title: section.title,
							subtitle: section.subtitle,
							content: section.content,
							// link_text: section.link_text,
							// link_url: section.link_url
						},
					})

					if (section.image) {
						const section_upload_image = new FormData()
						section_upload_image.append('token', localStorage.getItem('pb_user_token'))
						section_upload_image.append('tile_id', result.data.SectionAdd.id)
						section_upload_image.append('file', section.image, section.image.name)

						let upload_image = await axios.post('/photo/tile', section_upload_image, {})

						await this.props.SectionChange({
							variables: {
								token: localStorage.getItem('pb_user_token'),
								id: result.data.SectionAdd.id,
								photo_id: upload_image.data.id,
							},
						})
					}
				})
			)

			this.props.history.push(`/building/${building.id}/app`)
		} catch (e) {
			console.log('err', e)
		}
	}

	__handleCloseSnackbar = () => {
		this.setState({
			responseFinishedSubmitNewTiles: false,
			responseFinishedSubmitNewTilesContent: '',
		})
	}

	getBuilding = () => {
		if (this.props.query.data.buildings) {
			return this.props.query.data.buildings[0]
		}

		return null
	}

	render() {
		let { sections, finishedSubmitNewTiles } = this.state
		let { tile_name, tile_description } = this.state.form

		let building = this.getBuilding()

		if (!building) return <Page />

		return (
			<Page>
				<div className="page-content rezzy-new-content">
					{finishedSubmitNewTiles === true ? <LoadingComponent /> : null}
					<ContentHeader
						visibleBack={true}
						title="New Building-Wide Tile"
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
								name: 'App',
								link: `/building/${building.id}/app`,
							},
							{
								name: 'New Tile',
							},
						]}
					/>
					<div className="body">
						<FormComponent>
							<div className="pb-form-body row">
								<div className="pb-section mt-0 col-lg-6 col-md-12 col-sm-12 mb-3">
									<div className="pb-form-description">
										<span>Tile Info</span>
									</div>
									<div className="mt-5">
										<TextField
											fullWidth
											label="Tile Name"
											margin="normal"
											name="tile_name"
											onChange={this.__handleOnChangeForm}
											value={tile_name}
										/>
										<TextField
											multiline
											rows="5"
											fullWidth
											label="Description"
											margin="normal"
											name="tile_description"
											onChange={this.__handleOnChangeForm}
											value={tile_description}
										/>
										<div className="file-input-containers">
											<div>
												<FormControl className="cat-type d-flex">
													<div className="pb-label">
														<span>Tile Image</span>
													</div>
													<ImageUploader
														onChange={file => this.setState({ image: file })}
														value={this.state.image}
													/>
												</FormControl>
											</div>
											<div>
												<FormControl className="cat-type d-flex">
													<div className="pb-label">
														<span>Tile Files</span>
													</div>
													<FileUploader
														onChange={file =>
															this.setState({ files: [...this.state.files, file] })
														}
														onRemove={file => {
															this.setState({
																files: this.state.files.filter(x => x !== file),
															})
														}}
														value={this.state.files}
													/>
												</FormControl>
											</div>
										</div>
									</div>
									<div>
										<Button
											color="primary"
											variant="contained"
											style={{ marginRight: '10px' }}
											size="large"
											onClick={this.__onSubmitTiles}
										>
											SAVE
										</Button>
										<Button
											variant="contained"
											style={{ marginRight: '10px', backgroundColor: '#757575', color: 'white' }}
											size="large"
											onClick={() => this.props.history.push(`/dashboard/${building.id}/app`)}
										>
											CANCEL
										</Button>
									</div>
								</div>

								<div className="pb-section mt-0 col-lg-6 col-md-12 col-sm-12 mb-3">
									{sections.map((section, i) => (
										<div key={i} className="mb-20">
											<div className="pb-form-description">
												Section
												<Close
													className="float-right"
													style={{ cursor: 'pointer' }}
													onClick={() => {
														this._removeSectionList(section)
													}}
												/>
											</div>
											<TextField
												label="Title *"
												className="pr-1 mt-2"
												margin="normal"
												value={section.title}
												onChange={this._setSectionField(section, 'title')}
												fullWidth
											/>
											<FormControl className="cat-type d-flex">
												<TextField
													label="Sub Title *"
													className="description"
													margin="normal"
													value={section.subtitle}
													onChange={this._setSectionField(section, 'subtitle')}
													multiline
												/>
											</FormControl>

											<FormControl className="cat-type d-flex">
												<TextField
													label="Section Description *"
													className="description"
													margin="normal"
													rows={5}
													value={section.content}
													onChange={this._setSectionField(section, 'content')}
													multiline
												/>
											</FormControl>
											{/* <FormControl fullWidth margin="normal">
												<input
													ref={'image-upload-section'}
													type="file"
													onChange={this._setSectionField(section, 'image')}
													className="file-upload"
												/>
											</FormControl> */}
											{/* <FormControl className="cat-type d-flex">
												<div className="pb-label">
													<span>Tile Image</span>
												</div>
												<div className="pb-form-button mt-5 mb-5">
													<input
														ref={'image-upload-card'}
														type="file"
														className="file-upload"
														onChange={this.__handleOnChangeUploadImage}
													/>
													<Button
														className="pb-take-photo"
														onClick={e => {
															this.refs['image-upload-card'].click()
														}}
													>
														<i className="material-icons">add_a_photo</i>
													</Button>
													<div className="taken-photo-container">
														<div className="taken-photo">
															{currentImage !== null ? (
																<img src={currentImage} alt="image_tiles_add" />
															) : null}
														</div>
													</div>
												</div>
											</FormControl> */}
											{/* <FormControl className="cat-type d-flex">
												<TextField
													className="description"
													multiline
													margin="normal"
													value={section.link_text}
													onChange={this._setSectionField(section, 'link_text')}
													label="Link Text (Optional)"
												/>
											</FormControl>
											<FormControl className="cat-type d-flex">
												<TextField
													className="description"
													multiline
													margin="normal"
													value={section.link_url}
													onChange={this._setSectionField(section, 'link_url')}
													label="Link URL (Optional)"
												/>
											</FormControl> */}
										</div>
									))}

									<Button
										color="primary"
										variant="contained"
										onClick={() => {
											this._addSectionList()
										}}
									>
										<Add />
										Add Section
									</Button>
								</div>
							</div>
						</FormComponent>
						<Snackbar
							anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
							open={this.state.responseFinishedSubmitNewTiles}
							onClose={this.__handleCloseSnackbar}
							ContentProps={{
								'aria-describedby': 'message-id',
							}}
							message={<span id="message-id">{this.state.responseFinishedSubmitNewTilesContent}</span>}
						/>
					</div>
				</div>
			</Page>
		)
	}
}
export default BuildingTileNew
