import React from 'react'
import _ from 'lodash'
import PropTypes from 'prop-types'
import { Button } from '@material-ui/core'
import './DashCard.component.scss'
import OutlineIcon from 'assets/img/outline-pin.png'
import BaseIcon from 'assets/img/pin.png'

export default class DashCard extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			id: props.id,
			width: props.width || '25',
			className: props.className || '',
			image: props.image || '',
			title: props.title || '',
			description: props.description || '',
			statDetail: props.statDetail || '',
			statNum: props.statNum || '',
			handleClick: props.handleClick || '',
			status: props.status || '',
			color: props.color || 'white',
			is_pinned: props.is_pinned,

			//Added Values
			badge: props.badge
				? {
						value: props.badge.value || -1,
						onClick: props.badge.onClick || _.noop(),
				  }
				: {
						value: -1,
						onClick: _.noop(),
				  },

			rating: props.rating
				? props.rating
				: {
						value: -1,
						enableEdit: false,
						changeRate: _.noop(),
				  },
			tag: props.tag || '',
			occupied: props.occupied || '',
		}
	}

	render() {
		let {
			className,
			image,
			title,
			description,
			statDetail,
			statNum,
			handleClick,
			status,
			is_pinned,
			color,
			id,
		} = this.state

		let { isbuildingView } = this.props
		return (
			<div className={`dash-card-container d-flex ${className}`}>
				<div className="dash-card">
					{isbuildingView === true ? (
						<div className="dash-badge">
							{is_pinned === true ? (
								<img src={BaseIcon} alt="base_icon" onClick={this.__switchPinnedTenancies} id={id} />
							) : (
								<img
									src={OutlineIcon}
									alt="outline_icon"
									onClick={this.__switchPinnedTenancies}
									id={id}
								/>
							)}
						</div>
					) : null}
					<div className="dash-status">{status}</div>

					<div className={`dash-card-content d-flex ${color}`}>
						<div className="dash-card-img-wrapper">
							<Button className="d-flex pb-button" children={<span />} onClick={handleClick} />
							<div className="dash-img-overlay w-100" />
							<div
								className="dash-card-img"
								style={{
									backgroundImage: `url(${image})`,
								}}
							/>
						</div>

						<div className="d-flex flex-column align-items-center">
							<div className="dash-card-details">
								<h4 data-tip={title.length < 20 ? '' : title}>{`${(title || 'Title').substr(0, 20)}${
									(title || 'Title').length > 20 ? '...' : ''
								}`}</h4>
								{description ? (
									<h5 data-tip={description.length < 20 ? '' : title}>{`${(description || '').substr(
										0,
										20
									)}${(description || '').length > 20 ? '...' : ''}`}</h5>
								) : null}

								<span>
									{statNum || '0'} {statDetail}
								</span>
							</div>
						</div>
					</div>
				</div>
			</div>
		)
	}
}

DashCard.propTypes = {
	className: PropTypes.string,
	handleClick: PropTypes.func,
}
