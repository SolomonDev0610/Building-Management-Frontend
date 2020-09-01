import React, { Component } from 'react'
import './BuildingTableList.style.scss'

import {
	Paper,
	Button,
	TextField,
	InputAdornment,
	Table,
	TableHead,
	TableRow,
	TableCell,
	TableBody,
	IconButton,
	Menu,
	MenuItem,
	Dialog,
	DialogTitle,
	DialogContent,
	DialogContentText,
	DialogActions,
} from '@material-ui/core'

import { Search, MoreVert } from '@material-ui/icons'
import { withRouter } from 'react-router-dom'

@withRouter
class BuildingTableList extends Component {
	state = {
		search_tenant: '',
		search_owner: '',
		menuLinkStateOwner: null,
		menuLinkStateOwnerID: null,
		menuLinkStateOwnerDeleteID: null,
		menuLinkStateTenant: null,
		menuLinkStateTenantDeleteID: null,
		menuLinkStateTenantID: null,
	}

	__renderHeader = () => {
		let { list_type } = this.props
		switch (list_type) {
			case 'owner':
				return this.__headerOwner()
			case 'tenant':
				return this.__headerTenant()
			default:
				return null
		}
	}

	__headerOwner = () => {
		let { search_owner } = this.state
		return (
			<Paper style={{ flex: 1, overflow: 'hidden', height: '48px' }}>
				<TextField
					className="pb-content-text-field"
					fullWidth
					onChange={this.__handleChangeSearchOwner}
					value={search_owner}
					placeholder="Search for owner"
					InputProps={{
						disableUnderline: true,
						startAdornment: (
							<InputAdornment position="start">
								<Search />
							</InputAdornment>
						),
					}}
				/>
			</Paper>
		)
	}

	__handleChangeSearchOwner = evt => {
		this.setState({
			search_owner: evt.target.value,
		})
	}

	__headerTenant = () => {
		let { search_tenant } = this.state
		return (
			<Paper style={{ flex: 1, overflow: 'hidden', height: '48px' }}>
				<TextField
					className="pb-content-text-field"
					fullWidth
					onChange={this.__handleChangeSearchTenant}
					value={search_tenant}
					placeholder="Search for tenant"
					InputProps={{
						disableUnderline: true,
						startAdornment: (
							<InputAdornment position="start">
								<Search />
							</InputAdornment>
						),
					}}
				/>
			</Paper>
		)
	}

	__handleChangeSearchTenant = evt => {
		this.setState({
			search_tenant: evt.target.value,
		})
	}

	__renderBody = () => {
		let { list_type } = this.props
		switch (list_type) {
			case 'owner':
				return this.__bodyOwner()
			case 'tenant':
				return this.__bodyTenant()
			default:
				return null
		}
	}

	__handleOpenOwnerMenuList = event => {
		this.setState({
			menuLinkStateOwner: event.currentTarget,
			menuLinkStateOwnerID: event.currentTarget.id,
			menuLinkStateOwnerDeleteID: event.currentTarget.id,
		})
	}

	__handleCloseOwnerMenuList = () => {
		this.setState({
			menuLinkStateOwner: null,
		})
	}

	__handleOpenOwnerModalDelete = () => {
		this.setState({
			modalDeleteOwnerList: true,
		})
	}

	__handleCloseOwnerModalDelete = () => {
		this.setState({
			modalDeleteOwnerList: false,
			menuLinkStateOwner: null,
		})
	}
	__handleDeleteOwner = () => {
		this.props.onDelete(this.state.menuLinkStateOwnerDeleteID)
	}
	__bodyOwner = () => {
		let { search_owner } = this.state
		let { data } = this.props

		return (
			<Paper>
				<Table>
					<TableHead style={{ backgroundColor: '#5cbfca' }}>
						<TableRow>
							<TableCell>
								<span className="table-header-title">Name</span>
							</TableCell>
							<TableCell>
								<span className="table-header-title">Email</span>
							</TableCell>
							<TableCell>
								<span className="table-header-title">Tenancies</span>
							</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{data ? (
							data.filter(
								e =>
									e.name.toLowerCase().indexOf(search_owner.toLowerCase()) !== -1 ||
									e.email.toLowerCase().indexOf(search_owner.toLowerCase()) !== -1
							).length === 0 ? (
								<TableRow>
									<TableCell colSpan={3}>
										<h1
											style={{
												margin: '50px auto',
												textAlign: 'center',
											}}
										>
											No items found with{' '}
											<b>
												<i>{search_owner}</i>
											</b>{' '}
											in the system <br /> <br />
										</h1>
									</TableCell>
								</TableRow>
							) : (
								data
									.filter(
										e =>
											e.name.toLowerCase().indexOf(search_owner.toLowerCase()) !== -1 ||
											e.email.toLowerCase().indexOf(search_owner.toLowerCase()) !== -1
									)
									.map((item, index) => (
										<TableRow key={index}>
											<TableCell>{item.name}</TableCell>
											<TableCell>{item.email}</TableCell>
											<TableCell>
												{item.tenancies
													.slice(0, 3)
													.map(x => x.name)
													.join(', ')}
												{item.tenancies.length > 4 && '...'}
											</TableCell>
										</TableRow>
									))
							)
						) : null}
					</TableBody>
				</Table>
			</Paper>
		)
	}

	__handleOpenTenantMenuList = event => {
		this.setState({
			menuLinkStateTenant: event.currentTarget,
			menuLinkStateTenantID: event.currentTarget.id,
			menuLinkStateTenantDeleteID: event.currentTarget.id,
		})
	}

	__handleCloseTenantMenuList = () => {
		this.setState({
			menuLinkStateTenant: null,
		})
	}

	__handleOpenTenantModalDelete = () => {
		this.setState({
			modalDeleteTenantList: true,
		})
	}

	__handleCloseTenantModalDelete = () => {
		this.setState({
			modalDeleteTenantList: false,
			menuLinkStateTenant: null,
		})
	}
	__handleDeleteTenant = () => {
		this.props.onDelete(this.state.menuLinkStateTenantDeleteID)
	}

	__bodyTenant = () => {
		let { data, delete_dialog, delete_dialog_open, delete_dialog_close } = this.props
		let { search_tenant, menuLinkStateTenant } = this.state

		return (
			<Paper>
				<Table>
					<TableHead style={{ backgroundColor: '#5cbfca' }}>
						<TableRow>
							<TableCell>
								<span className="table-header-title">Name</span>
							</TableCell>
							<TableCell>
								<span className="table-header-title">Email</span>
							</TableCell>
							<TableCell>
								<span className="table-header-title">Tenancy</span>
							</TableCell>
							<TableCell />
						</TableRow>
					</TableHead>
					<TableBody>
						{data ? (
							data.filter(
								e =>
									e.name.toLowerCase().indexOf(search_tenant.toLowerCase()) !== -1 ||
									e.email.toLowerCase().indexOf(search_tenant.toLowerCase()) !== -1 ||
									e.tenancy.toLowerCase().indexOf(search_tenant.toLowerCase()) !== -1
							).length === 0 ? (
								<TableRow>
									<TableCell colSpan={4}>
										<h1
											style={{
												margin: '50px auto',
												textAlign: 'center',
											}}
										>
											No items found with{' '}
											<b>
												<i>{search_tenant}</i>
											</b>{' '}
											in the system <br /> <br />
										</h1>
									</TableCell>
								</TableRow>
							) : (
								data
									.filter(
										e =>
											e.name.toLowerCase().indexOf(search_tenant.toLowerCase()) !== -1 ||
											e.email.toLowerCase().indexOf(search_tenant.toLowerCase()) !== -1 ||
											e.tenancy.toLowerCase().indexOf(search_tenant.toLowerCase()) !== -1
									)
									.map((item, index) => (
										<TableRow key={index}>
											<TableCell>{item.name}</TableCell>
											<TableCell>{item.email}</TableCell>
											<TableCell>{item.tenancy}</TableCell>
											<TableCell>
												<IconButton
													mini="true"
													id={item.id}
													onClick={this.__handleOpenTenantMenuList}
												>
													<MoreVert />
												</IconButton>
											</TableCell>
										</TableRow>
									))
							)
						) : null}
						<Menu
							id={'menu_anchor_owner_list_'}
							anchorEl={menuLinkStateTenant}
							anchorOrigin={{
								vertical: 'top',
								horizontal: 'right',
							}}
							transformOrigin={{
								vertical: 'top',
								horizontal: 'right',
							}}
							open={Boolean(menuLinkStateTenant)}
							onClose={this.__handleCloseTenantMenuList}
						>
							<MenuItem
								onClick={() => {
									let { building_id } = this.props.match.params
									let tenant_id = this.state.menuLinkStateTenantID

									this.props.history.push(`/building/${building_id}/tenant/${tenant_id}/edit`)
								}}
							>
								Edit
							</MenuItem>
							<MenuItem onClick={delete_dialog_open}>Delete</MenuItem>
						</Menu>
					</TableBody>
				</Table>
				<Dialog
					open={delete_dialog}
					onClose={delete_dialog_close}
					aria-labelledby="alert_confirm_delete_tenant_list_label"
					aria-describedby="alert_confirm_delete_tenant_list_content"
				>
					<DialogTitle id="alert_confirm_delete_tenant_list_label">Delete Confirmation</DialogTitle>
					<DialogContent>
						<DialogContentText id="alert_confirm_delete_tenant_list_content">
							Are you sure to delete this tenant?
						</DialogContentText>
					</DialogContent>
					<DialogActions>
						<Button
							onClick={delete_dialog_close}
							color="secondary"
							variant="contained"
							style={{ backgroundColor: '#757575' }}
						>
							Cancel
						</Button>
						<Button color="primary" variant="contained" onClick={this.__handleDeleteTenant}>
							Delete
						</Button>
					</DialogActions>
				</Dialog>
			</Paper>
		)
	}

	render() {
		return (
			<div className="pb-content-list">
				<div className="pb-content-filter">{this.__renderHeader()}</div>
				{this.__renderBody()}
			</div>
		)
	}
}

export default BuildingTableList
