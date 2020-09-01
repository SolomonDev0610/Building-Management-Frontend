import ReactDOM from 'react-dom'
import React from 'react'
import { ApolloProvider } from 'react-apollo'
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles'
import './assets/scss/_style.scss'
import './index.scss'
import config from './config'
import axios from 'axios'
import Router from './router'
import apollo from './util/apollo'

const theme = createMuiTheme({
	typography: {
		fontFamily: '"Lato", sans-serif',
		useNextVariants: true,
	},
	palette: {
		primary: {
			light: '#5cbfca',
			main: '#5cbfca',
			dark: '#5cbfca',
			contrastText: '#fff',
		},
		secondary: {
			light: '#f28946',
			main: '#f28946',
			dark: '#f28946',
			contrastText: '#fff',
		},
	},
})

axios.defaults.baseURL = config.API_URL

ReactDOM.render(
	<ApolloProvider client={apollo}>
		<MuiThemeProvider theme={theme}>
			<Router />
		</MuiThemeProvider>
	</ApolloProvider>,
	document.getElementById('root')
)
