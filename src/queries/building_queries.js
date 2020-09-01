import { gql } from 'apollo-boost'

const buildingQueryList = gql`
	query($token: String!) {
		user(token: $token) {
			id
			email
			address
			related_buildings {
				id
				name
				street_address
				postcode
				photo {
					id
					path
				}
				tenancies {
					id
					number
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
		}
	}
`
const buildingViewQuery = gql`
	query($token: String!, $id: ID) {
		buildings(token: $token, id: $id) {
			id
			name
			street_address
			suburb
			city
			postcode
			country
			photo {
				id
				path
			}
			tenancies {
				id
				name
				max_tenants
				is_pinned
				photo {
					id
					path
				}
				tenants {
					id
					user {
						id
						email
					}
				}
			}
			floors {
				id
				name
				number
			}
			building_managers {
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
			building_owners {
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
		}
	}
`

const ownerQueryList = gql`
	query($token: String!, $id: ID) {
		buildings(token: $token, id: $id) {
			id
			name
			building_owners {
				id
				user {
					id
					firstname
					lastname
					email
				}
				building {
					id
					tenancies {
						id
						name
					}
				}
			}
		}
	}
`
const tenantQueryList = gql`
	query($token: String!, $id: ID) {
		buildings(token: $token, id: $id) {
			id
			name
			tenancies {
				id
				name
				tenants {
					id
					deleted_at
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

const getBuildingFiles = gql`
	query($token: String!, $id: ID) {
		buildings(token: $token, id: $id) {
			id
			name
			files {
				id
				path
				filename
				filetype
				created_at
			}
		}
	}
`

const getBuildingFileView = gql`
	query($token: String!, $id: ID) {
		files(token: $token, id: $id) {
			id
			path
			filename
			filetype
			building {
				id
				building_owners {
					id
					user {
						id
						firstname
						lastname
					}
				}
				building_managers {
					id
					user {
						id
						firstname
						lastname
					}
				}
			}
		}
	}
`

const buildingNameQuery = gql`
	query($token: String!, $id: ID) {
		buildings(token: $token, id: $id) {
			id
			name
		}
	}
`

export {
	buildingQueryList,
	buildingViewQuery,
	ownerQueryList,
	tenantQueryList,
	getBuildingFiles,
	getBuildingFileView,
	buildingNameQuery
}
