import { gql } from 'apollo-boost'

const addTenants = gql`
	mutation(
		$token: String!
		$email: String!
		$firstname: String!
		$lastname: String!
		$phonenumber: String!
		$tenancy_id: ID!
		$photo_id: ID
		$move_in_date: String
		$move_out_date: String
		$active: Boolean
	) {
		TenantUserAdd(
			token: $token
			email: $email
			firstname: $firstname
			lastname: $lastname
			phonenumber: $phonenumber
			tenancy_id: $tenancy_id
			photo_id: $photo_id
			move_in_date: $move_in_date
			move_out_date: $move_out_date
			active: $active
		) {
			id
		}
	}
`

const TenantChange = gql`
	mutation(
		$token: String!
		$id: ID!
		$user_id: ID
		$tenancy_id: ID
		$active: Boolean
		$move_out_date: String
		$move_in_date: String
	) {
		TenantChange(
			token: $token
			id: $id
			user_id: $user_id
			tenancy_id: $tenancy_id
			active: $active
			move_out_date: $move_out_date
			move_in_date: $move_in_date
		) {
			id
			active
			move_in_date
			move_out_date
			user {
				id
			}
			tenancy {
				id
			}
		}
	}
`

export { addTenants, TenantChange }
