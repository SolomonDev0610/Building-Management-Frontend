import React from 'react'
import { Folder, AccountCircle, Message, Apps, Edit } from '@material-ui/icons'

export default [
	{
		name: '',
		children: [
			{
				name: 'Manage App',
				icon: <Apps />,
				link: building => `/building/${building.id}/app`,
			},
			{
				name: 'Owners',
				icon: <AccountCircle />,
				link: building => `/building/${building.id}/owners`,
			},
            {
                name: 'Properties',
                icon: <AccountCircle />,
                link: building => `/building/${building.id}/tenants`,
            },
			{
				name: 'Tenants',
				icon: <AccountCircle />,
				link: building => `/building/${building.id}/tenants`,
			},
			{
				name: 'Send Message(s)',
				icon: <Message />,
				link: building => `/building/${building.id}/messages`,
			},
			{
				name: 'Files',
				icon: <Folder />,
				link: building => `/building/${building.id}/files`,
			},
			{
				name: 'Edit/Delete Building',
				icon: <Edit />,
				link: building => `/building/${building.id}/edit`,
			},
		],
	},
]
