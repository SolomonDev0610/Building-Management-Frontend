import { gql } from 'apollo-boost'

const getTiles = gql`
	query($token: String!, $id: ID!) {
		tiles(token: $token, id: $id) {
			id
			title
			description
			assigned
			display_order
			app {
				id
				tenancy {
					id
					name
					building {
						id
						name
					}
				}
			}
			building {
				id
				name
			}
			photo {
				id
				path
			}
			tile_files {
				id
				file {
					id
					filename
					filetype
					path
				}
			}
			sections {
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
	}
`
const buildingTilesQuery = gql`
	query($token: String!, $id: ID) {
		buildings(token: $token, id: $id) {
			id
			name
			street_address
			tiles(sort: "display_order") {
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
	}
`

const tenanciesTilesQuery = gql`
	query($token: String!, $id: ID) {
		tenancies(token: $token, id: $id) {
			id
			name
			building {
				id
				name
				street_address
			}
			app {
				id
				building_tiles(sort: "display_order") {
					id
					assigned
					title
					description
					display_order
					photo {
						id
						path
					}
				}
				tiles {
					id
					title
					assigned
					description
					assigned
					display_order
					photo {
						id
						path
					}
				}
			}
		}
	}
`

export { buildingTilesQuery, tenanciesTilesQuery, getTiles }
