import { gql } from 'apollo-boost'

const getPhotoUserQuery = gql`
	query($token: String!, $id: ID!) {
		users(token: $token, id: $id) {
			id
			photo {
				id
				path
			}
		}
	}
`

const userHeaderQuery = gql`
	query($token: String!) {
		user(token: $token) {
			id
			firstname
			lastname
			email
			photo {
				id
				path
			}
			unread_messages {
				id
			}
		}
	}
`

const getUserByEmail = gql`
	query($token: String!, $email: String) {
		users(token: $token, email: $email) {
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
`

const getUserQuery = gql`
	query($token: String!, $id: ID!) {
		users(token: $token, id: $id) {
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
`

const editUserQuery = gql`
	mutation(
		$token: String!
		$id: ID!
		$email: String
		$password: String
		$address: String
		$firstname: String
		$lastname: String
		$phonenumber: String
		$photo_id: ID
	) {
		UserChange(
			token: $token
			id: $id
			email: $email
			password: $password
			address: $address
			firstname: $firstname
			lastname: $lastname
			phonenumber: $phonenumber
			photo_id: $photo_id
		) {
			id
			email
			firstname
			lastname
			address
			phonenumber
			photo {
				id
				path
			}
			company {
				id
				name
			}
		}
	}
`

const changePasswordQuery = gql`
	mutation($token: String!, $id: ID!, $password: String) {
		UserChange(token: $token, id: $id, password: $password) {
			id
		}
	}
`

const changeImageuser = gql`
	mutation($token: String!, $id: ID!, $photo_id: ID) {
		UserChange(token: $token, id: $id, photo_id: $photo_id) {
			id
		}
	}
`

export {
	editUserQuery,
	getPhotoUserQuery,
	getUserQuery,
	changePasswordQuery,
	changeImageuser,
	userHeaderQuery,
	getUserByEmail,
}
