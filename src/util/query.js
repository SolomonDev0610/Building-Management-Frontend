import React from 'react'
import { Query } from 'react-apollo'

const query = (fn, name = 'query') => Component => props => {
	let queryProps = typeof fn === 'function' ? fn(props) : fn

	if (!queryProps) return <Component {...props} />

	return (
		<Query {...queryProps}>
			{resultProps => {
				let queryProps = {
					[name]: resultProps,
				}

				return <Component {...props} {...queryProps} />
			}}
		</Query>
	)
}

export default query
