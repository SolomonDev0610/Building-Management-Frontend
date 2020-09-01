import React, { Component } from 'react'
import { AppBar, Dialog, DialogContent, IconButton, Toolbar, Typography } from '@material-ui/core'
import { ArrowBack } from '@material-ui/icons'

class TermsConditions extends Component {
	render() {
		const { dialogOnShow, dialogOnClose, dialogOnTransition } = this.props

		return (
			<Dialog fullScreen open={dialogOnShow} onClose={dialogOnClose} TransitionComponent={dialogOnTransition}>
				<AppBar>
					<Toolbar>
						<IconButton color="inherit" onClick={dialogOnClose}>
							<ArrowBack />
						</IconButton>
						<Typography variant="h6" color="inherit">
							{'Terms and Conditions'}
						</Typography>
					</Toolbar>
				</AppBar>

				<DialogContent>
					<div className="pt-70 pp-container">
						<div className="p-30 pp-wrapper">
							<iframe
								style={{
									position: 'fixed',
									top: 0,
									left: 0,
									bottom: 0,
									right: 0,
									width: '100%',
									height: '100%',
									overflow: 'hidden',
								}}
								src="https://docs.google.com/gview?embedded=true&url=https://www.properteebutler.co.nz/resources/documents/TermsAndConditions.pdf"
								title="Terms and conditions.pdf"
							/>
						</div>
					</div>
				</DialogContent>
			</Dialog>
		)
	}
}

export default TermsConditions
