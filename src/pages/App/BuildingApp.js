import React from 'react'
import { IconButton } from '@material-ui/core'
import { Edit, ArrowBack, ArrowForward } from '@material-ui/icons'
import TenantAppCard from 'components/TenantAppCard/TenantAppCard.component.js'
import './RezzySetup.style.scss'
import ContentHeader from 'components/ContentHeader/ContentHeader.component'

import { graphql, compose } from 'react-apollo'
import { buildingTilesQuery } from 'queries/tiles_queries'
import { TileAssign, TileOrder } from 'queries/tiles_mutations'
import config from 'config'
import Page from 'components/Page'
import query from 'util/query'
import withTitle from 'util/withTitle'
import withRole from 'util/withRole'
import { SortableContainer, SortableElement } from 'react-sortable-hoc'

@query((props) => ({
	query: buildingTilesQuery,
	variables: {
		token: localStorage.getItem('pb_user_token'),
		id: props.match.params.building_id,
	},
	fetchPolicy: 'cache-and-network',
}))
@compose(
	graphql(TileAssign, { name: 'TileAssign' }),
	graphql(TileOrder, { name: 'TileOrder' })
)
@withTitle
@withRole
class BuildingApp extends React.Component {
	state = {
		tiles: [],
	}

	componentDidUpdate(prevProps) {
		if (prevProps.query.data !== this.props.query.data) {
			let building = this.getBuilding()

			if (building) {
				this.setState({
					tiles: building.tiles,
				})
			}
		}
	}

	editTile = (tile) => () => this.props.history.push(`/building/${this.getBuilding().id}/app/tile/${tile.id}/edit`)

	changeTileAssignment = (tile, assigned) => async (e) => {
		e.preventDefault()
		e.stopPropagation()

		let variables = {
			token: localStorage.getItem('pb_user_token'),
			id: tile.id,
			assigned,
			display_order: assigned ? this.state.tiles.filter((x) => x.assigned).length : 0,
		}

		await this.props.TileAssign({ variables })

		await this.updateOrder().then(this.props.query.refetch)
	}

	onSortEnd = ({ oldIndex, newIndex }) => {
		let assigned = this.state.tiles.filter((x) => x.assigned).sort((x, y) => x.display_order - y.display_order)

		let tiles = assigned
			.filter((x) => x !== assigned[oldIndex])
			.concat([null])
			.reduce((acc, item, index) => {
				return index === newIndex ? [...acc, assigned[oldIndex], item] : [...acc, item]
			}, [])
			.filter((x) => x !== null)
			.map((tile, i) => ({ ...tile, display_order: i }))

		this.setState(
			{
				tiles: [...tiles, ...this.state.tiles.filter((x) => !x.assigned)],
			},
			() => this.updateOrder().then(this.props.query.refetch)
		)
	}

	updateOrder = () => {
		return this.props.TileOrder({
			variables: {
				token: localStorage.getItem('pb_user_token'),
				ids: this.state.tiles
					.filter((x) => x.assigned)
					.sort((x, y) => x.display_order - y.display_order)
					.map((x) => x.id),
			},
		})
	}

	getBuilding = () => {
		if (this.props.query.data.buildings) {
			return this.props.query.data.buildings[0]
		}

		return null
	}

	render() {
		const building = this.getBuilding()

		if (!building) return <Page />

		const unassigned = this.state.tiles.filter((x) => !x.assigned)
		const assigned = this.state.tiles.filter((x) => x.assigned).sort((x, y) => x.display_order - y.display_order)

		const isManager = this.props.role.isBuildingManager(building.id)

		return (
			<Page>
				<div className="page-content rezzy-setup-content">
					<ContentHeader
						addbutton={{
							visible: isManager,
							label: 'Add Tiles',
							onClick: () => this.props.history.push(`/building/${building.id}/app/new-tile`),
						}}
						visibleBack={true}
						title={isManager ? 'Manage App' : 'View App'}
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
								name: isManager ? 'Manage App' : 'View App',
							},
						]}
					/>
					<div className="container">
						<div className="row pt-20 pb-60">
							<div className="col-md-6 d-flex align-items-center flex-column">
								<div className="unassigned-apps mb-10">
									<h3>UNASSIGNED BUILDING-WIDE TILES</h3>
								</div>
								<div className="mb-10 full-width-row-tiles" id="unassigned">
									{unassigned.map((value) => (
										<TenantAppCard
											key={value.id}
											appImg={value.photo ? config.URL + value.photo.path : ''}
											appName={value.title}
											tile_id={value.id}
											tile_index={value.display_order}
										>
											{isManager && (
												<div className="controls">
													<IconButton onClick={this.changeTileAssignment(value, true)}>
														<ArrowForward />
													</IconButton>
													<IconButton onClick={this.editTile(value)}>
														<Edit />
													</IconButton>
												</div>
											)}
										</TenantAppCard>
									))}
								</div>
							</div>

							<div className="col-md-6 d-flex align-items-center flex-column">
								<div className="assigned-apps mb-10">
									<h3>ASSIGNED TILES</h3>
								</div>

								<div className="device device-iphone-x">
									<div className="device-frame">
										<div className="device-wrapper device-content d-flex flex-column">
											<div className="app-header">
												<div className="app-header-img-wrapper">
													<div
														className="app-header-img"
														style={{
															backgroundImg: `url()`,
														}}
													/>
												</div>
											</div>

											<div style={{ width: '100%', textAlign: 'center' }}>
												<p style={{ margin: '15px 0' }}>{building.street_address} </p>
											</div>

											<div style={{ overflowY: 'auto', borderRadius: '0 0 40px 40px' }}>
												<div className="tenant-apps mb-20">
													<div
														style={{
															overflowY: 'auto',
															overflowX: 'hidden',
														}}
													>
														<p className="mb-10">
															<strong>Building-Wide Tiles</strong>
														</p>

														<SortableList
															items={assigned}
															changeTileAssignment={this.changeTileAssignment}
															editTile={this.editTile}
															onSortEnd={this.onSortEnd}
															axis="xy"
															distance={5}
															style={{ zIndex: 999 }}
															isManager={isManager}
														/>
													</div>
												</div>
											</div>
										</div>
									</div>
									<div className="device-header" />
									<div className="device-sensors" />
									<div className="device-btns" />
									<div className="device-power" />
								</div>
							</div>
						</div>
					</div>
				</div>
			</Page>
		)
	}
}

const SortableItem = SortableElement(({ value, changeTileAssignment, editTile, isManager }) => (
	// <div>
	// 	<img src={value.photo ? config.URL + value.photo.path : ''} />
	// 	<p>{value.title}</p>
	// 	<div className="controls">
	// 		<IconButton onClick={changeTileAssignment(value, true)}>
	// 			<Add />
	// 		</IconButton>
	// 		<IconButton onClick={editTile(value)}>
	// 			<Edit />
	// 		</IconButton>
	// 	</div>
	// </div>
	<TenantAppCard
		appImg={value.photo ? config.URL + value.photo.path : ''}
		appName={value.title}
		tile_id={value.id}
		tile_index={value.display_order}
	>
		{isManager && (
			<div className="controls">
				<IconButton onClick={changeTileAssignment(value, false)}>
					<ArrowBack />
				</IconButton>
				<IconButton onClick={editTile(value)}>
					<Edit />
				</IconButton>
			</div>
		)}
	</TenantAppCard>
))

const SortableList = SortableContainer(({ items, ...props }) => (
	<div className="mb-10 full-width-row-tiles" id="unassigned">
		{items.map((value, index) => (
			<SortableItem
				key={`item-${index}`}
				index={index}
				value={value}
				{...props}
				style={{ zIndex: 9999 }}
				disabled={!props.isManager}
			/>
		))}
	</div>
))

export default BuildingApp
