import React, { Component } from 'react'
import { CircularProgress, Button, Menu, MenuItem } from '@material-ui/core'
import 'containers/MainApp/MainApp.style.scss'
import { Dashboard, Message } from '@material-ui/icons'
import { withRouter, Link } from 'react-router-dom'

import { userHeaderQuery } from 'queries/user_queries'
import config from 'config'
import { getDecodedToken } from 'util/helpers'
import query from 'util/query'
import defaultUserPhoto from 'assets/img/default-user.png'

@withRouter
@query(() => {
	const { user } = getDecodedToken()

	return {
		query: userHeaderQuery,
		variables: {
			token: localStorage.getItem('pb_user_token'),
			id: user.id,
		},
		fetchPolicy: 'cache-and-network',
	}
})
class Header extends Component {
	state = {
		anchorProfile: null,
	}

	resolveURL = path => {
		if (path.includes('https://') || path.includes('http://')) {
			return path
		} else {
			return config.URL + path
		}
	}

	_handleProfileMenu = event => {
		this.setState({ anchorProfile: event.currentTarget })
	}

	_handleCloseProfileMenu = event => {
		this.setState({ anchorProfile: null })
	}

	_linkToEditProfile = () => {
		this.setState({ anchorProfile: null })
		this.props.history.push('/profile/edit')
	}

	_logout = () => {
		this.setState({ anchorProfile: null })
		localStorage.removeItem('pb_user_token')
		this.props.history.push('/')
	}

	render() {
		const { anchorProfile } = this.state

		if (this.props.query.error) {
			console.log(this.props.query.error)
		}

		return (
			<div className="master-content-head">
				<div
					style={{
						backgroundImage: `url(${require('assets/pb-img/pb-logo.png')})`,
						width: '275px',
						height: '55px',
						margin: '15px 0',
						flex: '0 0 auto',
						backgroundSize: 'contain',
						backgroundPosition: 'center',
						backgroundRepeat: 'no-repeat',
					}}
				/>
				<div className="filler" />
				<div className="master-global-search-wrapper">
					<Button color="inherit" className="navbar-buttons-header" to="/dashboard" component={Link}>
						<Dashboard />
						<span className="navbar-buttons-header-label">Buildings</span>
					</Button>
					<Button color="inherit" className="navbar-buttons-header" to="/messages" component={Link}>
						<Message />
						<span className="navbar-buttons-header-label">
							My Inbox (
							<span>
								{this.props.query.data.user ? this.props.query.data.user.unread_messages.length : 0}{' '}
								unread
							</span>
							)
						</span>
					</Button>
				</div>
				<div className="master-header-toolbar">
					<div className="d-flex justify-content-around align-items-center p-0">
						<div className="logout">
							{this.props.query.loading ? (
								<CircularProgress thickness={5} color="secondary" />
							) : (
								<button
									onClick={this._handleProfileMenu}
									className="profile-circle"
									style={{
										backgroundImage: `url(${
											this.props.query.data.user.photo
												? this.resolveURL(this.props.query.data.user.photo.path)
												: defaultUserPhoto
										})`,
									}}
								/>
							)}

							<Menu
								id="profile_appbar"
								anchorEl={anchorProfile}
								anchorOrigin={{
									vertical: 'top',
									horizontal: 'right',
								}}
								transformOrigin={{
									vertical: 'top',
									horizontal: 'right',
								}}
								open={!!anchorProfile}
								onClose={this._handleCloseProfileMenu}
							>
								<MenuItem component={Link} to="/profile/edit">
									Manage My Profile
								</MenuItem>
								<MenuItem onClick={this._logout}>Logout</MenuItem>
							</Menu>
						</div>
					</div>
				</div>
			</div>
		)
	}
}

export default Header
