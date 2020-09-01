import React from 'react'
import PropTypes from 'prop-types'
import { CircularProgress } from '@material-ui/core'
import './Loading.style.scss'

export default class Loading extends React.Component {
	state = {
		completed: 0,
	}

	componentDidMount() {
		this.timer = setInterval(this.progress, 20)
	}

	componentWillUnmount() {
		clearInterval(this.timer)
	}

	progress = () => {
		const { completed } = this.state
		this.setState({ completed: completed >= 100 ? 0 : completed + 1 })
	}

	render() {
		return (
			<div className="master-loader">
				<CircularProgress
					variant="determinate"
					size={125}
					style={{ color: '#56c2cc' }}
					thickness={3}
					value={this.state.completed}
				/>

				<div
					className="load-logo"
					style={{ backgroundImage: `url(${require('assets/pb-img/load-logo.png')}` }}
				/>
			</div>
		)
	}
}

Loading.propTypes = {
	open: PropTypes.bool,
	handleClose: PropTypes.func,
}
