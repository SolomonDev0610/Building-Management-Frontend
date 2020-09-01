import React from 'react'
import './Notes.widget.style.scss'
import {
	IconButton,
	Button,
	TextField,
	Dialog,
	DialogActions,
	DialogContent,
	DialogContentText,
	DialogTitle,
	Menu,
	MenuItem,
} from '@material-ui/core'
import { MoreVert } from '@material-ui/icons'
import PropTypes from 'prop-types'

export default class NotesWidget extends React.Component {
	state = {
		open: {
			add: false,
			edit: false,
			delete: false,
		},
		anchorNotesOptions: null,
	}

	// on click open dialog
	handleAddClickOpen = () => {
		this.setState({
			open: {
				add: true,
			},
		})
	}

	handleEditClickOpen = () => {
		this.setState({
			open: {
				edit: true,
			},
		})
	}

	handleDeleteClickOpen = () => {
		this.setState({
			open: {
				delete: true,
			},
		})
	}

	// cancel add note
	handleClose = () => {
		this.setState({
			open: {
				add: false,
				edit: false,
				delete: false,
			},
		})
	}

	// submit functionality
	handleAdd = () => {
		// add post function here
		this.setState({
			open: {
				add: false,
			},
		})
	}

	handleEdit = () => {
		// add post function here
		this.setState({
			open: {
				edit: false,
			},
		})
	}

	handleDelete = () => {
		// add post function here
		this.setState({
			open: {
				delete: false,
			},
		})
	}

	handleOpenMenuNotes = event => {
		this.setState({ anchorNotesOptions: event.currentTarget })
	}
	handleCloseMoreMenuNotes = () => {
		this.setState({ anchorNotesOptions: null })
	}
	__handleChangeNotes = evt => {
		this.props.onChangeNotes(evt.target.value)
	}

	render() {
		let { noteData, className, title, sendNotesForm } = this.props
		let { anchorNotesOptions } = this.state
		const openProfile = Boolean(anchorNotesOptions)

		return (
			<div className={`pb-notes-widget pl-15 pr-15 pt-10 ${className}`}>
				<div className="notes-container d-flex flex-column ">
					<div className="notes-header d-flex flex-row justify-content-between">
						{sendNotesForm !== true ? (
							<React.Fragment>
								<h3>{title || 'NOTES'}</h3>
								<Button
									variant="contained"
									style={{ height: '36px' }}
									className="button-color"
									onClick={this.handleAddClickOpen}
								>
									ADD NOTE
								</Button>
							</React.Fragment>
						) : null}

						<Dialog
							open={this.state.open.edit}
							onClose={this.handleClose}
							aria-labelledby="form-dialog-title"
						>
							<DialogTitle id="form-dialog-title">Notes</DialogTitle>
							<DialogContent>
								<DialogContentText>Edit feedback note to the tenant.</DialogContentText>
								<TextField autoFocus margin="normal" id="note" label="Note" fullWidth />
							</DialogContent>
							<DialogActions>
								<Button onClick={this.handleClose} color="primary">
									Cancel
								</Button>
								<Button onClick={this.handleEdit} color="primary">
									Edit note
								</Button>
							</DialogActions>
						</Dialog>

						<Dialog
							open={this.state.open.add}
							onClose={this.handleClose}
							aria-labelledby="form-dialog-title"
						>
							<DialogTitle id="form-dialog-title">Notes</DialogTitle>
							<DialogContent>
								<DialogContentText>Add feedback note to the tenant.</DialogContentText>
								<TextField autoFocus margin="normal" id="note" label="Note" fullWidth />
							</DialogContent>
							<DialogActions>
								<Button onClick={this.handleClose} color="primary">
									Cancel
								</Button>
								<Button onClick={this.handleAdd} color="primary">
									Add note
								</Button>
							</DialogActions>
						</Dialog>

						<Dialog
							open={this.state.open.delete}
							onClose={this.handleClose}
							aria-labelledby="form-dialog-title"
						>
							<DialogTitle id="form-dialog-title">Notes</DialogTitle>
							<DialogContent>
								<DialogContentText>Are you sure to delete this Note?</DialogContentText>
							</DialogContent>
							<DialogActions>
								<Button onClick={this.handleClose} color="primary">
									Cancel
								</Button>
								<Button onClick={this.handleDelete} color="primary">
									Delete
								</Button>
							</DialogActions>
						</Dialog>
					</div>
					<div className="notes-body mt-0 ">
						{sendNotesForm === true ? (
							<React.Fragment>
								<TextField
									margin="normal"
									label="Type your Notes Here"
									rows="15"
									multiline
									fullWidth
									value={this.props.note}
									onChange={this.__handleChangeNotes}
									style={{ height: '300px' }}
									disabled={this.props.disabled}
								/>
								{!this.props.disabled && (
									<div style={{ float: 'right' }}>
										<Button
											color="secondary"
											variant="contained"
											style={{ marginBottom: '15px', marginRight: '10px' }}
										>
											CANCEL
										</Button>
										<Button
											color="primary"
											variant="contained"
											style={{ marginBottom: '15px' }}
											onClick={this.props.onSubmitNotes}
										>
											SAVE
										</Button>
									</div>
								)}
							</React.Fragment>
						) : noteData ? (
							noteData.map((r, i) => (
								<div
									key={`note-row-${i}`}
									className="note-row row m-0 p-10 d-flex w-100 pb-button-wrapper"
								>
									<div className="img-box-wrapper m-0 col-1 d-flex p-0 justify-content-center">
										<div className="prof-img" style={{ backgroundImage: `url('${r.image}')` }} />
									</div>
									<div className="note-box d-flex flex-column col-10 justify-content-center">
										<p className="fs-18">{r.note}</p>
										<span className="fs-12 text-muted">
											Added on {r.addedDate} &nbsp;&nbsp;&nbsp; by {r.note_created_by}
										</span>
									</div>
									<div className="col-1  d-flex flex-column justify-content-center">
										<IconButton mini="true" color="secondary" onClick={this.handleOpenMenuNotes}>
											<MoreVert />
										</IconButton>
										<Menu
											id="notes_menu_anchor"
											anchorEl={anchorNotesOptions}
											anchorOrigin={{
												vertical: 'top',
												horizontal: 'right',
											}}
											transformOrigin={{
												vertical: 'top',
												horizontal: 'right',
											}}
											open={openProfile}
											onClose={this.handleCloseMoreMenuNotes}
										>
											<MenuItem onClick={this.handleEditClickOpen}>Edit Notes</MenuItem>
											<MenuItem onClick={this.handleDeleteClickOpen}>Delete Notes</MenuItem>
										</Menu>
									</div>
								</div>
							))
						) : (
							<div className="h-100 d-flex justify-content-center align-items-center">
								<h4 className="text-muted">NO DATA</h4>
							</div>
						)}
					</div>
				</div>
			</div>
		)
	}
}

NotesWidget.propTypes = {
	className: PropTypes.string,
	noteData: PropTypes.array,
	title: PropTypes.string,
}
