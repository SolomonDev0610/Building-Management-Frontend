import { gql } from 'apollo-boost'

const propertiesQueryDetails = gql`
	query($token: String!, $id: ID) {
		tenancies(token: $token, id: $id) {
			id
			name
			notes
			building {
				id
				name
				files {
					id
					filename
					filetype
					path
				}
			}
			tenants {
				id
				active
				move_in_date
				move_out_date
				user {
					id
					firstname
					lastname
					email
					phonenumber
					photo {
						id
						path
					}
				}
			}
			tenancy_managers {
				id
				user {
					id
					firstname
					lastname
					email
					phonenumber
					photo {
						id
						path
					}
				}
			}
			tenancy_owners {
				id
				user {
					id
					firstname
					lastname
					email
					phonenumber
					photo {
						id
						path
					}
				}
			}
			maintenance_requests {
				id
				created_at
				description
				date_resolved
				tenancy {
					id
					name
					building {
						id
						name
					}
				}
				user {
					id
					firstname
					lastname
				}
				photo {
					id
					path
				}
				status {
					id
					name
				}
			}
		}
	}
`

const tenancyTenantList = gql`
	query($token: String!, $id: ID) {
		buildings(token: $token, id: $id) {
			id
			name
			tenancies {
				id
				tenants {
					id
					tenancy {
						id
						name
					}
					user {
						id
						email
						firstname
						lastname
					}
				}
			}
		}
	}
`

const listOfStatus = gql`
	query($token: String!) {
		statuses(token: $token) {
			id
			name
		}
	}
`

const maintenanceRequestQueryList = gql`
	query($token: String!, $id: ID) {
		maintenanceRequests(token: $token, id: $id) {
			id
			created_at
			description
			date_resolved
			tenancy {
				id
				name
				building {
					id
					name
				}
			}
			user {
				id
				firstname
				lastname
			}
			photo {
				id
				path
			}
			status {
				id
				name
			}
		}
	}
`

const tenancyNameQuery = gql`
	query($token: String!, $id: ID) {
		tenancies(token: $token, id: $id) {
			id
			name
			building {
				id
				name
			}
			app {
				id
			}
		}
	}
`

const tenancyEditQuery = gql`
	query($token: String!, $id: ID) {
		tenancies(token: $token, id: $id) {
			id
			name
			number
			max_tenants
			intercom
			photo {
				id
				path
			}
			floor {
				id
			}
			managed_status {
				id
			}
			building {
				id
				name
				floors {
					id
					number
					name
				}
			}
		}
	}
`

export {
	propertiesQueryDetails,
	tenancyTenantList,
	maintenanceRequestQueryList,
	listOfStatus,
	tenancyNameQuery,
	tenancyEditQuery,
}
