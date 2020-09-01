import React from 'react'
import './Sidebar.style.scss'
import BMSidebarData from 'containers/BuildingManager.sidebarMenuList'
import OwnerSidebarData from 'containers/Owner.sidebarMenuList'
import { Button } from '@material-ui/core'
import { ChevronRight } from '@material-ui/icons'
import { buildingViewQuery } from 'queries/building_queries'
import config from 'config'
import query from 'util/query'
import { withRouter, Link } from 'react-router-dom'
import placeholderImg from 'assets/img/catalog-default-img.gif'
import withRole from 'util/withRole'

@withRole
@withRouter
@query(props => ({
	query: buildingViewQuery,
	variables: {
		token: localStorage.getItem('pb_user_token'),
		id: props.match.params.building_id,
	},
	fetchPolicy: 'cache-and-network',
}))
class SideBar extends React.Component {
	isActive = menuItem => {
		return menuItem.link(this.props.query.data.buildings[0]) === this.props.match.url
	}

	render() {
		if (!this.props.query.data.buildings) {
			return (
				<div className="master-sidebar">
					<div className="body">
						<div className="cover-photo">
							<button
								style={{
									border: 'none',
									background: 'none',
									width: '100%',
									height: '100%',
									flex: '1',
									padding: '0',
									textAlign: 'left',
								}}
							>
								<div
									className="cover-photo-img"
									style={{
										backgroundImage: `url(${placeholderImg})`,
									}}
								>
									<div className="building-profile" />
								</div>
							</button>
						</div>
					</div>
				</div>
			)
		}

		let building = this.props.query.data.buildings[0]

		let { name, street_address, photo } = building

		let menu = this.props.role.isBuildingManager(building.id)
			? BMSidebarData
			: this.props.role.isBuildingOwner(building.id)
			? OwnerSidebarData
			: []

		return (
			<div className="master-sidebar">
				<div className="body">
					<div className="cover-photo">
						<Link
							style={{
								border: 'none',
								background: 'none',
								width: '100%',
								height: '100%',
								flex: '1',
								padding: '0',
								textAlign: 'left',
							}}
							to={`/building/${building.id}`}
						>
							<div
								className="cover-photo-img"
								style={{
									backgroundImage: photo
										? `url(${config.URL + photo.path})`
										: `url(${placeholderImg})`,
								}}
							>
								<div className="building-profile">
									<h4>{name}</h4>
									<h5>{street_address}</h5>
								</div>
							</div>
						</Link>
					</div>
					<div className="menu">
						{menu.map((menuSection, i) => (
							<div key={i} className="menu-cluster">
								<div className="cluster-title">
									<span>{menuSection.name}</span>
								</div>
								{menuSection.children.map((menuItem, ii) => {
									return (
										<Button
											to={menuItem.link(building)}
											component={Link}
											key={`menu-cluster-item-${ii}`}
											className={this.isActive(menuItem) ? 'active' : ''}
										>
											{/* <Link to={menuItem.link(building)}> */}
											{menuItem.icon}
											{menuItem.name}
											{menuItem.removeRightIcon ? (
												menuItem.removeRightIcon ? null : (
													<ChevronRight className="mini" />
												)
											) : (
												<ChevronRight className="mini" />
											)}
											{/* </Link> */}
										</Button>
									)
								})}
							</div>
						))}
					</div>
				</div>
			</div>
		)
	}
}
export default SideBar
