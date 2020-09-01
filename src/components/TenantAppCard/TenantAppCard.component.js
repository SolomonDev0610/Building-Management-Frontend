import React from 'react'
import PropTypes from 'prop-types'
import { Paper, Switch } from '@material-ui/core'
import './TenantAppCard.style.scss'

export default class TenantAppCard extends React.Component {
	state = {
		switchable: this.props.switchable || false,
		active: this.props.active || false,
	}

	/*
	 * Switch handler for mobile view
	 */
	_handleTenantAppSwitch = () => {
		this.setState({
			active: !this.state.active,
		})
	}

	render() {
		return (
			<div
				className="tenant-app-card col-4 col-md-4 col-lg-4 tenant-app-card-container mb-5"
				tile_id={this.props.tile_id}
				tile_index={this.props.tile_index}
			>
				<Paper className="tenant-app-card-wrapper" onClick={this.props.onClick}>
					<div className="tenant-app-card-content d-flex">
						<div className="app-card-img-wrapper">
							<div className="app-card-img" style={{ backgroundImage: `url(${this.props.appImg})` }}>
								{this.props.children}
							</div>
						</div>
						<span className="align-items-center tenant-app-card-name">{this.props.appName}</span>
					</div>
					{this.props.switchable && (
						<div>
							<Switch onChange={this._handleTenantAppSwitch} checked={this.state.active} />
						</div>
					)}
				</Paper>
			</div>
		)
	}
}

TenantAppCard.propTypes = {
	appImg: PropTypes.string.isRequired,
	appName: PropTypes.string.isRequired,
	switchable: PropTypes.bool,
	active: PropTypes.bool,
	_handleTenantAppSwitch: PropTypes.func,
}
