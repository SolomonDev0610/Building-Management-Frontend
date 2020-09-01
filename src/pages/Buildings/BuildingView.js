import React from 'react'
import './BuildingView.style.scss'
import ContentHeader from 'components/ContentHeader/ContentHeader.component'
import 'components/DashCard/DashCard.component.scss'
import Page from 'components/Page'
import { compose, graphql } from 'react-apollo'
import { buildingViewQuery } from 'queries/building_queries'
import { BuildingManagerRemove, BuildingOwnerRemove } from 'queries/building_mutations'
import { pinTenancy, unpinTenancy } from 'queries/tenancies_mutations'
import placeholderImg from 'assets/img/catalog-default-img.gif'
import { Paper, Snackbar, Button, TextField, InputAdornment } from '@material-ui/core'
import { Add, Search } from '@material-ui/icons'
import config from 'config'
import OutlineIcon from 'assets/img/outline-pin.png'
import BaseIcon from 'assets/img/pin.png'
import query from 'util/query'
import withTitle from 'util/withTitle'
import withRole from 'util/withRole'
import apollo from 'util/apollo'
import { getDecodedToken } from 'util/helpers'
import { Link } from 'react-router-dom'
import PersonCard from 'components/PersonCard/PersonCard.component'

@query(({ match }) => ({
	query: buildingViewQuery,
	variables: {
		token: localStorage.getItem('pb_user_token'),
		id: match.params.building_id,
	},
	fetchPolicy: 'cache-and-network',
}))
@compose(
	graphql(pinTenancy, { name: 'tenancy_pin' }),
	graphql(unpinTenancy, { name: 'tenancy_unpin' })
)
@withRole
@withTitle
class BuildingView extends React.Component {
	state = {
		queryCompleted: false,
		data: [],
		dataAll: [],
		searchTenancies: '',
		isSuccessChangePinned: false,
		successMessage: '',
		showUnoccupied: false,
	}

	__setStateTenanciesData = tenanciesData => {
		if (!this.state.queryCompleted) {
			let currentTenanciesList = tenanciesData.buildings[0].tenancies

			this.setState({
				queryCompleted: true,
				data: currentTenanciesList.sort((x, y) => {
					return x.is_pinned - y.is_pinned
				}),
				dataAll: currentTenanciesList.sort((x, y) => {
					return x.is_pinned - y.is_pinned
				}),
			})
		}
	}

	__initialSwitchTenancies = evt => {
		const tenancy_id = evt.currentTarget.id,
			tenancy_current_pinned = evt.currentTarget.getAttribute('alt')
		this.__switchPinnedTenancies(tenancy_id, tenancy_current_pinned)
	}

	__switchPinnedTenancies = (id, currentPinned) => {
		if (currentPinned === 'outline_icon') {
			this.props.tenancy_pin({
				variables: {
					token: localStorage.getItem('pb_user_token'),
					tenancy_id: id,
				},
			})
		} else {
			this.props.tenancy_unpin({
				variables: {
					token: localStorage.getItem('pb_user_token'),
					tenancy_id: id,
				},
			})
		}
	}

	__handleOncloseSnackar = () => {
		this.setState({
			isSuccessChangePinned: false,
		})
	}

	__handleChangeTextTenanciesSearch = evt => {
		this.setState({
			searchTenancies: evt.target.value,
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
			await apollo.mutate({
				mutation: BuildingManagerRemove,
				variables: {
					token: localStorage.getItem('pb_user_token'),
					id: role.id,
				},
			})
		} else if (type === 'owner') {
			await apollo.mutate({
				mutation: BuildingOwnerRemove,
				variables: {
					token: localStorage.getItem('pb_user_token'),
					id: role.id,
				},
			})
		}

		await this.props.query.refetch()
	}

	applySort = tenancies => tenancies.sort((a, b) => b.is_pinned - a.is_pinned)

	getData = () => {
		if (this.props.query.data.buildings) {
			if (this.props.query.data.buildings[0].tenancies) {
				return this.applySort(this.props.query.data.buildings[0].tenancies)
			}
		}

		return []
	}

	getBuilding = () => {
		if (this.props.query.data.buildings) {
			return this.props.query.data.buildings[0]
		}

		return null
	}

	render() {
		let { searchTenancies, showUnoccupied } = this.state

		let data = this.getData()
		let building = this.getBuilding()

		if (showUnoccupied) {
			data = data.filter(x => !x.tenants.length)
		}

		if (!building) return <Page />

		const isManager = this.props.role.isBuildingManager(building.id)
		const isOwner = this.props.role.isBuildingOwner(building.id)

		const tenancies = data.filter(e => e.name.toLowerCase().indexOf(searchTenancies.toLowerCase()) !== -1)

		return (
			<Page>
				<div className="page-content building-view-content">
					<ContentHeader
						visibleBack={true}
						breadcrumb={[
							{
								name: 'Dashboard',
								link: '/dashboard',
							},
							{
								name: building.name,
							},
						]}
						title={building.name}
					/>
					<div className="body">
						<div className="list pb-10">
							<Paper style={{ height: 'auto', padding: 12 }}>
								<div className="component-list-wrapper">
									<div className="component-list-head">
										{isManager && (
											<Button
												variant="contained"
												color="primary"
												style={{ marginRight: '5px' }}
												component={Link}
												to={`/building/${building.id}/tenancy/new`}
											>
												ADD Tenancy
												<Add />
											</Button>
										)}
										<Button
											variant="contained"
											color="secondary"
											style={{
												backgroundColor: '#757575',
											}}
											onClick={() => {
												this.setState({
													showUnoccupied: !this.state.showUnoccupied,
												})
											}}
										>
											{this.state.showUnoccupied ? 'SHOW ALL' : 'SHOW UNOCCUPIED'}
										</Button>
										<Paper
											style={{
												flex: 1,
												overflow: 'hidden',
											}}
										>
											<TextField
												fullWidth
												onChange={this.__handleChangeTextTenanciesSearch}
												id="simple-state-adorment"
												value={this.state.searchTenancies}
												placeholder="Search by tenancy"
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
									</div>
									<div className="component-list-body">
										{this.state.searchTenancies ? (
											<div
												style={{
													margin: 'auto',
													textAlign: 'center',
												}}
											>
												<p>
													No tenancies match the search term "<b>{searchTenancies}</b>".
												</p>
												<Button
													variant="contained"
													color="primary"
													onClick={() => {
														this.props.history.push(`/building/${building.id}/tenancy/new`)
													}}
												>
													ADD TENANCY
													<Add />
												</Button>
											</div>
										) : tenancies.length === 0 ? (
											<div
												style={{
													margin: 'auto',
													textAlign: 'center',
												}}
											>
												<p>No tenancies found.</p>
												<Button
													variant="contained"
													color="primary"
													onClick={() => {
														this.props.history.push(`/building/${building.id}/tenancy/new`)
													}}
												>
													ADD TENANCY
													<Add />
												</Button>
											</div>
										) : (
											<div className="list-card-wrapper">
												{tenancies.map((item, index) => (
													<div key={index} className="dash-card-container d-flex mb-16">
														<div className="dash-card">
															<div className="dash-badge">
																{item.is_pinned ? (
																	<img
																		src={BaseIcon}
																		alt="base_icon"
																		onClick={this.__initialSwitchTenancies}
																		id={item.id}
																	/>
																) : (
																	<img
																		src={OutlineIcon}
																		alt="outline_icon"
																		onClick={this.__initialSwitchTenancies}
																		id={item.id}
																	/>
																)}
															</div>
															<div className="dash-status">{item.status}</div>
															<div className="dash-card-content d-flex">
																<div className="dash-card-img-wrapper">
																	<Button
																		className="d-flex pb-button"
																		children={<span />}
																		onClick={() => {
																			this.props.history.push(
																				`/building/${
																					this.props.match.params.building_id
																				}/tenancy/${item.id}`
																			)
																		}}
																	/>
																	<div className="dash-img-overlay w-100" />
																	{item.photo ? (
																		<div
																			className="dash-card-img"
																			style={{
																				backgroundImage: `url(${
																					item.photo.path.includes(
																						'https://'
																					) ||
																					item.photo.path.includes('http://')
																						? item.photo.path
																						: config.URL + item.photo.path
																				})`,
																			}}
																		/>
																	) : (
																		<div
																			className="dash-card-img"
																			style={{
																				backgroundImage: `url(${placeholderImg})`,
																			}}
																		/>
																	)}
																</div>

																<div className="d-flex flex-column align-items-center">
																	<div className="dash-card-details">
																		<h4
																			data-tip={
																				item.name.length < 20 ? '' : item.name
																			}
																		>{`${(item.name || 'Title').substr(0, 20)}${
																			(item.name || 'Title').length > 20
																				? '...'
																				: ''
																		}`}</h4>
																		<span>{item.tenants.length} Tenants</span>
																	</div>
																</div>
															</div>
														</div>
													</div>
												))}
											</div>
										)}
									</div>
								</div>
							</Paper>
						</div>
						<div className="stats pb-5 d-flex" style={{ flexDirection: 'column' }}>
							<div className="mb-10">
								{/* <Button
									color="primary"
									variant="contained"
									to={`/building/${building.id}/new-owner`}
									component={Link}
								>
									Add Owner <Add />
								</Button> */}

								{(isManager || isOwner) && (
									<Button
										color="primary"
										variant="contained"
										to={`/building/${building.id}/new-manager`}
										component={Link}
										className="ml-5"
									>
										Add Building Manager <Add />
									</Button>
								)}
							</div>

							{building.building_managers.map((bm, i) => (
								<PersonCard
									key={i}
									image={bm.user.photo ? bm.user.photo.path : ''}
									title="Building Manager"
									firstname={bm.user.firstname}
									lastname={bm.user.lastname}
									phone={bm.user.phonenumber}
									email={bm.user.email}
									buttons={[
										(isManager || isOwner) && building.building_managers.length > 1
											? {
													name: 'Unassign',
													onClick: this.unassign(bm, 'manager'),
											  }
											: null,
									]}
								/>
							))}
							{/* {building.building_owners.map((bo, i) => (
								<PersonCard
									key={i}
									image={bo.user.photo ? bo.user.photo.path : ''}
									title="Building Owner"
									firstname={bo.user.firstname}
									lastname={bo.user.lastname}
									phone={bo.user.phonenumber}
									email={bo.user.email}
									buttons={[
										building.building_managers.length > 1
											? {
													name: 'Unassign',
													onClick: this.unassign(bo, 'owner'),
											  }
											: null,
									]}
								/>
							))} */}
						</div>
					</div>
					<Snackbar
						anchorOrigin={{
							vertical: 'bottom',
							horizontal: 'right',
						}}
						open={this.state.isSuccessChangePinned}
						onClose={this.__handleOncloseSnackar}
						ContentProps={{
							'aria-describedby': 'message-id',
						}}
						message={<span id="message-id">{this.state.successMessage}</span>}
					/>
				</div>
			</Page>
		)
	}
}

export default BuildingView
