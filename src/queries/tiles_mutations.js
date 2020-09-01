import { gql } from 'apollo-boost'

const TileAdd = gql`
	mutation(
		$token: String!
		$title: String!
		$description: String
		$assigned: Boolean
		$photo_id: ID
		$app_id: ID
		$building_id: ID
	) {
		TileAdd(
			token: $token
			title: $title
			description: $description
			assigned: $assigned
			photo_id: $photo_id
			app_id: $app_id
			building_id: $building_id
		) {
			id
		}
	}
`

const TileAssign = gql`
	mutation($token: String!, $id: Int!, $assigned: Boolean, $display_order: Int) {
		TileChange(token: $token, id: $id, assigned: $assigned, display_order: $display_order) {
			id
			assigned
			display_order
		}
	}
`

const TileChange = gql`
	mutation(
		$token: String!
		$id: Int!
		$title: String!
		$description: String
		$display_order: Int
		$assigned: Boolean
		$photo_id: ID
	) {
		TileChange(
			token: $token
			id: $id
			title: $title
			description: $description
			display_order: $display_order
			assigned: $assigned
			photo_id: $photo_id
		) {
			id
			title
			description
			assigned
			display_order
			photo {
				id
				path
			}
		}
	}
`

const SectionAdd = gql`
	mutation(
		$token: String!
		$tile_id: ID!
		$title: String!
		$subtitle: String!
		$content: String!
		$link_text: String
		$link_url: String
		$photo_id: ID
	) {
		SectionAdd(
			token: $token
			tile_id: $tile_id
			title: $title
			subtitle: $subtitle
			content: $content
			link_text: $link_text
			link_url: $link_url
			photo_id: $photo_id
		) {
			id
		}
	}
`

const SectionChange = gql`
	mutation(
		$token: String!
		$id: ID!
		$title: String
		$subtitle: String
		$content: String
		$link_text: String
		$link_url: String
		$photo_id: ID
	) {
		SectionChange(
			token: $token
			id: $id
			title: $title
			subtitle: $subtitle
			content: $content
			link_text: $link_text
			link_url: $link_url
			photo_id: $photo_id
		) {
			id
			title
			subtitle
			content
			link_text
			link_url
			photo {
				id
				path
			}
		}
	}
`

const SectionRemove = gql`
	mutation($token: String!, $id: Int!) {
		SectionRemove(token: $token, id: $id) {
			id
		}
	}
`

const TileFileAdd = gql`
	mutation($token: String!, $tile_id: ID!, $file_id: ID!) {
		TileFileAdd(token: $token, tile_id: $tile_id, file_id: $file_id) {
			id
		}
	}
`

const TileFileChange = gql`
	mutation($token: String!, $id: Int!, $tile_id: ID!, $file_id: ID!) {
		TileFileChange(token: $token, id: $id, tile_id: $tile_id, file_id: $file_id) {
			id
		}
	}
`

const TileFileRemove = gql`
	mutation($token: String!, $id: Int!) {
		TileFileRemove(token: $token, id: $id) {
			id
		}
	}
`

const TileOrder = gql`
	mutation($token: String!, $ids: [ID]!) {
		TileOrder(token: $token, ids: $ids) {
			id
			display_order
		}
	}
`

export {
	TileAdd,
	TileChange,
	TileAssign,
	SectionAdd,
	SectionChange,
	SectionRemove,
	TileFileAdd,
	TileFileChange,
	TileFileRemove,
	TileOrder,
}
