import { gql } from 'apollo-boost'

const addNote = gql`
	mutation($token: String!, $tile: String, $description: String, $user_id: Int, $author_id: Int) {
		NoteAdd(token: $token, tile: $tile, description: $description, user_id: $user_id, author_id: $author_id) {
			id
			tile
			description
			created_at
		}
	}
`

const changeNote = gql`
	mutation($token: String!, $id: Int!, $tile: String, $description: String, $user_id: Int, $author_id: Int) {
		NoteChange(
			token: $token
			id: $id
			tile: $tile
			description: $description
			user_id: $user_id
			author_id: $author_id
		) {
			id
			tile
			description
			created_at
		}
	}
`

const removeNote = gql`
	mutation($token: String!, $id: Int!) {
		NoteRemove(token: $token, id: $id) {
			id
		}
	}
`

export { addNote, changeNote, removeNote }
