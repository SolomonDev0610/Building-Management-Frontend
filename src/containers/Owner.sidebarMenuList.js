import React from 'react'
import { Folder, AccountCircle } from '@material-ui/icons'

export default [
	{
		name: '',
		children: [
			{
				name: 'Tenants',
				icon: <AccountCircle />,
				link: building => `/building/${building.id}/tenants`,
			},
			{
				name: 'Files',
				icon: <Folder />,
				link: building => `/building/${building.id}/files`,
			},
		],
	},
]
