import React from 'react'
import './TenantList.style.scss'
import ContentHeader from 'components/ContentHeader/ContentHeader.component'
import { Snackbar } from '@material-ui/core'
import { graphql } from 'react-apollo'
import { tenantQueryList } from 'queries/building_queries'
import { removeTenant } from 'queries/tenancies_mutations'
import BuildingTableList from 'components/BuildingTableList/BuildingTableList.component'
import LoadingComponent from 'components/LoadingComponent/Loading.component'
import Page from 'components/Page'

import query from 'util/query'
import withTitle from 'util/withTitle'

@query(props => ({
	query: tenantQueryList,
	variables: {
		token: localStorage.getItem('pb_user_token'),
		id: props.match.params.building_id,
	},
	fetchPolicy: 'cache-and-network',
}))
@graphql(removeTenant, { name: 'delete_tenant' })
@withTitle
class TenantList extends React.Component {
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

	_clickAdd = () => {
		this.props.router.navigate('buildings.view.tenants.new', { id: 1 }, { reload: true })
	}

	_backToDash = () => {
		this.props.router.navigate('dashboard', {}, { reload: true })
	}

	handleDeleteModalOpen = () => {
		this.setState({
			deleteModal: true,
		})
	}

	handleDeleteModalClose = () => {
		this.setState({
			deleteModal: false,
		})
	}

	handleDeleteSnackBarClose = () => {
		this.setState({
			isDeleteConfirm: false,
		})
	}

	__handleDeleteTenant = id => {
		this.handleDeleteModalClose()

		this.setState({
			isDeletingDone: true,
		})

		this.props
			.delete_tenant({
				variables: {
					token: localStorage.getItem('pb_user_token'),
					id: id,
				},
			})
			.then(result => {
				if (result.data) {
					setTimeout(() => {
						this.setState(
							{
								isDeletingDone: false,
								isDeleteConfirm: true,
							},
							this.props.query.refetch
						)
					}, 1000)
				}
			})
	}

	getBuilding = () => {
		if (this.props.query.data.buildings) {
			return this.props.query.data.buildings[0]
		}

		return null
	}

	render() {
		let { isDeletingDone, deleteModal } = this.state
		let building = this.getBuilding()

		if (!building) return <Page />

		// this should probably be memoized, but it's fine for now
		const contentListData = building.tenancies.reduce((acc, tenancy) => {
			let tenants = tenancy.tenants.map(tenant => ({
				id: tenant.id,
				user_id: tenant.user.id,
				tenancy: tenancy.name,
				name: tenant.user.firstname + ' ' + tenant.user.lastname,
				email: tenant.user.email,
			}))

			return [...acc, ...tenants]
		}, [])

		return (
			<Page>
				<div className="page-content building-list-content">
					{isDeletingDone === true ? <LoadingComponent /> : null}
					<ContentHeader
						visibleBack={true}
						title={'Tenants within ' + building.name}
						addbutton={{
							visible: false,
							label: 'Add Tenant',
							onClick: this._clickAdd,
						}}
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
								name: 'Tenants',
							},
						]}
					/>
					<BuildingTableList
						data={contentListData}
						onDelete={this.__handleDeleteTenant}
						list_type="tenant"
						delete_dialog={deleteModal}
						delete_dialog_open={this.handleDeleteModalOpen}
						delete_dialog_close={this.handleDeleteModalClose}
					/>

					<Snackbar
						anchorOrigin={{
							vertical: 'bottom',
							horizontal: 'right',
						}}
						open={this.state.isDeleteConfirm}
						onClose={this.handleDeleteSnackBarClose}
						ContentProps={{
							'aria-describedby': 'message-id',
						}}
						message={<span id="message-id">Success Delete Tenant</span>}
					/>
				</div>
			</Page>
		)
	}
}

export default TenantList
