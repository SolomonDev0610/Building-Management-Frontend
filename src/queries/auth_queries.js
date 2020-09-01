import { gql } from 'apollo-boost'

const loginUserQuery = gql`
	mutation($email: String!, $password: String!) {
		Login(email: $email, password: $password) {
			token
			user {
				id
				photo {
					id
					path
				}
				tenancy_managers {
					id
					tenancy {
						id
						building {
							id
							name
							street_address
							photo {
								id
								path
							}
						}
					}
				}
				building_managers {
					id
					building {
						id
						name
						street_address
						photo {
							id
							path
						}
					}
				}
				building_owners {
					id
					building {
						id
						name
						street_address
						photo {
							id
							path
						}
					}
				}
			}
		}
	}
`

const registerUserQuery = gql`
	mutation(
		$email: String!
		$password: String
		$address: String
		$firstname: String!
		$lastname: String!
		$phonenumber: String!
	) {
		UserAdd(
			email: $email
			password: $password
			address: $address
			firstname: $firstname
			lastname: $lastname
			phonenumber: $phonenumber
		) {
			id
			email
			firstname
			lastname
		}
	}
`

export { loginUserQuery, registerUserQuery }
