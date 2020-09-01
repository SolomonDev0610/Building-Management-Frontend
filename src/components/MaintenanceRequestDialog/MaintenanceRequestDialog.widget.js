import React, { Component } from 'react'
import {
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	Typography,
	FormControl,
	InputLabel,
	Select,
	MenuItem,
	CircularProgress
} from '@material-ui/core'

import './MaintenanceRequest.style.scss'
import { Query, graphql } from 'react-apollo'
import { maintenanceRequestQueryList, listOfStatus } from 'queries/tenancies_queries'
import { changeMaintenanceRequest } from 'queries/building_mutations'
import moment from 'moment'

class MaintenanceRequestDialog extends Component {
	constructor(props) {
		super(props)
		this.state = {
			isCompleteQueryData: false,
			isCompleteQueryListData: false,
			maintenanceData: {
				id: '',
				submitted_by: '',
				unit: '',
				building: '',
				description: '',
				image: '',
				status: ''
			},
			change_progress_maintenance: '',
			status: []
		}
	}

	__setDataMaintenanceRequest = data => {
		if (!this.state.isCompleteQueryData) {
			this.setState({
				isCompleteQueryData: true,
				maintenanceData: {
					id: data.maintenanceRequests[0].id,
					submitted_by:
						data.maintenanceRequests[0].user.firstname +
						' ' +
						data.maintenanceRequests[0].user.lastname +
						'     ' +
						moment(data.maintenanceRequests[0].created_at).fromNow(),
					unit: data.maintenanceRequests[0].tenancy.name,
					building: data.maintenanceRequests[0].tenancy.building.name,
					description: data.maintenanceRequests[0].description,
					image: data.maintenanceRequests[0].photo ? data.maintenanceRequests[0].photo.path : '',
					status: data.maintenanceRequests[0].status.name
				}
			})
		}
	}
	__setListofStatus = status => {
		if (!this.state.isCompleteQueryListData) {
			this.setState({
				isCompleteQueryListData: true,
				status: status.statuses
			})
		}
	}

	componentWillUnmount = () => {
		this.setState({
			isCompleteQueryData: false,
			maintenanceData: {
				submitted_by: '',
				unit: '',
				building: '',
				description: '',
				image: '',
				status: ''
			}
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
	__handleChangeDropdown = evt => {
		let status_id = this.__convertStatusToID(evt.target.value)
		this.props
			.change_maintenance_request({
				variables: {
					token: localStorage.getItem('pb_user_token'),
					id: this.state.maintenanceData.id,
					status_id: status_id
				}
			})
			.then(result => {
				if (result.data) {
					this.setState({
						change_progress_maintenance: result.data.MaintenanceRequestChange.status.name
					})
				}
			})
	}
	handleDeleteSnackBarClose = () => {
		this.setState({
			confirmChangedStatus: false
		})
	}

	render() {
		let { openDialogMaintenance, closeDialogMaintenance, maintenance_request_id } = this.props
		let { status } = this.state

		return (
			<Dialog
				open={openDialogMaintenance}
				onClose={closeDialogMaintenance}
				fullWidth
				maxWidth="sm"
				scroll="body"
				aria-labelledby="notif_dialog_maintenance"
			>
				<Query
					query={listOfStatus}
					variables={{
						token: localStorage.getItem('pb_user_token')
					}}
					onCompleted={this.__setListofStatus}
					fetchPolicy="cache-and-network"
				>
					{() => {
						return null
					}}
				</Query>
				<Query
					query={maintenanceRequestQueryList}
					variables={{
						token: localStorage.getItem('pb_user_token'),
						id: maintenance_request_id
					}}
					onCompleted={this.__setDataMaintenanceRequest}
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

						return (
							<React.Fragment>
								{this.state.maintenanceData.description !== undefined ? (
									<DialogTitle id="notif_dialog_maintenance">
										{this.state.maintenanceData.description}
									</DialogTitle>
								) : null}

								<DialogContent>
									<Typography variant="subtitle1" style={{ marginTop: '5px' }}>
										<span className="font-weight-bold">Submitted By:</span>{' '}
										{this.state.maintenanceData.submitted_by}
									</Typography>
									<Typography variant="subtitle1">
										<span className="font-weight-bold">Unit:</span>{' '}
										{this.state.maintenanceData.unit}
									</Typography>
									<Typography variant="subtitle1" style={{ marginBottom: '18px' }}>
										<span className="font-weight-bold">Building Address:</span>{' '}
										{this.state.maintenanceData.building}
									</Typography>
									<Typography variant="body1" style={{ fontSize: '1.15rem' }}>
										{this.state.maintenanceData.description}
									</Typography>

									<div className="notif-dialog-maintenance-image">
										{this.state.maintenanceData.image && (
											<img src={this.state.maintenanceData.image} alt="thumbnail" />
										)}
									</div>
									<FormControl fullWidth>
										<InputLabel htmlFor="pb_role">Status</InputLabel>
										<Select
											value={
												this.state.change_progress_maintenance === ''
													? this.state.maintenanceData.status
													: this.state.change_progress_maintenance
											}
											name="change_progress_maintenance"
											onChange={this.__handleChangeDropdown}
											style={{ marginBottom: '25px' }}
										>
											{status.map((item, index) => (
												<MenuItem key={index} value={item.name}>
													{item.name}
												</MenuItem>
											))}
										</Select>
									</FormControl>
								</DialogContent>
							</React.Fragment>
						)
					}}
				</Query>

				<DialogActions>
					<Button onClick={closeDialogMaintenance} color="secondary" variant="contained">
						Close
					</Button>
				</DialogActions>
			</Dialog>
		)
	}
}

export default graphql(changeMaintenanceRequest, { name: 'change_maintenance_request' })(MaintenanceRequestDialog)
