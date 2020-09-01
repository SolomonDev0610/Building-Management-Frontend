import React from 'react'
import './style.scss'
import { Paper, Button, FormControl, Select, Input, MenuItem } from '@material-ui/core'
import BuildingCards from 'components/BuildingCards/BuildingCards.component'
import MaintenanceRequestDialog from 'components/MaintenanceRequestDialog/MaintenanceRequestDialog.widget'
import 'components/MaintenanceWidgetComponent/MaintenanceWidget.style.scss'
import moment from 'moment'
import { graphql } from 'react-apollo'
import { buildingQueryList } from 'queries/building_queries'
import { changeMaintenanceRequest } from 'queries/building_mutations'
import Page from 'components/Page'
import query from 'util/query'
import withTitle from 'util/withTitle'

@query(() => ({
	query: buildingQueryList,
	variables: {
		token: localStorage.getItem('pb_user_token'),
	},
	fetchPolicy: 'cache-and-network',
}))
@graphql(changeMaintenanceRequest, {
	name: 'change_maintenance_request_name',
})
@withTitle
class Dashboard extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			value: 0,
			contentListData: {
				type: '',
				loadCurrrentData: true,
				data: [],
			},
			maintenanceRequest: [],
			maintenance_request_id: null,
			maintenance_request_index: null,
			notifModal: false,
		}
	}

	_clickAdd = () => {
		this.props.history.push('/building/new', { id: 1 })
	}

	_handleChangeSelect = event => {
		let { maintenanceRequest } = this.state
		this.props
			.change_maintenance_request_name({
				variables: {
					token: localStorage.getItem('pb_user_token'),
					id: this.state.maintenance_request_id,
					status_id: this.__convertStatusToID(event.target.value),
				},
			})
			.then(result => {
				if (result.data) {
					const index_id = maintenanceRequest.findIndex(x => x.id === this.state.maintenance_request_id)

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

	__setIDmaintenanceRequest = evt => {
		this.setState({
			maintenance_request_id: evt.currentTarget.querySelector('input').id,
			maintenance_request_index: evt.currentTarget.getAttribute('index_key'),
		})
	}

	_handleOpenDialogMaintenanceRequest = evt => {
		this.setState({
			notifModal: true,
			maintenance_request_id: evt.currentTarget.id,
		})
	}
	_handleCloseDialogMaintenanceRequest = () => {
		this.setState({
			notifModal: false,
			maintenance_request_id: null,
		})
	}

	__convertStatusToID = value => {
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

	render() {
		let { notifModal, maintenance_request_id } = this.state
		let newMessage = true

		let data = this.props.query.data.user

		if (!data) return <Page />

		let contentListData = {
			type: 'building_cards',
			loadCurrrentData: false,
			data: data.related_buildings,
		}

		let maintenanceRequests = data.related_buildings.reduce((acc, building) => {
			let tenancies = building.tenancies.reduce((acc, tenancy) => {
				return [...acc, ...tenancy.maintenance_requests]
			}, [])
			return [...acc, ...tenancies]
		}, [])

		return (
			<Page>
				<div className="building-manager-dashboard">
					<div className="page-content dashboard-content">
						<div className="list">
							<BuildingCards {...contentListData} />
						</div>
						{/* Remove Row Class for Re Arrangement*/}
						<div className="widgets">
							<div className="widget">
								<div className="notif-msg-widget p-0 m-0">
									<Paper className="d-flex flex-column notif-msg-body">
										<div className="notif-header">
											<span>Outstanding Maintenance Requests</span>
										</div>

										{maintenanceRequests
											.filter(data => data.status.name !== 'Completed')
											.map((data, index) => {
												return (
													<div
														key={`notif-msg-row-${index}`}
														className={
															newMessage === true
																? 'notif-msg-row-not-read row m-0 p-10 d-flex w-100'
																: 'notif-msg-row row m-0 p-10 d-flex w-100'
														}
													>
														<Button
															className="d-flex pb-button"
															id={data.id}
															onClick={this._handleOpenDialogMaintenanceRequest}
														>
															{' '}
														</Button>
														<div className={'img-box-wrapper p-0 col-2'}>
															<div
																className="notif-msg-img"
																style={{
																	backgroundImage: `url('${
																		data.photo ? data.photo.path : ''
																	}')`,
																}}
															/>
														</div>
														<div
															className={
																'notif-msg-details d-flex flex-column justify-content-center col-6'
															}
															style={{
																paddingLeft: '0px',
																paddingRight: '0px',
															}}
														>
															<span
																className={
																	newMessage === true
																		? 'fs-18 mb-5 fw-bold'
																		: 'fs-18 mb-5'
																}
															>
																{data.description.substring(0, 20) + '. . .'}
															</span>
															<span
																className={
																	newMessage === true
																		? 'fs-13 text-muted fw-bold'
																		: 'fs-13 text-muted'
																}
															>
																{data.tenancy.building.name}
															</span>
														</div>
														<div
															className="notif-msg-actions col-4"
															style={{
																textAlign: 'right',
															}}
														>
															<span className="fs-15 text-muted">
																{moment(data.created_at).fromNow()}
															</span>
															<FormControl>
																<Select
																	value={data.status.name}
																	name="change_progress_maintenance_record"
																	input={
																		<Input
																			name="change_progress_maintenance_record"
																			id={data.id}
																		/>
																	}
																	onChange={this._handleChangeSelect}
																	index_key={index}
																	onClick={this.__setIDmaintenanceRequest}
																	style={{
																		zIndex: '51',
																	}}
																>
																	<MenuItem value="Pending">Pending</MenuItem>
																	<MenuItem value="On Hold">On Hold</MenuItem>
																	<MenuItem value="In Progress">In Progress</MenuItem>
																	<MenuItem value="Completed">Completed</MenuItem>
																</Select>
															</FormControl>
														</div>
													</div>
												)
											})}
									</Paper>
								</div>
							</div>
						</div>
						{notifModal === true ? (
							<MaintenanceRequestDialog
								openDialogMaintenance={notifModal}
								closeDialogMaintenance={this._handleCloseDialogMaintenanceRequest}
								maintenance_request_id={maintenance_request_id}
								roleLoggedIn={'building_manager'}
							/>
						) : null}
					</div>
				</div>
			</Page>
		)
	}
}

export default Dashboard
