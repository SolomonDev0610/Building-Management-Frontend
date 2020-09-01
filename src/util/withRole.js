import React from 'react'
import { Query } from 'react-apollo'
import gql from 'graphql-tag'

const query = gql`
	query($token: String!) {
		user(token: $token) {
			id
			building_owners {
				id
				building {
					id
				}
			}
			building_managers {
				id
				building {
					id
				}
			}
			tenancy_owners {
				id
				tenancy {
					id
				}
			}
			tenancy_managers {
				id
				tenancy {
					id
				}
			}
		}
	}
`

const roleManager = data => {
	let managedBuildingIDs = data.user ? data.user.building_managers.map(x => x.building.id) : []
	let ownedBuildingIDs = data.user ? data.user.building_owners.map(x => x.building.id) : []
	let managedTenancyIDs = data.user ? data.user.tenancy_managers.map(x => x.tenancy.id) : []
	let ownedTenancyIDs = data.user ? data.user.tenancy_owners.map(x => x.tenancy.id) : []

	return {
		managedBuildingIDs,
		ownedBuildingIDs,
		managedTenancyIDs,
		ownedTenancyIDs,

		isBuildingManager: id => managedBuildingIDs.indexOf(id) > -1,
		isBuildingOwner: id => ownedBuildingIDs.indexOf(id) > -1,

		isPropertyManager: id => managedTenancyIDs.indexOf(id) > -1,
		isPropertyOwner: id => ownedTenancyIDs.indexOf(id) > -1,
	}
}

const withRole = Component => props => (
	<Query
		query={query}
		variables={{
			token: localStorage.getItem('pb_user_token'),
		}}
		fetchPolicy="cache-and-network"
	>
		{({ data }) => <Component role={roleManager(data)} {...props} />}
	</Query>
)

export default withRole
