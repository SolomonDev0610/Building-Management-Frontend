import gql from 'graphql-tag'

const MessageGroupAdd = gql`
	mutation(
		$token: String!
		$name: String!
		$building_id: ID!
		$tenants: Boolean!
		$owners: Boolean!
		$managers: Boolean!
		$tenancy_ids: [ID]!
		$floor_ids: [ID]!
	) {
		MessageGroupAdd(
			token: $token
			name: $name
			building_id: $building_id
			tenants: $tenants
			owners: $owners
			managers: $managers
			tenancy_ids: $tenancy_ids
			floor_ids: $floor_ids
		) {
			id
			name
			tenants
			owners
			managers
			building {
				id
			}
			tenancies {
				id
			}
			floors {
				id
			}
		}
	}
`

const MessageGroupChange = gql`
	mutation(
		$token: String!
		$id: ID!
		$name: String
		$building_id: ID
		$tenants: Boolean
		$owners: Boolean
		$managers: Boolean
		$tenancy_ids: [ID]
		$floor_ids: [ID]
	) {
		MessageGroupChange(
			token: $token
			id: $id
			name: $name
			building_id: $building_id
			tenants: $tenants
			owners: $owners
			managers: $managers
			tenancy_ids: $tenancy_ids
			floor_ids: $floor_ids
		) {
			id
			name
			tenants
			owners
			managers
			building {
				id
			}
			tenancies {
				id
			}
			floors {
				id
			}
		}
	}
`

export { MessageGroupAdd, MessageGroupChange }
