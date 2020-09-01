import React from 'react'
import './OwnerList.style.scss'
import ContentHeader from 'components/ContentHeader/ContentHeader.component'
import { graphql } from 'react-apollo'
import { ownerQueryList } from 'queries/building_queries'
import { BuildingOwnerRemove } from 'queries/building_mutations'
import BuildingTableList from 'components/BuildingTableList/BuildingTableList.component'
import Page from 'components/Page'
import queryDeco from 'util/query'
import withTitle from 'util/withTitle'

@queryDeco(props => ({
	query: ownerQueryList,
	variables: {
		token: localStorage.getItem('pb_user_token'),
		id: props.match.params.building_id,
	},
	fetchPolicy: 'cache-and-network',
}))
@graphql(BuildingOwnerRemove, { name: 'delete_owner' })
@withTitle
class OwnerList extends React.Component {
	state = {
		contentListData: {
			data: [],
			type: '',
			queryFinished: false,
		},
		deleteModal: false,
		isDeletingDone: false,
		isDeleteConfirm: false,
	}

	getBuilding = () => {
		if (this.props.query.data.buildings) {
			console.log(this.props.query.data);
			return this.props.query.data.buildings[0]
		}

		return null
	}

	render() {
		let building = this.getBuilding()

		if (!building) return <Page />

		return (
			<Page>
				<div className="page-content building-list-content">
					<ContentHeader
						addbutton={{
							visible: false,
						}}
						visibleBack={true}
						title={'Owners within ' + building.name}
						breadcrumb={[
							{
								name: 'Dashboard',
								link: '/dashboard',
							},
							{
								name: building.name,
								link: `/building/${building.id}`,
							},
							{
								name: 'Owners',
							},
						]}
					/>

					<BuildingTableList
						queryFinished={true}
						type="owner"
						data={building.building_owners.map(x => ({
							id: x.id,
							user_id: x.user.id,
							name: x.user.firstname + ' ' + x.user.lastname,
							email: x.user.email,
							tenancies: x.building.tenancies,
						}))}
						list_type="owner"
					/>
				</div>
			</Page>
		)
	}
}

export default OwnerList
