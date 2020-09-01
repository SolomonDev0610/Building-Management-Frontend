import gql from 'graphql-tag'

const buildingMessagingQuery = gql`
	query($token: String!, $id: ID) {
		buildings(token: $token, id: $id) {
			id
			name
			floors {
				id
				name
				number
				tenancies {
					id
					name
				}
			}
			message_groups {
				id
				name
				tenants
				owners
				managers
				tenancies {
					id
					name
				}
				floors {
					id
					name
					number
				}
				latest_message {
					id
					content
					read
					created_at
					read
					from {
						id
						firstname
						lastname
						photo {
							id
							path
						}
					}
				}
			}
			conversations(token: $token) {
				user {
					id
					firstname
					lastname
					email
					photo {
						id
						path
					}
				}
				latest_message {
					id
					content
					read
					created_at
					read
					to {
						id
						firstname
						lastname
						photo {
							id
							path
						}
					}
					from {
						id
						firstname
						lastname
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

const getUserConversations = gql`
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
			conversations {
				user {
					id
					firstname
					lastname
					email
					photo {
						id
						path
					}
				}
				latest_message {
					id
					content
					read
					created_at
					read
					to {
						id
						firstname
						lastname
						photo {
							id
							path
						}
					}
					from {
						id
						firstname
						lastname
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

export { buildingMessagingQuery, getUserConversations }
