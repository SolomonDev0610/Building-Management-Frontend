import React, { Component } from 'react'
import Header from 'components/Header'
import Sidebar from 'components/Sidebar/Sidebar'
import { withRouter } from 'react-router-dom'
import { CircularProgress } from '@material-ui/core'
import withRole from 'util/withRole'

@withRouter
@withRole
class Page extends Component {
	render() {
		let showSidebar =
			this.props.match.params.building_id &&
			(this.props.role.isBuildingManager(this.props.match.params.building_id) ||
				this.props.role.isBuildingOwner(this.props.match.params.building_id))

		return (
			<div className="master-wrapper">
				<Header />
				<div className="master-content">
					{showSidebar && <Sidebar building_id={this.props.match.params.building_id} />}
					<div className="master-content-body">
						{this.props.children || (
							<div
								style={{
									display: 'flex',
									alignItems: 'center',
									justifyContent: 'center',
									width: '100%',
								}}
							>
								<CircularProgress thickness={5} size={80} color="primary" />
							</div>
						)}
					</div>
				</div>
			</div>
		)
	}
}

export default Page
