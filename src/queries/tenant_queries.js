import { gql } from 'apollo-boost'

const getTenantQuery = gql`
	query($token: String!, $id: ID!) {
		tenants(token: $token, id: $id) {
			id
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
				address
				email
				phonenumber
				company {
					id
					name
				}
				photo {
					id
					path
				}
			}
		}
	}
`

export { getTenantQuery }
