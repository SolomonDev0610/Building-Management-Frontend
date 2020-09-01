import React from 'react'
import './FileList.style.scss'
import axios from 'axios'
import ContentHeader from 'components/ContentHeader/ContentHeader.component'
import LoadingComponent from 'components/LoadingComponent/Loading.component'
import { Add, CloudDownload } from '@material-ui/icons'
import {
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	CircularProgress,
	Snackbar,
} from '@material-ui/core'
import IconFileDocx from 'assets/img/file-docx.png'
import IconFilePptx from 'assets/img/file-pptx.png'
import IconFileXlsx from 'assets/img/file-xlsx.png'
import IconFilePdf from 'assets/img/file-pdf.png'
import IconFileTxt from 'assets/img/file-txt.png'
import IconFile from 'assets/img/file-pb.png'
import { Query } from 'react-apollo'
import { getBuildingFiles, getBuildingFileView } from 'queries/building_queries'
import config from 'config'
import Page from 'components/Page'
import query from 'util/query'
import withTitle from 'util/withTitle'
import format from 'date-fns/format'

@query((props) => ({
	query: getBuildingFiles,
	variables: {
		token: localStorage.getItem('pb_user_token'),
		id: props.match.params.building_id,
	},
	fetchPolicy: 'cache-and-network',
}))
@withTitle
class FileList extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			uploadNewFileModal: {
				state: false,
			},
			formFileUpload: {
				file: '',
			},
			loadingSubmitFile: false,
			respondSubmitFile: false,
			errorSubmitFile: '',
			viewFile: {
				state: false,
				isQueryFinishedFileView: false,
				form: {
					name: '',
					path: '',
					relatedTos: {
						owner: '',
						property_manager: '',
						building_manager: '',
					},
				},
			},
			contentListFilterData: {
				addbutton: {
					visible: true,
					label: 'Add File',
					onClick: () => {
						this.setState({
							uploadNewFileModal: {
								state: true,
								form: {
									type: '',
									typeName: '',
									name: '',
								},
							},
						})
					},
				},
			},
			contentListData: {
				isQueryDone: false,
				data: [],
			},
		}
	}

	_closeModal = () => {
		this.setState({
			viewFile: {
				state: false,
				isQueryFinishedFileView: false,
				form: {
					name: '',
					path: '',
					relatedTos: {
						owner: '',
						property_manager: '',
						building_manager: '',
					},
				},
			},
		})
		this.setState({
			uploadNewFileModal: {
				state: false,
			},
			formFileUpload: {
				file: '',
			},
		})

		localStorage.removeItem('pb_file_item_id')
	}

	_selectFieldFilter = (event) => {
		let { contentListFilterData } = this.state
		contentListFilterData.selectField.value = event.target.value
		this.setState({ contentListFilterData })
	}

	_filterFieldFilter = (event) => {
		let { contentListFilterData } = this.state
		contentListFilterData.filterField.value = event.target.value
		this.setState({ contentListFilterData })
	}

	_textFieldFilter = (event) => {
		let { contentListFilterData } = this.state
		contentListFilterData.textField.value = event.target.value
		this.setState({ contentListFilterData })
	}

	_handleChange = (event) => {
		let { formFileUpload } = this.state
		formFileUpload[event.target.name] = event.target.value
		this.setState({ formFileUpload })
	}

	_removeRelatedToItem = (i) => {
		let { uploadNewFileModal } = this.state
		uploadNewFileModal.form.relatedTos.splice(i, 1)
		this.setState({ uploadNewFileModal })
	}

	__openViewFile = (fileID) => {
		localStorage.setItem('pb_file_item_id', fileID)
		this.setState({
			viewFile: {
				state: true,
				id: fileID,
			},
		})
	}

	filetypeIcon = (filetype) => {
		switch (filetype) {
			case 'docx':
				return IconFileDocx
			case 'pptx':
				return IconFilePptx
			case 'xlsx':
				return IconFileXlsx
			case 'pdf':
				return IconFilePdf
			case 'txt':
				return IconFileTxt
			default:
				return IconFile
		}
	}

	__setImageFileIcon = (filetype) => {
		switch (filetype) {
			case 'docx':
				return IconFileDocx
			case 'pptx':
				return IconFilePptx
			case 'xlsx':
				return IconFileXlsx
			case 'pdf':
				return IconFilePdf
			case 'txt':
				return IconFileTxt
			default:
				return IconFile
		}
	}

	__getDataFiles = (file) => {
		if (!this.state.contentListData.isQueryDone) {
			let dataForFiles = file.buildings[0].files.map((data) => {
				return { ...data, fileImgIcon: this.__setImageFileIcon(data.filetype) }
			})

			this.setState({
				contentListData: {
					isQueryDone: true,
					data: dataForFiles,
				},
			})
		}
	}

	__handleCloseSnackbar = () => {
		this.setState({
			respondSubmitFile: false,
		})
	}

	__handleChangeUploadFiles = (evt) => {
		let { formFileUpload } = this.state
		formFileUpload.file = evt.target.files[0]

		this.setState({ formFileUpload })
	}

	__handleSubmitUploadFiles = () => {
		let { formFileUpload } = this.state

		if (formFileUpload.file === '') {
			this.setState({
				errorSubmitFile: 'Please select a file',
			})
		} else {
			this.setState({
				uploadNewFileModal: {
					state: false,
				},
				loadingSubmitFile: true,
			})
			const file_upload = new FormData()
			file_upload.append('token', localStorage.getItem('pb_user_token'))
			file_upload.append('building_id', this.getBuilding().id)
			file_upload.append('file', formFileUpload.file)

			axios.post('/file', file_upload, {}).then((result) => {
				if (result.data) {
					setTimeout(() => {
						this.setState({
							loadingSubmitFile: false,
							respondSubmitFile: true,
						})
						this.props.query.refetch()
					}, 1000)
				}
			})
		}
	}

	getBuilding = () => {
		if (this.props.query.data.buildings) {
			return this.props.query.data.buildings[0]
		}

		return null
	}

	render() {
		let { contentListFilterData, viewFile, uploadNewFileModal, loadingSubmitFile, errorSubmitFile } = this.state

		let building = this.getBuilding()

		if (!building) return <Page />

		return (
			<Page>
				<div className="page-content file-list-content">
					{loadingSubmitFile === true ? <LoadingComponent /> : null}
					<ContentHeader
						addbutton={{
							visible: false,
							label: 'Add File',
							onClick: () => {
								this.setState({
									uploadNewFileModal: {
										state: true,
										form: {
											type: '',
											typeName: '',
											name: '',
											relatedTos: [],
										},
									},
								})
							},
						}}
						visibleBack={true}
						title={'Files for ' + building.name}
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
								name: 'Files',
							},
						]}
					/>
					<div className="pb-content-list">
						<div className="pb-content-filter">
							<Button
								color="primary"
								variant="contained"
								className="pb-content-header-button"
								onClick={contentListFilterData.addbutton.onClick}
							>
								<Add /> ADD FILE
							</Button>
						</div>
						<Query
							query={getBuildingFiles}
							variables={{
								token: localStorage.getItem('pb_user_token'),
								id: localStorage.getItem('pb_building_id'),
							}}
							onCompleted={this.__getDataFiles}
							fetchPolicy="cache-and-network"
						>
							{({ loading, data }) => {
								if (loading) {
									return (
										<div className="loader">
											<CircularProgress thickness={5} color="primary" />
										</div>
									)
								}

								return null
							}}
						</Query>

						<div className="pb-content-list-body">
							{building.files.length > 0 ? (
								<div className="card-files-list">
									<div className="row">
										{building.files.map((file) => (
											<div className="mb-20 mr-20" style={{ maxWidth: '300px' }} key={file.id}>
												<div
													className="card-files"
													onClick={() => this.__openViewFile(file.id)}
												>
													<div className="card-file-img">
														<img
															src={this.filetypeIcon(file.filetype)}
															alt={file.filetype + ' icon'}
														/>
													</div>
													<div className="card-file-description">
														<p className="file-name">{file.filename}</p>
														<p
															className="file-format-name"
															title={format(file.created_at, 'DD-MM-YYYY HH:mm:ss')}
														>
															Added: {format(file.created_at, 'DD-MM-YYYY')}
														</p>
													</div>
												</div>
											</div>
										))}
									</div>
								</div>
							) : (
								<div style={{ width: '100%' }}>
									<h1
										style={{
											margin: '50px auto',
											textAlign: 'center',
										}}
									>
										No files found
									</h1>
								</div>
							)}
						</div>
					</div>
					<Dialog
						open={viewFile.state}
						onClose={this._closeModal}
						fullWidth
						size="md"
						aria-labelledby="form-dialog-title"
					>
						<Query
							query={getBuildingFileView}
							variables={{
								token: localStorage.getItem('pb_user_token'),
								id: this.state.viewFile.id,
							}}
							fetchPolicy="cache-and-network"
						>
							{({ loading, data }) => {
								if (loading) {
									return (
										<div className="loader">
											<CircularProgress thickness={5} color="primary" />
										</div>
									)
								}
								return (
									<React.Fragment>
										<DialogTitle id="form-dialog-title">{data.files[0].filename}</DialogTitle>
										<DialogContent>
											<div className="modal-form">
												<div className="image-form">
													<Button
														variant="outlined"
														fullWidth
														color="primary"
														href={config.URL + data.files[0].path}
														target="_blank"
													>
														<CloudDownload
															style={{
																marginRight: '8px',
															}}
														/>{' '}
														Download File
													</Button>
												</div>
												<div className="file-dynamic-table preview w-100">
													<div className="dynamic-item">
														<h3 className="name">Type</h3>
														<h3 className="name">Type Name</h3>
													</div>
													{data.files[0].building.building_owners.length > 0 && (
														<div className="dynamic-item">
															<span className="name">Owner</span>
															<span className="name">
																{data.files[0].building.building_owners[0].user
																	.firstname +
																	' ' +
																	data.files[0].building.building_owners[0].user
																		.lastname}
															</span>
														</div>
													)}

													<div className="dynamic-item">
														<span className="name">Property Manager</span>
														<span className="name" />
													</div>
													<div className="dynamic-item">
														<span className="name">Building Manager</span>
														<span className="name">
															{data.files[0].building.building_managers[0].user
																.firstname +
																' ' +
																data.files[0].building.building_managers[0].user
																	.lastname}
														</span>
													</div>
												</div>
											</div>
										</DialogContent>
									</React.Fragment>
								)
							}}
						</Query>

						<DialogActions>
							<Button onClick={this._closeModal} color="primary" variant="contained">
								Cancel
							</Button>
						</DialogActions>
					</Dialog>

					<Dialog
						open={uploadNewFileModal.state}
						onClose={this._closeModal}
						aria-labelledby="form-dialog-title"
					>
						<DialogTitle id="form-dialog-title">Upload a file</DialogTitle>
						<DialogContent>
							<div className="modal-form">
								<div className="image-form">
									<input
										ref={'file-upload-add'}
										type="file"
										className="file-upload"
										onChange={this.__handleChangeUploadFiles}
									/>
								</div>
								<p className="text-center" style={{ color: '#f44336' }}>
									{errorSubmitFile !== '' ? errorSubmitFile : null}
								</p>
								<div className="file-dynamic-table w-100" />
							</div>
						</DialogContent>
						<DialogActions>
							<Button
								onClick={this._closeModal}
								color="secondary"
								variant="contained"
								style={{ backgroundColor: '#757575' }}
							>
								Cancel
							</Button>
							<Button onClick={this.__handleSubmitUploadFiles} variant="contained" color="primary">
								Upload
							</Button>
						</DialogActions>
					</Dialog>
					<Snackbar
						anchorOrigin={{
							vertical: 'bottom',
							horizontal: 'right',
						}}
						open={this.state.respondSubmitFile}
						onClose={this.__handleCloseSnackbar}
						ContentProps={{
							'aria-describedby': 'message-id',
						}}
						message={<span id="message-id">Success Upload File</span>}
					/>
				</div>
			</Page>
		)
	}
}

export default FileList
