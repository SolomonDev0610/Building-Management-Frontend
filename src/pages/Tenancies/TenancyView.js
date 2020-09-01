import React from 'react'
import './PropertyView.style.scss'
import moment from 'moment'
import { Add, Edit, Apps, MailOutline } from '@material-ui/icons'
import NotesWidget from 'components/NotesWidget/NotesWidget.component'
import PersonCard from 'components/PersonCard/PersonCard.component'
import ContentHeader from 'components/ContentHeader/ContentHeader.component'
import MaintenanceRequestDialog from 'components/MaintenanceRequestDialog/MaintenanceRequestDialog.widget'
import LoadingComponent from 'components/LoadingComponent/Loading.component'
import {
	Paper,
	Avatar,
	TextField,
	MenuItem,
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	DialogContentText,
	Tabs,
	Tab,
	FormControl,
	Chip,
	CircularProgress,
	Table,
	TableHead,
	TableBody,
	TableRow,
	TableCell,
	Checkbox,
	Select,
	Input,
	Snackbar,
} from '@material-ui/core'
import { Query, graphql, compose } from 'react-apollo'
import { propertiesQueryDetails, listOfStatus } from 'queries/tenancies_queries'
import { changeTenancyNotes, TenancyManagerRemove, TenancyOwnerRemove } from 'queries/tenancies_mutations'
import { TenantChange } from 'queries/tenant_mutations'
import { changeMaintenanceRequest } from 'queries/building_mutations'
import Page from 'components/Page'
import query from 'util/query'
import withRole from 'util/withRole'
import withTitle from 'util/withTitle'
import format from 'date-fns/format'
import axios from 'axios'
import { Link } from 'react-router-dom'
import { getDecodedToken } from 'util/helpers'
import config from 'config'
import io from 'socket.io-client'

@query((props) => ({
	query: propertiesQueryDetails,
	variables: {
		token: localStorage.getItem('pb_user_token'),
		id: props.match.params.tenancy_id,
	},
	fetchPolicy: 'cache-and-network',
}))
@compose(
	graphql(changeMaintenanceRequest, {
		name: 'change_maintenance_request_name',
	}),
	graphql(changeTenancyNotes, { name: 'change_tenancy_notes' }),
	graphql(TenancyManagerRemove, { name: 'TenancyManagerRemove' }),
	graphql(TenancyOwnerRemove, { name: 'TenancyOwnerRemove' }),
	graphql(TenantChange, { name: 'TenantChange' })
)
@withTitle
@withRole
class TenancyView extends React.Component {
	state = {
		value: 0,
		movingInTenants: {
			state: false,
		},
		maintenanceRequest: [],
		files_list: [],
		tenant_list_data: [],
		tenant_list_selected: [],
		tenant_list_for_messaging: [],
		tenancies_note: undefined,
		queryTenantDetailList: false,
		dialogSendMessage: false,
		dialogSendMessagePropertyManager: false,
		dialogSendMessageOwner: false,
		notifModal: false,
		maintenance_request: [],
		maintenance_request_id: null,
		maintenance_request_index: null,
		statusList: [],
		isStatusQuery: false,
		isFinishedNotesLoading: false,
		isResponseProcessSubmit: false,
		responseSubmit: '',
		loading: false,
		messageContent: '',
		moveOutTenant: null,
		move_out_date: '',
	}

	socket = null

	componentDidMount() {
		this.socket = io.connect(config.SOCKET_SERVER, { secure: config.SOCKET_SERVER.indexOf('https') === 0 })

		this.socket.on('connect', this.handleSocketConnect)
	}

	componentWillUnmount() {
		this.socket.off('connect', this.handleSocketConnect)

		this.socket.disconnect()
	}

	handleSocketConnect = () => {
		console.log('connection', this.socket.id)
	}

	sendMessages = () => {
		if (!this.state.messageContent.trim()) return

		if (!this.socket.connected) {
			alert('The messaging service is down, please try again later')
		} else {
			this.state.tenant_list_for_messaging.forEach((user) => {
				this.socket.emit('clientMessage', {
					user_id: getDecodedToken().user.id,
					to_id: user.id,
					message: this.state.messageContent,
				})
			})
			alert(`Message${this.state.tenant_list_for_messaging.length > 1 ? 's' : ''} sent!`)

			this.setState({
				dialogSendMessage: false,
				messageContent: '',
			})
		}
	}

	_updateRentalPropertyType = (type) => {
		let { rentalPropertyType } = this.state
		rentalPropertyType.value = type
		this.setState({ rentalPropertyType })
	}

	_removeOnePerson = (index) => {
		let { personStat } = this.state

		if (index === 0) {
			personStat[0].image = ''
			personStat[0].name = 'No Property Manager Assigned'
			personStat[0].phone = 'N/A'
			personStat[0].email = 'N/A'
		} else {
			personStat[1].image = ''
			personStat[1].name = 'No Owner Assigned'
			personStat[1].phone = 'N/A'
			personStat[1].email = 'N/A'
		}

		personStat[index].buttons = [
			{
				name: 'Assign',
				onClick: () => {
					if (index === 1) this._clickAdd('owner')
					else this._clickAdd('propertyManager')
				},
			},
		]

		this.setState({ personStat })
	}

	_handleFormChange = (event) => {
		let { addModal } = this.state
		addModal.form[event.target.name] = event.target.value
		this.setState({ addModal })
	}

	_clickAdd = (type) => {
		let { addModal } = this.state
		addModal.state = true
		addModal.type = type
		this.setState({ addModal })
	}

	_handleCloseAddModal = () => {
		let { addModal } = this.state
		addModal.state = false
		this.setState({ addModal })
	}

	_miniTableRowClick = (o) => {
		this.props.router.navigate('tenants.view', { id: 1, obj: o }, { reload: true })
	}

	_backToList = () => {
		this.props.history.push(`/building/${this.getBuilding().id}`)
	}

	_handleTabChange = (event, value) => {
		this.setState({ value })
	}

	_handleTabChangeIndex = (index) => {
		this.setState({ value: index })
	}

	_clickApp = () => {
		this.props.router.navigate(
			'buildings.view.rezzy_tenancy',
			{
				buildings: this.props.route.params.buildings,
				tenancy: this.props.route.params.properties,
			},
			{ reload: true }
		)
	}

	openMessageDialog = (user) => () => {
		this.setState({
			dialogSendMessage: true,
			tenant_list_for_messaging: [user],
		})
	}

	openSelectedTenantMessageDialog = () => {
		let { tenant_list_selected } = this.state

		if (!tenant_list_selected.length) return

		let tenant_list_for_messaging = tenant_list_selected.map(
			(id) => this.props.query.data.tenancies[0].tenants.find((x) => x.id === id).user
		)

		this.setState({
			dialogSendMessage: true,
			tenant_list_for_messaging,
		})
	}

	_closeMessageDialog = () => {
		this.setState({
			dialogSendMessage: false,
		})
	}
	/**Calling all Query */

	__getDataTenant = (tenantInfo) => {
		if (!this.state.queryTenantDetailList) {
			this.setState({
				queryTenantDetailList: true,
			})
		}
	}

	/** Tenant list Query */
	__handleCheckList = (event, id) => {
		const { tenant_list_selected } = this.state
		const selectedIndex = tenant_list_selected.indexOf(id)
		let new_tenant_list_selected = []

		if (selectedIndex === -1) {
			new_tenant_list_selected = new_tenant_list_selected.concat(tenant_list_selected, id)
		} else if (selectedIndex === 0) {
			new_tenant_list_selected = new_tenant_list_selected.concat(tenant_list_selected.slice(1))
		} else if (selectedIndex === tenant_list_selected.length - 1) {
			new_tenant_list_selected = new_tenant_list_selected.concat(tenant_list_selected.slice(0, -1))
		} else if (selectedIndex > 0) {
			new_tenant_list_selected = new_tenant_list_selected.concat(
				tenant_list_selected.slice(0, selectedIndex),
				tenant_list_selected.slice(selectedIndex + 1)
			)
		}

		this.setState({ tenant_list_selected: new_tenant_list_selected })
	}

	__isSelected = (id) => this.state.tenant_list_selected.indexOf(id) !== -1

	tableTenant = () => {
		let tenancy = this.getTenancy()

		const isManager = this.props.role.isPropertyManager(tenancy.id)

		return (
			<div>
				{tenancy.tenants.length !== 0 ? (
					<Table>
						<TableHead style={{ backgroundColor: '#5cbfca' }}>
							<TableRow>
								{isManager && <TableCell padding="checkbox" />}
								<TableCell padding="dense">
									<span className="table-header-title">Name</span>
								</TableCell>
								<TableCell>
									<span className="table-header-title">Email</span>
								</TableCell>
								<TableCell>
									<span className="table-header-title">Mobile</span>
								</TableCell>
								<TableCell>
									<span className="table-header-title">Move In</span>
								</TableCell>
								<TableCell>
									<span className="table-header-title">Move Out</span>
								</TableCell>
								{isManager && <TableCell padding="dense" />}
							</TableRow>
						</TableHead>
						<TableBody>
							{tenancy.tenants.map((tenant) => {
								const isSelected = this.__isSelected(tenant.id)
								return (
									<TableRow
										selected={isSelected}
										onClick={(event) => isManager && this.__handleCheckList(event, tenant.id)}
										key={tenant.id}
										hover={true}
										role="checkbox"
										tabIndex={-1}
									>
										{isManager && (
											<TableCell padding="checkbox">
												<Checkbox
													checked={isSelected}
													value={'tenant_user_list_' + tenant.user.id}
												/>
											</TableCell>
										)}
										<TableCell padding="dense">
											{tenant.user.firstname + ' ' + tenant.user.lastname}
										</TableCell>
										<TableCell>{tenant.user.email}</TableCell>
										<TableCell>{tenant.user.phonenumber}</TableCell>
										<TableCell>
											{tenant.move_in_date && format(tenant.move_in_date, 'DD-MM-YYYY')}
										</TableCell>
										<TableCell>
											{tenant.move_out_date && format(tenant.move_out_date, 'DD-MM-YYYY')}
										</TableCell>
										{isManager && (
											<TableCell>
												<Button
													color="primary"
													variant="contained"
													onClick={this.moveOut(tenant)}
												>
													Move Out
												</Button>
											</TableCell>
										)}
									</TableRow>
								)
							})}
						</TableBody>
					</Table>
				) : (
					<div className="table-label-no-data">
						<h1>No tenants</h1>
					</div>
				)}
			</div>
		)
	}

	filesList = () => {
		let files_list = this.getBuilding().files

		return (
			<div>
				{files_list.length !== 0 ? (
					<div className="table-label-no-data">
						<h1>No Files</h1>
					</div>
				) : (
					<div className="table-label-no-data">
						<h1>No Files</h1>
					</div>
				)}
			</div>
		)
	}

	/** Maintenance Request Query */
	__convertStatusToID = (value) => {
		let value_id = null
		switch (value) {
			case 'Pending':
				value_id = 1
				break
			case 'On Hold':
				value_id = 2
				break
			case 'In Progress':
				value_id = 3
				break
			case 'Completed':
				value_id = 4
				break
			default:
				return false
		}
		return value_id
	}

	__getListofStatus = (status) => {
		if (!this.state.isStatusQuery) {
			this.setState({
				isStatusQuery: true,
				statusList: status.statuses,
			})
		}
	}

	_handleOpenDialogMaintenanceRequest = (evt) => {
		this.setState({
			notifModal: true,
			maintenance_request_id: evt.currentTarget.id,
		})
	}

	_handleCloseDialogMaintenanceRequest = () => {
		this.setState({
			notifModal: false,
		})
	}

	__setIDmaintenanceRequest = (evt) => {
		evt.stopPropagation()

		this.setState({
			maintenance_request_id: evt.currentTarget.querySelector('input').id,
			maintenance_request_index: evt.currentTarget.getAttribute('index_key'),
		})
	}

	_handleChangeSelect = (event) => {
		let tenancy = this.getTenancy()

		if (!this.props.role.isPropertyManager(tenancy.id)) return

		let maintenanceRequest = this.getTenancy().maintenanceRequests
		this.props
			.change_maintenance_request_name({
				variables: {
					token: localStorage.getItem('pb_user_token'),
					id: this.state.maintenance_request_id,
					status_id: this.__convertStatusToID(event.target.value),
				},
			})
			.then((result) => {
				if (result.data) {
					const index_id = maintenanceRequest.findIndex((x) => x.id === this.state.maintenance_request_id)
					this.setState({
						maintenanceRequest: [
							...this.state.maintenanceRequest.slice(0, index_id),
							Object.assign({}, this.state.maintenanceRequest[index_id], {
								status: {
									id: result.data.MaintenanceRequestChange.status.id,
									name: result.data.MaintenanceRequestChange.status.name,
								},
							}),
							...this.state.maintenanceRequest.slice(index_id + 1),
						],
					})
				}
			})
	}

	maintenanceRequestList = () => {
		let { statusList, notifModal, maintenance_request_id } = this.state

		const tenancy = this.getTenancy()

		const maintenance_requests = tenancy.maintenance_requests

		const isManager = this.props.role.isPropertyManager(tenancy.id)

		return (
			<div className="d-flex flex-column notif-msg-body">
				<div style={{ height: '100%' }}>
					<Query
						query={listOfStatus}
						variables={{
							token: localStorage.getItem('pb_user_token'),
						}}
						onCompleted={this.__getListofStatus}
						fetchPolicy="cache-and-network"
					>
						{({ loading }) => {
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
					{maintenance_requests.length > 0 ? (
						maintenance_requests.map((r, i) => {
							return (
								<div
									key={`notif-msg-row-${i}`}
									className={
										r.newMessage === true
											? 'notif-msg-row-not-read row m-0 p-10 d-flex w-100'
											: 'notif-msg-row row m-0 p-10 d-flex w-100'
									}
								>
									<div
										style={{ display: 'flex', width: '100%', cursor: 'pointer' }}
										onClick={this._handleOpenDialogMaintenanceRequest}
									>
										<div className="img-box-wrapper p-0 col-1">
											<div
												className="notif-msg-img"
												style={{
													backgroundImage: `url('${
														r.photo ? config.URL + r.photo.path : ''
													}')`,
												}}
											/>
										</div>

										<div
											className="notif-msg-details d-flex flex-column justify-content-center col-9"
											style={{
												paddingLeft: '0px',
												paddingRight: '0px',
											}}
										>
											<span
												className={r.newMessage === true ? 'fs-18 mb-5 fw-bold' : 'fs-18 mb-5'}
											>
												{r.description.substring(0, 20) + '. . .'}
											</span>

											<span
												className={
													r.newMessage === true
														? 'fs-13 text-muted fw-bold'
														: 'fs-13 text-muted'
												}
											>
												{r.tenancy.building.name}
											</span>
										</div>

										<div className="notif-msg-actions col-2" style={{ textAlign: 'right' }}>
											<span className="fs-16 text-muted">{moment(r.created_at).fromNow()}</span>
											<FormControl>
												<Select
													value={r.status.name}
													name="change_progress_maintenance_record"
													input={
														<Input name="change_progress_maintenance_record" id={r.id} />
													}
													onChange={this._handleChangeSelect}
													index_key={i}
													onClick={this.__setIDmaintenanceRequest}
													style={{ zIndex: '51' }}
													disabled={!isManager}
												>
													{statusList.map((item, index) => (
														<MenuItem key={index} value={item.name}>
															{item.name}
														</MenuItem>
													))}
												</Select>
											</FormControl>
										</div>
									</div>
								</div>
							)
						})
					) : (
						<div className="d-flex justify-content-center align-items-center p-20">
							<h4 className="text-muted">NO MAINTENANCE REQUESTS</h4>
						</div>
					)}
				</div>
				{notifModal === true ? (
					<MaintenanceRequestDialog
						openDialogMaintenance={notifModal}
						closeDialogMaintenance={this._handleCloseDialogMaintenanceRequest}
						maintenance_request_id={maintenance_request_id}
						roleLoggedIn={'propertyManager'}
					/>
				) : null}
			</div>
		)
	}

	/**Notes oN Change Handle */

	__handleOnChangeNotes = (notes) => {
		this.setState({
			tenancies_note: notes,
		})
	}

	__onSubmitNotes = async (e) => {
		e.preventDefault()

		this.setState({
			isFinishedNotesLoading: true,
		})

		await this.props.change_tenancy_notes({
			variables: {
				token: localStorage.getItem('pb_user_token'),
				id: this.getTenancy().id,
				notes: this.state.tenancies_note,
			},
		})

		setTimeout(() => {
			this.setState({
				isFinishedNotesLoading: false,
				isResponseProcessSubmit: true,
				responseSubmit: 'Success Edit Notes',
			})
		}, 1000)
	}

	__handleCloseSnackbar = () => {
		this.setState({
			isResponseProcessSubmit: false,
			responseSubmit: '',
		})
	}

	unassign = (role, type) => async () => {
		let confirmed = window.confirm(
			`Are you sure you want to unassign ${
				+role.user.id === +getDecodedToken().user.id ? 'yourself' : 'this user'
			}?`
		)
		if (!confirmed) return

		if (type === 'manager') {
			await this.props.TenancyManagerRemove({
				variables: {
					token: localStorage.getItem('pb_user_token'),
					id: role.id,
				},
			})
		} else if (type === 'owner') {
			await this.props.TenancyOwnerRemove({
				variables: {
					token: localStorage.getItem('pb_user_token'),
					id: role.id,
				},
			})
		}

		await this.props.query.refetch()
	}

	resendInvites = async () => {
		if (!this.state.tenant_list_selected.length) return

		this.setState({ loading: true })

		try {
			await axios.post('/resend-invitations', {
				token: localStorage.getItem('pb_user_token'),
				ids: this.state.tenant_list_selected,
			})
		} catch (e) {
			console.log('error', e)
		}

		this.setState({ loading: false })
	}

	moveOut = (tenant) => (e) => {
		e.stopPropagation()
		this.setState({
			moveOutTenant: tenant,
		})
	}

	moveOutSubmit = async () => {
		const tenant = this.state.moveOutTenant
		const date = this.state.move_out_date

		try {
			await this.props.TenantChange({
				variables: {
					token: localStorage.getItem('pb_user_token'),
					id: tenant.id,
					move_out_date: date,
				},
			})
		} catch (e) {
			console.log('err', e)
		}

		this.closeMoveOutModal()
	}

	closeMoveOutModal = () => {
		this.setState({
			moveOutTenant: null,
			move_out_date: '',
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
		const { tenant_list_for_messaging, value, dialogSendMessage, loading } = this.state

		const building = this.getBuilding()
		const tenancy = this.getTenancy()

		if (!tenancy) return <Page />

		const isManager = this.props.role.isPropertyManager(tenancy.id)
		const isOwner = this.props.role.isPropertyOwner(tenancy.id)

		return (
			<Page>
				<div className="page-content property-view-content">
					{loading === true ? <LoadingComponent /> : null}
					<Dialog
						open={dialogSendMessage}
						onClose={this._closeMessageDialog}
						aria-labelledby="message_send_dialog"
						size="md"
						fullWidth
					>
						<DialogTitle id="message_send_dialog">Send Message</DialogTitle>
						<DialogContent>
							<DialogContentText>To:</DialogContentText>
							<div className="chip-send-list">
								{tenant_list_for_messaging.map((user) => (
									<Chip
										key={user.id}
										color="primary"
										avatar={<Avatar src={user.photo ? config.URL + user.photo.path : ''} />}
										label={user.firstname + ' ' + user.lastname}
									/>
								))}
							</div>
							<TextField
								label="Type your message"
								margin="normal"
								fullWidth
								multiline
								value={this.state.messageContent}
								onChange={(e) => this.setState({ messageContent: e.target.value })}
							/>
						</DialogContent>
						<DialogActions>
							<Button color="secondary" variant="contained" onClick={this._closeMessageDialog}>
								CANCEL
							</Button>
							<Button color="primary" variant="contained" onClick={this.sendMessages}>
								SEND
							</Button>
						</DialogActions>
					</Dialog>

					{this.state.moveOutTenant && (
						<Dialog
							open={this.state.moveOutTenant !== null}
							onClose={this.closeMoveOutModal}
							size="md"
							fullWidth
						>
							<DialogTitle>
								Move out tenant: {this.state.moveOutTenant.user.firstname}{' '}
								{this.state.moveOutTenant.user.lastname}
							</DialogTitle>
							<DialogContent>
								<TextField
									label="Move out date"
									type="date"
									InputLabelProps={{
										shrink: true,
									}}
									fullWidth
									value={this.state.move_out_date}
									name="move_out_date"
									onChange={(e) => this.setState({ move_out_date: e.target.value })}
									margin="normal"
								/>
							</DialogContent>
							<DialogActions>
								<Button color="secondary" variant="contained" onClick={this.closeMoveOutModal}>
									CANCEL
								</Button>
								<Button color="primary" variant="contained" onClick={this.moveOutSubmit}>
									SAVE
								</Button>
							</DialogActions>
						</Dialog>
					)}

					<ContentHeader
						visibleBack={true}
						title={tenancy.name}
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
							},
						]}
					/>

					<div style={{ display: 'flex' }}>
						{isManager && (
							<>
								<Button
									color="primary"
									variant="contained"
									className="add-tenant-btn"
									to={`/building/${building.id}/tenancy/${tenancy.id}/new-tenant`}
									component={Link}
								>
									ADD TENANT <Add />
								</Button>
								<Button
									color="primary"
									variant="contained"
									className="add-tenant-btn"
									onClick={this.openSelectedTenantMessageDialog}
								>
									MESSAGE (SELECTED) <MailOutline style={{ marginLeft: '8px' }} />
								</Button>

								<Button
									color="secondary"
									variant="contained"
									className="add-tenant-btn"
									onClick={this.resendInvites}
								>
									RE-SEND APP INVITES (TO SELECTED) <MailOutline style={{ marginLeft: '8px' }} />
								</Button>

								<Button
									color="secondary"
									variant="contained"
									className="add-tenant-btn"
									to={`/building/${building.id}/tenancy/${tenancy.id}/edit`}
									component={Link}
								>
									Edit Tenancy <Edit style={{ marginLeft: '8px' }} />
								</Button>
							</>
						)}

						{(isManager || isOwner) && (
							<Button
								color="secondary"
								variant="contained"
								className="add-tenant-btn"
								to={`/building/${building.id}/tenancy/${tenancy.id}/app`}
								component={Link}
							>
								{isManager ? 'Manage' : 'View'} App <Apps style={{ marginLeft: '8px' }} />
							</Button>
						)}
					</div>

					<div className="body">
						<div className="list pr-0">
							<Paper>
								<Tabs
									scrollButtons="auto"
									style={{
										backgroundColor: 'white',
										fontSize: '120%',
										textAlign: 'center',
									}}
									value={value}
									onChange={this._handleTabChange}
									indicatorColor="primary"
									textColor="primary"
								>
									<Tab label="Tenants" />
									<Tab label="Notes" />
									{/* <Tab label="Files" /> */}
									<Tab label="Maintenance Requests" />
								</Tabs>
								{value === 0 ? (
									this.tableTenant()
								) : value === 1 ? (
									<div style={{ display: 'flex' }}>
										<NotesWidget
											note={this.state.tenancies_note || tenancy.notes || ''}
											onSubmitNotes={this.__onSubmitNotes}
											onChangeNotes={this.__handleOnChangeNotes}
											sendNotesForm={true}
											className="mb-0"
											disabled={!isManager}
										/>
									</div>
								) : // ) : value === 2 ? (
								// 	this.filesList()
								value === 2 ? (
									this.maintenanceRequestList()
								) : null}
							</Paper>
						</div>
						<div className="stats pb-5 d-flex" style={{ flexDirection: 'column' }}>
							{(isManager || isOwner) && (
								<div className="mb-10">
									<Button
										color="primary"
										variant="contained"
										to={`/building/${building.id}/tenancy/${tenancy.id}/new-owner`}
										component={Link}
									>
										Add Owner <Add />
									</Button>

									<Button
										color="primary"
										variant="contained"
										to={`/building/${building.id}/tenancy/${tenancy.id}/new-manager`}
										component={Link}
										className="ml-5"
									>
										Add Property Manager <Add />
									</Button>
								</div>
							)}

							{tenancy.tenancy_managers.map((tm, i) => (
								<PersonCard
									key={i}
									image={tm.user.photo ? tm.user.photo.path : ''}
									title="Property Manager"
									firstname={tm.user.firstname}
									lastname={tm.user.lastname}
									phone={tm.user.phonenumber}
									email={tm.user.email}
									buttons={[
										+tm.user.id !== +getDecodedToken().user.id
											? {
													name: 'Message',
													onClick: this.openMessageDialog(tm.user),
											  }
											: null,
										(isManager || isOwner) && tenancy.tenancy_managers.length > 1
											? {
													name: 'Unassign',
													onClick: this.unassign(tm, 'manager'),
											  }
											: null,
									]}
								/>
							))}
							{tenancy.tenancy_owners.map((to, i) => (
								<PersonCard
									key={i}
									image={to.user.photo ? to.user.photo.path : ''}
									title="Property Owner"
									firstname={to.user.firstname}
									lastname={to.user.lastname}
									phone={to.user.phonenumber}
									email={to.user.email}
									buttons={[
										+to.user.id !== +getDecodedToken().user.id
											? {
													name: 'Message',
													onClick: this.openMessageDialog(to.user),
											  }
											: null,
										isManager || isOwner
											? {
													name: 'Unassign',
													onClick: this.unassign(to, 'owner'),
											  }
											: null,
									]}
								/>
							))}
						</div>
					</div>
					<Snackbar
						anchorOrigin={{
							vertical: 'bottom',
							horizontal: 'right',
						}}
						open={this.state.isResponseProcessSubmit}
						onClose={this.__handleCloseSnackbar}
						ContentProps={{
							'aria-describedby': 'message-id',
						}}
						message={<span id="message-id">{this.state.responseSubmit}</span>}
					/>
				</div>
			</Page>
		)
	}
}

export default TenancyView
