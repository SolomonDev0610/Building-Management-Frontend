import ApolloClient from 'apollo-boost'
import config from 'config'

const clientGraphQL = new ApolloClient({
	uri: config.GRAPH_API_URL,
})

export default clientGraphQL
