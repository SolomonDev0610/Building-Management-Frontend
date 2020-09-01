import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'
import useFormable from '@nicksheffield/formable'
import { TextField, Button, Dialog, DialogTitle, DialogContent, DialogActions } from '@material-ui/core'
import Page from 'components/Page'
import ImageUploader from 'components/ImageUploader'
import ContentHeader from 'components/ContentHeader/ContentHeader.component'
import FormComponent from 'components/FormComponent/Form.component'
import { tenancyNameQuery } from 'queries/tenancies_queries'
import { TenancyOwnerAdd } from 'queries/tenancies_mutations'
import { registerUserQuery } from 'queries/auth_queries'
import { editUserQuery, getUserByEmail } from 'queries/user_queries'
import query from 'util/query'
import apollo from 'util/apollo'
import useDebounce from 'util/useDebounce'
import PersonCard from 'components/PersonCard/PersonCard.component'

const PropertyOwnerNew = ({ query, history }) => {
	const [get, set, formData] = useFormable({
		firstname: '',
		lastname: '',
		email: '',
		phonenumber: '',
		address: '',
		photo: null,
	})

	const [foundUser, setFoundUser] = useState(null)

	const userEmail = useDebounce(formData.email, 500)

	useEffect(() => {
		if (userEmail) {
			apollo
				.query({
					query: getUserByEmail,
					variables: {
						token: localStorage.getItem('pb_user_token'),
						email: userEmail,
					},
				})
				.then(res => {
					if (res.data.users && res.data.users.length) {
						setFoundUser(res.data.users[0])
					}
				})
		}
	}, [userEmail])

	if (!query.data.tenancies || !query.data.tenancies.length) return <Page />

	const tenancy = query.data.tenancies[0]
	const building = tenancy.building

	const submit = async e => {
		e.preventDefault()

		const { photo, ...form } = formData

		try {
			const userAdd = await apollo.mutate({
				mutation: registerUserQuery,
				variables: {
					token: localStorage.getItem('pb_user_token'),
					...form,
				},
			})
			const user = userAdd.data.UserAdd

			const data = new FormData()
			data.append('token', localStorage.getItem('pb_user_token'))
			data.append('user_id', user.id)
			data.append('file', photo, photo.name)

			const photoResponse = await axios.post('/photo/avatar', data)

			await apollo.mutate({
				mutation: editUserQuery,
				variables: {
					token: localStorage.getItem('pb_user_token'),
					id: user.id,
					photo_id: photoResponse.data.id,
				},
			})

			await apollo.mutate({
				mutation: TenancyOwnerAdd,
				variables: {
					token: localStorage.getItem('pb_user_token'),
					tenancy_id: tenancy.id,
					user_id: user.id,
				},
			})

			history.push(`/building/${building.id}/tenancy/${tenancy.id}`)
		} catch (e) {
			console.log('err', e)
			alert('Something went wrong.')
			throw e
		}
	}

	const clearFoundUser = () => {
		setFoundUser(null)
		set('email', '')
	}

	const assignFoundUser = async () => {
		try {
			await apollo.mutate({
				mutation: TenancyOwnerAdd,
				variables: {
					token: localStorage.getItem('pb_user_token'),
					tenancy_id: tenancy.id,
					user_id: foundUser.id,
				},
			})

			history.push(`/building/${building.id}/tenancy/${tenancy.id}`)
		} catch (e) {
			console.log('err', e)
			alert('Something went wrong.')
			throw e
		}
	}

	return (
		<Page>
			{foundUser && (
				<Dialog open={foundUser !== null} onClose={clearFoundUser} size="md" fullWidth>
					<DialogTitle>A user with that email address already exists</DialogTitle>
					<DialogContent>
						<PersonCard
							image={foundUser.photo ? foundUser.photo.path : ''}
							firstname={foundUser.firstname}
							lastname={foundUser.lastname}
							phone={foundUser.phonenumber}
							email={foundUser.email}
							style={{ background: 'whitesmoke' }}
						/>
					</DialogContent>
					<DialogActions>
						<Button
							variant="contained"
							size="large"
							style={{
								marginRight: '10px',
								backgroundColor: '#757575',
								color: 'white',
							}}
							onClick={clearFoundUser}
						>
							Cancel
						</Button>

						<Button variant="contained" color="primary" size="large" onClick={assignFoundUser}>
							Assign them
						</Button>
					</DialogActions>
				</Dialog>
			)}
			<div className="page-content property-view-content">
				<ContentHeader
					visibleBack={true}
					title={tenancy.name}
					breadcrumb={[
						{
							name: 'Dashboard',
							link: '/dashboard',
						},
						{
							name: building.name,
							link: `/building/${building.id}`,
						},
						{
							name: tenancy.name,
							link: `/building/${building.id}/tenancy/${tenancy.id}`,
						},
						{
							name: 'New Owner',
						},
					]}
				/>

				<div className="body">
					<FormComponent>
						<form onSubmit={submit}>
							<div className="pb-form-title">
								<span>ENTER NEW OWNER DETAILS</span>
							</div>

							<div className="pb-form-description">
								<span>All fields marked with an asterisk (*) are compulsory.</span>
							</div>

							<div className="pb-form-body row">
								<div className="pb-section col-lg-6 col-md-12 col-sm-12">
									<div className="pb-section-title">
										<span>Information</span>
									</div>

									<div className="pb-section-body">
										<div className="main-contact-name">
											<TextField
												required
												margin="dense"
												name="firstname"
												onChange={e => set('firstname', e.target.value)}
												value={get('firstname')}
												label="First Name"
												fullWidth
											/>
										</div>

										<div className="main-contact-name">
											<TextField
												required
												margin="dense"
												name="lastname"
												onChange={e => set('lastname', e.target.value)}
												value={get('lastname')}
												label="Last Name"
												fullWidth
											/>
										</div>

										<div className="pb-label">
											<span>Identification Photo</span>
										</div>

										<div className="pb-form-button">
											<ImageUploader
												onChange={value => set('photo', value)}
												value={get('photo')}
											/>
										</div>
									</div>
								</div>

								<div className="pb-section col-lg-6 col-md-12 col-sm-12">
									<div className="pb-section-title">
										<span>Address &amp; Contact Information</span>
									</div>

									<div className="pb-section-body">
										<div>
											<TextField
												margin="dense"
												name="address"
												onChange={e => set('address', e.target.value)}
												value={get('address')}
												label="Present Address"
												fullWidth
											/>
										</div>

										<div className="main-contact-name">
											<TextField
												required
												margin="dense"
												name="email"
												onChange={e => set('email', e.target.value)}
												value={get('email')}
												label="Email Address"
												type="email"
												fullWidth
											/>
										</div>

										<div className="main-contact-name">
											<TextField
												required
												margin="dense"
												name="phonenumber"
												onChange={e => set('phonenumber', e.target.value)}
												value={get('phonenumber')}
												label="Mobile Number"
												fullWidth
											/>
										</div>
									</div>
								</div>

								<div className="pb-form-button tenant col-12 justify-content-end">
									<Button
										variant="contained"
										size="large"
										style={{
											marginRight: '10px',
											backgroundColor: '#757575',
											color: 'white',
										}}
										component={Link}
										to={`/building/${building.id}/tenancy/${tenancy.id}`}
									>
										Cancel
									</Button>

									<Button variant="contained" color="primary" size="large" type="submit">
										Save
									</Button>
								</div>
							</div>
						</form>
					</FormComponent>
				</div>
			</div>
		</Page>
	)
}

export default query(({ match }) => ({
	query: tenancyNameQuery,
	variables: {
		token: localStorage.getItem('pb_user_token'),
		id: match.params.tenancy_id,
	},
	fetchPolicy: 'cache-and-network',
}))(PropertyOwnerNew)
