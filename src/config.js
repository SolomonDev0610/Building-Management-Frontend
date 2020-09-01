const config = {
	// URL: 'http://pbapistaging.applicable.co.nz',
	// API_URL: 'http://pbapistaging.applicable.co.nz/api',
	// GRAPH_API_URL: 'http://pbapistaging.applicable.co.nz/graphql',
	// SOCKET_SERVER: 'http://pbapistaging.applicable.co.nz:8888',

	// URL: process.env.REACT_APP_URL || 'https://pbstaging.properteebutler.co.nz',
	// API_URL: process.env.REACT_APP_API_URL || 'https://api.properteebutler.co.nz/api',
	// GRAPH_API_URL: process.env.REACT_APP_GRAPH_API_URL || 'https://api.properteebutler.co.nz/graphql',
	// SOCKET_SERVER: process.env.REACT_APP_SOCKET_SERVER || 'https://websocket.properteebutler.co.nz',

    URL: process.env.REACT_APP_URL || 'http://localhost',
    API_URL: process.env.REACT_APP_API_URL || 'http://localhost:8000/api',
    GRAPH_API_URL: process.env.REACT_APP_GRAPH_API_URL || 'http://localhost:8000/graphql',
    SOCKET_SERVER: process.env.REACT_APP_SOCKET_SERVER || 'http://localhost:8443',
}

export default config
