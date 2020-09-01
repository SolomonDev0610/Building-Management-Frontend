import React from 'react'

const withTitle = Component => props => {
	if (props.route && props.route.title) {
		let title = props.route.title

		if (typeof title === 'function') {
			title = title(props)
		}

		document.title = title + ' - Propertee Butler'
	}
	return <Component {...props} />
}

export default withTitle
