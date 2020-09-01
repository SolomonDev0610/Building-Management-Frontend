import React from 'react'
import { BrowserRouter, Route, Switch } from 'react-router-dom'

import SignIn from 'pages/SignIn/SignIn'
import SignUp from 'pages/SignUp/SignUp'
import Dashboard from 'pages/Dashboard/Dashboard'
import Inbox from 'pages/Messages/Inbox'
import BuildingMessaging from 'pages/Messages/BuildingMessaging'
import UserProfileEdit from 'pages/UserProfile/UserProfileEdit'
import BuildingNew from 'pages/Buildings/BuildingNew'
import BuildingView from 'pages/Buildings/BuildingView'
import BuildingEdit from 'pages/Buildings/BuildingEdit'
import BuildingOwnerNew from 'pages/Buildings/BuildingOwnerNew'
import BuildingManagerNew from 'pages/Buildings/BuildingManagerNew'
import OwnerList from 'pages/Owners/OwnerList'
import FileList from 'pages/Files/FileList'
import TenancyView from 'pages/Tenancies/TenancyView'
import TenancyNew from 'pages/Tenancies/TenancyNew'
import TenancyEdit from 'pages/Tenancies/TenancyEdit'
import PropertyManagerNew from 'pages/Tenancies/PropertyManagerNew'
import PropertyOwnerNew from 'pages/Tenancies/PropertyOwnerNew'
import TenantList from 'pages/Tenants/TenantList'
import TenantNew from 'pages/Tenants/TenantNew'
import TenantEdit from 'pages/Tenants/TenantEdit'
import BuildingApp from 'pages/App/BuildingApp'
import BuildingTileNew from 'pages/App/BuildingTileNew'
import BuildingTileEdit from 'pages/App/BuildingTileEdit'
import TenancyApp from 'pages/App/TenancyApp'
import TenancyTileNew from 'pages/App/TenancyTileNew'
import TenancyTileEdit from 'pages/App/TenancyTileEdit'

const NoRoute = () => (
	<div style={{ margin: '2.5em' }}>
		<h1>404</h1>
		<p>Page not found</p>
	</div>
)

//prettier-ignore
export const routes = [
	{
		url: '/',
		component: SignIn,
		title: 'Sign In'
	},
	{
		url: '/signin',
		component: SignIn,
		title: 'Sign In'
	},
	{
		url: '/signup',
		component: SignUp,
		title: 'Sign Up'
	},
	{
		url: '/dashboard',
		component: Dashboard,
		title: 'Dashboard'
	},
	{
		url: '/profile/edit',
		component: UserProfileEdit,
		title: 'Edit User'
	},
	{
		url: '/messages',
		component: Inbox,
		title: 'Messages'
	},
	{
		url: '/building/new',
		component: BuildingNew,
		title: 'Add Building'
	},
	{
		url: '/building/:building_id',
		component: BuildingView,
		title: ({query:{data:{buildings}}}) => buildings ? buildings[0].name : 'View Building'
	},
	{
		url: '/building/:building_id/app',
		component: BuildingApp,
		title: 'Manage Building-wide App'
	},
	{
		url: '/building/:building_id/app/new-tile',
		component: BuildingTileNew,
		title: 'New Building-wide Tile'
	},
	{
		url: '/building/:building_id/app/tile/:tile_id/edit',
		component: BuildingTileEdit,
		title: 'Edit Building-wide Tile'
	},
	{
		url: '/building/:building_id/owners',
		component: OwnerList,
		title: 'Manage Building Owners'
	},
	{
		url: '/building/:building_id/tenants',
		component: TenantList,
		title: 'Manage Building Tenants'
	},
	{
		url: '/building/:building_id/files',
		component: FileList,
		title: 'Manage Building Files'
	},
	{
		url: '/building/:building_id/edit',
		component: BuildingEdit,
		title: 'Edit Building'
	},
	{
		url: '/building/:building_id/messages',
		component: BuildingMessaging,
		title: 'Building Messages'
	},
	{
		url: '/building/:building_id/new-owner',
		component: BuildingOwnerNew,
		title: 'Building Messages'
	},
	{
		url: '/building/:building_id/new-manager',
		component: BuildingManagerNew,
		title: 'Building Messages'
	},
	{
		url: '/building/:building_id/tenancy/new',
		component: TenancyNew,
		title: 'New Tenancy'
	},
	{
		url: '/building/:building_id/tenancy/:tenancy_id',
		component: TenancyView,
		title: ({query:{data:{tenancies}}}) => tenancies ? tenancies[0].name : 'View Tenancy'
	},
	{
		url: '/building/:building_id/tenancy/:tenancy_id/edit',
		component: TenancyEdit,
		title: 'Edit Tenancy'
	},
	{
		url: '/building/:building_id/tenancy/:tenancy_id/new-tenant',
		component: TenantNew,
		title: 'New Tenant'
	},
	{
		url: '/building/:building_id/tenancy/:tenancy_id/new-owner',
		component: PropertyOwnerNew,
		title: 'Assign Tenancy Owner'
	},
	{
		url: '/building/:building_id/tenancy/:tenancy_id/new-manager',
		component: PropertyManagerNew,
		title: 'Assign Tenancy Owner'
	},
	{
		url: '/building/:building_id/tenancy/:tenancy_id/app',
		component: TenancyApp,
		title: 'Manage Tenancy App'
	},
	{
		url: '/building/:building_id/tenancy/:tenancy_id/app/new-tile',
		component: TenancyTileNew,
		title: 'New Tenancy Tile'
	},
	{
		url: '/building/:building_id/tenancy/:tenancy_id/app/tile/:tile_id/edit',
		component: TenancyTileEdit,
		title: 'Edit Tenancy Tile'
	},
	{
		url: '/building/:building_id/tenant/:tenant_id/edit',
		component: TenantEdit,
		title: 'Edit Tenant'
	},
]

const Router = _ => (
	<BrowserRouter>
		<Switch>
			{routes.map((route, i) => (
				<Route
					key={i}
					exact
					path={route.url}
					render={routeProps => <route.component {...routeProps} route={route} />}
				/>
			))}
			<Route component={NoRoute} />
		</Switch>
	</BrowserRouter>
)

export default Router
