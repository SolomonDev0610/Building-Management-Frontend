import React, { useMemo } from 'react'
import {
	Dialog,
	DialogTitle,
	DialogContent,
	DialogContentText,
	DialogActions,
	FormGroup,
	FormControl,
	FormControlLabel,
	TextField,
	Select,
	Checkbox,
	MenuItem,
	ListItemText,
	Grid,
	Button,
} from '@material-ui/core'
import useFormable from '@nicksheffield/formable'

const MenuProps = {
	PaperProps: {
		style: {
			maxHeight: 48 * 5 + 1,
			width: 250,
		},
	},
}

const getAllTenancies = (floors) => floors.reduce((acc, floor) => acc.concat(floor.tenancies), [])

const flatmap = (arrs) => arrs.reduce((acc, arr) => [...acc, ...arr], [])

const MessageGroupDialog = ({ open = false, floors = [], onClose = () => {}, onSubmit = () => {}, value = null }) => {
	const [get, set, formData] = useFormable(
		value || {
			name: '',
			floors: [],
			tenancies: [],
			tenants: false,
			owners: false,
			managers: false,
		}
	)

	const tenancies = useMemo(() => {
		return getAllTenancies(floors)
	}, [floors])

	const submit = (event) => onSubmit(formData, event)

	// this is an array containing manually selected tenancies and also any tenancy that belongs to a selected floor.
	const mergedSelectedTenancies = useMemo(() => {
		return flatmap([formData.tenancies, getAllTenancies(formData.floors)])
	}, [formData.tenancies, formData.floors])

	return (
		<Dialog open={open} onClose={onClose} aria-labelledby="form-dialog-title" maxWidth="md" fullWidth>
			<DialogTitle id="form-dialog-title">{value ? 'Edit Group' : 'Create a new Group'}</DialogTitle>
			<DialogContent>
				<DialogContentText />
				<TextField
					margin="dense"
					type="text"
					placeholder="Group Name (be descriptive)"
					name="group-name"
					value={get('name')}
					onChange={(e) => set('name', e.target.value)}
					fullWidth
					autoFocus
				/>

				<Grid container spacing={16}>
					<Grid item xs={6}>
						<FormControl fullWidth margin="normal">
							<Select
								value={get('floors')}
								onChange={(event) => set('floors', event.target.value)}
								renderValue={(selected) => {
									return selected.length === 0
										? 'Please select some floors'
										: selected.length < floors.length
										? 'Selected Floors'
										: 'All Floors'
								}}
								MenuProps={MenuProps}
								multiple
								displayEmpty
							>
								{floors
									.sort((x, y) => x.number - y.number)
									.map((floor) => (
										<MenuItem key={floor.id} value={floor}>
											<Checkbox
												checked={get('floors').find((x) => x.id === floor.id) !== undefined}
											/>
											<ListItemText primary={floor.name} />
										</MenuItem>
									))}
							</Select>
						</FormControl>
					</Grid>
					<Grid item xs={6}>
						<FormControl fullWidth margin="normal">
							<Select
								multiple
								value={get('tenancies')}
								onChange={(event) => set('tenancies', event.target.value)}
								renderValue={(_) => {
									return mergedSelectedTenancies.length === 0
										? 'Please select some tenancies'
										: mergedSelectedTenancies.length < tenancies.length
										? 'Selected Tenancies'
										: 'All Tenancies'
								}}
								displayEmpty
								MenuProps={MenuProps}
							>
								{tenancies.map((tenancy) => (
									<MenuItem key={tenancy.id} value={tenancy}>
										<Checkbox
											checked={
												mergedSelectedTenancies.find((x) => x.id === tenancy.id) !== undefined
											}
											disabled={
												!get('tenancies').find((x) => x.id === tenancy.id) &&
												mergedSelectedTenancies.find((x) => x.id === tenancy.id) !== undefined
											}
										/>
										<ListItemText primary={tenancy.name} />
									</MenuItem>
								))}
							</Select>
						</FormControl>
					</Grid>
				</Grid>

				<div className="list-content-participants">
					<FormControl component="fieldset">
						<FormGroup>
							<FormControlLabel
								control={
									<Checkbox
										checked={get('tenants')}
										onChange={(_) => set('tenants', !get('tenants'))}
										value="tenant"
									/>
								}
								label="Tenants"
							/>
							<FormControlLabel
								control={
									<Checkbox
										checked={get('owners')}
										onChange={(_) => set('owners', !get('owners'))}
										value="owner"
									/>
								}
								label="Owners"
							/>
							<FormControlLabel
								control={
									<Checkbox
										checked={get('managers')}
										onChange={(_) => set('managers', !get('managers'))}
										value="property_manager"
									/>
								}
								label="Property Managers"
							/>
						</FormGroup>
					</FormControl>
				</div>
			</DialogContent>
			<DialogActions>
				<Button onClick={onClose} color="secondary" variant="contained">
					Cancel
				</Button>
				<Button onClick={submit} color="primary" variant="contained">
					{value ? 'Save' : 'Create Group'}
				</Button>
			</DialogActions>
		</Dialog>
	)
}

export default MessageGroupDialog
