import React, { Component } from 'react'

import { Dialog, DialogContent, Typography, Button } from '@material-ui/core'

import { CheckCircle, Error } from '@material-ui/icons'

import './DialogEvent.style.scss'

export default class DialogEvent extends Component {
	__getEventDialogType = () => {
		let { eventTypeDialog } = this.props

		if (eventTypeDialog === 'Success') {
			return <CheckCircle />
		} else {
			return <Error />
		}
	}

	render() {
		let { openEventDialog, closeEventDialog, contentDialog } = this.props

		return (
			<Dialog open={openEventDialog} onClose={closeEventDialog} aria-labelledby="event_dialog">
				<DialogContent>
					<div className="logo-dialog">{this.__getEventDialogType()}</div>
					<Typography variant="h1" style={{ color: 'black' }}>
						{contentDialog}
					</Typography>

					<div className="button-dialog-close">
						<Button color="primary" variant="contained" onClick={closeEventDialog}>
							CLOSE
						</Button>
					</div>
				</DialogContent>
			</Dialog>
		)
	}
}
