import { gql } from 'apollo-boost'

const addTenant = gql`
	mutation($token: String!, $user_id: Int, $tenancy_id: Int, $active: Int) {
		TenantAdd(token: $token, user_id: $user_id, tenancy_id: $tenancy_id, active: $active) {
			id
			active
			move_in_date
			created_at
		}
	}
`

const changeTenant = gql`
	mutation($token: String!, $id: ID, $user_id: Int, $tenancy_id: Int, $active: Int) {
		TenantChange(token: $token, id: $id, user_id: $user_id, tenancy_id: $tenancy_id, active: $active) {
			id
			active
			move_in_date
			created_at
		}
	}
`

const removeTenant = gql`
	mutation($token: String!, $id: ID!) {
		TenantRemove(token: $token, id: $id) {
			id
		}
	}
`

const addTenancy = gql`
	mutation(
		$token: String!
		$floor_id: ID
		$name: String
		$number: String
		$max_tenants: Int
		$intercom: String
		$managed_status_id: Int
	) {
		TenancyAdd(
			token: $token
			floor_id: $floor_id
			name: $name
			number: $number
			max_tenants: $max_tenants
			intercom: $intercom
			managed_status_id: $managed_status_id
		) {
			id
			name
			number
			max_tenants
			intercom
			managed_status {
				id
				name
			}
			floor {
				id
				name
				number
			}
		}
	}
`

const changeTenancy = gql`
	mutation(
		$token: String!
		$id: Int!
		$floor_id: ID
		$photo_id: ID
		$name: String
		$number: String
		$max_tenants: Int
		$intercom: String
		$managed_status_id: Int
	) {
		TenancyChange(
			token: $token
			id: $id
			floor_id: $floor_id
			photo_id: $photo_id
			name: $name
			number: $number
			max_tenants: $max_tenants
			intercom: $intercom
			managed_status_id: $managed_status_id
		) {
			id
			name
			number
			max_tenants
			intercom
			managed_status {
				id
				name
			}
			floor {
				id
				name
				number
			}
			photo {
				id
				path
			}
		}
	}
`

const removeTenancy = gql`
	mutation($token: String!, $id: ID) {
		TenancyRemove(token: $token, id: $id) {
			id
		}
	}
`

const pinTenancy = gql`
	mutation($token: String!, $tenancy_id: ID!) {
		TenancyPin(token: $token, tenancy_id: $tenancy_id) {
			id
			is_pinned
		}
	}
`

const unpinTenancy = gql`
	mutation($token: String!, $tenancy_id: ID!) {
		TenancyUnpin(token: $token, tenancy_id: $tenancy_id) {
			id
			is_pinned
		}
	}
`

const changeTenancyNotes = gql`
	mutation($token: String!, $id: Int!, $notes: String) {
		TenancyChange(token: $token, id: $id, notes: $notes) {
			id
			notes
		}
	}
`

const TenancyManagerAdd = gql`
	mutation($token: String!, $tenancy_id: ID!, $user_id: ID!) {
		TenancyManagerAdd(token: $token, tenancy_id: $tenancy_id, user_id: $user_id) {
			id
			tenancy {
				id
			}
			user {
				id
			}
		}
	}
`

const TenancyManagerRemove = gql`
	mutation($token: String!, $id: ID!) {
		TenancyManagerRemove(token: $token, id: $id) {
			id
		}
	}
`

const TenancyOwnerAdd = gql`
	mutation($token: String!, $tenancy_id: ID!, $user_id: ID!) {
		TenancyOwnerAdd(token: $token, tenancy_id: $tenancy_id, user_id: $user_id) {
			id
			tenancy {
				id
			}
			user {
				id
			}
		}
	}
`

// this mutation doesn't exist lmao
const TenancyOwnerRemove = gql`
	mutation($token: String!, $id: ID!) {
		TenancyOwnerRemove(token: $token, id: $id) {
			id
		}
	}
`

export {
	addTenant,
	changeTenant,
	removeTenant,
	addTenancy,
	changeTenancy,
	removeTenancy,
	pinTenancy,
	unpinTenancy,
	changeTenancyNotes,
	TenancyManagerAdd,
	TenancyManagerRemove,
	TenancyOwnerAdd,
	TenancyOwnerRemove,
}
