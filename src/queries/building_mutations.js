import { gql } from 'apollo-boost'

const addBuilding = gql`
	mutation(
		$token: String!
		$name: String
		$street_address: String
		$suburb: String
		$city: String
		$postcode: String
		$country: String
		$photo_id: Int
		$managed_status_id: Int
	) {
		BuildingAdd(
			token: $token
			name: $name
			street_address: $street_address
			suburb: $suburb
			city: $city
			postcode: $postcode
			country: $country
			photo_id: $photo_id
			managed_status_id: $managed_status_id
		) {
			id
			created_at
			name
		}
	}
`

const addFloor = gql`
	mutation($token: String!, $building_id: Int!, $name: String!, $number: Int!) {
		FloorAdd(token: $token, building_id: $building_id, name: $name, number: $number) {
			id
			created_at
			name
			number
		}
	}
`

const editBuilding = gql`
	mutation(
		$token: String!
		$id: Int!
		$name: String
		$street_address: String
		$suburb: String
		$city: String
		$postcode: String
		$country: String
		$photo_id: Int
	) {
		BuildingChange(
			token: $token
			id: $id
			name: $name
			street_address: $street_address
			suburb: $suburb
			city: $city
			postcode: $postcode
			country: $country
			photo_id: $photo_id
		) {
			id
			created_at
			name
		}
	}
`

const editFloors = gql`
	mutation($token: String!, $id: Int!, $building_id: Int!, $name: String!, $number: Int!) {
		FloorChange(token: $token, id: $id, building_id: $building_id, name: $name, number: $number) {
			id
			created_at
			name
			number
		}
	}
`

const changeMaintenanceRequest = gql`
	mutation($token: String!, $id: ID!, $status_id: ID) {
		MaintenanceRequestChange(token: $token, id: $id, status_id: $status_id) {
			id
			status {
				id
				name
			}
		}
	}
`

const BuildingManagerAdd = gql`
	mutation($token: String!, $building_id: ID!, $user_id: ID!) {
		BuildingManagerAdd(token: $token, building_id: $building_id, user_id: $user_id) {
			id
			building {
				id
			}
			user {
				id
			}
		}
	}
`

const BuildingManagerRemove = gql`
	mutation($token: String!, $id: ID!) {
		BuildingManagerRemove(token: $token, id: $id) {
			id
		}
	}
`

const BuildingOwnerAdd = gql`
	mutation($token: String!, $building_id: ID!, $user_id: ID!) {
		BuildingOwnerAdd(token: $token, building_id: $building_id, user_id: $user_id) {
			id
			building {
				id
			}
			user {
				id
			}
		}
	}
`

// this mutation doesn't exist lmao
const BuildingOwnerRemove = gql`
	mutation($token: String!, $id: ID!) {
		BuildingOwnerRemove(token: $token, id: $id) {
			id
		}
	}
`

export {
	addBuilding,
	addFloor,
	editBuilding,
	editFloors,
	changeMaintenanceRequest,
	BuildingManagerAdd,
	BuildingManagerRemove,
	BuildingOwnerAdd,
	BuildingOwnerRemove,
}
