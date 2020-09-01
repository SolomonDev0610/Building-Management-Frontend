import React, { Component } from 'react'
import './messaging.scss'
import withTitle from 'util/withTitle'
import { Message as MessageIcon, Send } from '@material-ui/icons'
import { Input } from '@material-ui/core'
import query from 'util/query'
import { getDecodedToken } from 'util/helpers'
import Page from 'components/Page'
import config from 'config'
import io from 'socket.io-client'
import TextareaAutosize from 'react-autosize-textarea'
import { userHeaderQuery } from 'queries/user_queries'
import { getUserConversations } from 'queries/message_queries'
import Message from './Message'
import defaultUserPhoto from 'assets/img/default-user.png'
import ContentHeader from 'components/ContentHeader/ContentHeader.component'

const user_id = () => getDecodedToken().user.id

@query(
	() => ({
		query: userHeaderQuery,
		variables: {
			token: localStorage.getItem('pb_user_token'),
			id: user_id(),
		},
		fetchPolicy: 'cache-and-network',
	}),
	'headerQuery'
)
@query((_) => ({
	query: getUserConversations,
	variables: {
		token: localStorage.getItem('pb_user_token'),
		id: user_id(),
	},
	fetchPolicy: 'cache-and-network',
}))
@withTitle
class Inbox extends Component {
	state = {
		messages: [],
		input: '',
		search: '',
		active_convo_user: null,
		shouldScrollDown: false,
		scrollAtBottom: false,
	}

	socket = null
	chatWindow = React.createRef()

	componentDidMount() {
		this.socket = io(config.SOCKET_SERVER, { secure: config.SOCKET_SERVER.indexOf('https') === 0 })

		this.socket.on('connect', this.connect)
		this.socket.on('disconnect', this.disconnect)
		this.socket.on('serverConnected', this.serverConnected)
		this.socket.on('receiveMessages', this.receiveMessages)
		this.socket.on('serverMessage', this.serverMessage)
		this.socket.on('messageReadUpdate', this.messageReadUpdate)

		this.chatWindow.current.addEventListener('scroll', this.handleChatScroll)
	}

	componentWillUnmount() {
		this.socket.off('connect', this.connect)
		this.socket.off('disconnect', this.disconnect)
		this.socket.off('serverConnected', this.serverConnected)
		this.socket.off('receiveMessages', this.receiveMessages)
		this.socket.off('serverMessage', this.serverMessage)
		this.socket.off('messageReadUpdate', this.messageReadUpdate)

		this.chatWindow.current.removeEventListener('scroll', this.handleChatScroll)
	}

	componentDidUpdate(prevProps) {
		if (prevProps.query.data !== this.props.query.data) {
			this.subscribe()
		}

		if (this.state.shouldScrollDown && this.chatWindow.current) {
			this.chatWindow.current.scrollTop = this.chatWindow.current.scrollHeight

			this.setState({ shouldScrollDown: false })
		}
	}

	handleChatScroll = (e) => {
		if (
			this.chatWindow.current.scrollHeight -
				this.chatWindow.current.clientHeight -
				this.chatWindow.current.scrollTop ===
			0
		) {
			this.setState({
				scrollAtBottom: true,
			})
		} else {
			this.setState({
				scrollAtBottom: false,
			})
		}
	}

	connect = () => {
		console.log('connected', this.socket.id)
		console.log('socket', this.socket)
		this.subscribe()
	}

	disconnect = () => {
		console.log('disconnect')
	}

	subscribe = () => {
		if (!this.props.query.data.user) return

		let user_ids = this.props.query.data.user.conversations.map((x) => x.user.id)

		this.socket.emit('subscribe', {
			id: user_id(),
			user_ids,
		})
	}

	serverConnected = (data) => {
		this.setState({
			messages: data.messages,
			shouldScrollDown: true,
		})

		data.messages
			.filter((x) => +x.to_id === +user_id())
			.filter((x) => !x.read)
			.forEach((x) => this.socket.emit('messageRead', { id: x.id }))
	}

	receiveMessages = (data) => {
		console.log('receiveMessages', data)
	}

	serverMessage = (data) => {
		console.log('serverMessage', data)
		if (
			this.state.active_convo_user &&
			((+data.to_id === +user_id() && +data.from_id === +this.state.active_convo_user.id) ||
				(+data.from_id === +user_id() && +data.to_id === +this.state.active_convo_user.id))
		) {
			this.setState({
				messages: [...this.state.messages, data],
				shouldScrollDown:
					this.chatWindow.current.scrollHeight -
						this.chatWindow.current.clientHeight -
						this.chatWindow.current.scrollTop <=
					30,
			})

			if (+data.to_id === +user_id()) {
				console.log('mark as read', data)
				this.socket.emit('messageRead', { id: data.id })
			}
		} else {
			this.props.headerQuery.refetch()
		}

		this.props.query.refetch()
	}

	messageReadUpdate = (data) => {
		this.setState(
			{
				messages: this.state.messages.map((msg) => {
					if (msg.id === data.id) {
						msg = { ...msg, read: data.read }
					}

					return msg
				}),
			},
			() => {
				this.props.headerQuery.refetch()
			}
		)
	}

	side = (message) => {
		return +message.from_id === user_id() ? 'us' : 'them'
	}

	selectConvo = (convo) => () => {
		if (convo.user === this.state.active_convo_user) return

		this.setState(
			{
				active_convo_user: convo.user,
			},
			() => {
				this.socket.emit('clientConnected', {
					user_id: user_id(),
					to_id: convo.user.id,
				})
			}
		)
	}

	send = (e) => {
		if (e) e.preventDefault()

		if (!this.state.active_convo_user) return
		if (this.state.input.trim() === '') return

		let data = { user_id: user_id(), to_id: this.state.active_convo_user.id, message: this.state.input }

		this.socket.emit('clientMessage', data)

		this.setState({
			input: '',
		})
	}

	handleInputKeyDown = (e) => {
		if (e.nativeEvent.key === 'Enter' && e.nativeEvent.shiftKey) {
			e.preventDefault()
			this.send()
		}
	}

	getUserPhoto = (user) => {
		return user && user.photo ? config.URL + user.photo.path : defaultUserPhoto
	}

	getUser = () => {
		return this.props.query.data.user || { conversations: [] }
	}

	getBuilding = () => {
		if (this.props.buildingQuery && this.props.buildingQuery.data.buildings) {
			return this.props.buildingQuery.data.buildings[0]
		}

		return null
	}

	getConversations = () => {
		let user = this.getUser()

		return user.conversations
			.filter((convo) => {
				return (
					(convo.user.firstname.toLowerCase() + ' ' + convo.user.lastname.toLowerCase()).indexOf(
						this.state.search.toLowerCase()
					) !== -1
				)
			})
			.sort((x, y) => {
				return new Date(y.latest_message.created_at).valueOf() - new Date(x.latest_message.created_at).valueOf()
			})
	}

	render() {
		let user = this.getUser()
		let building = this.getBuilding()
		let conversations = this.getConversations()

		return (
			<Page>
				<div className="messaging-wrapper">
					{building ? (
						<ContentHeader
							visibleBack={true}
							title="Send Message(s)"
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
									name: 'Send Messages',
								},
							]}
						/>
					) : (
						<div className="messaging-header">
							<h1>My Inbox</h1>
						</div>
					)}
					<div className="messaging-body">
						<div className="messaging-sidebar">
							<div className="button-container">
								<Input
									placeholder="Search person to message..."
									value={this.state.value}
									onChange={(e) => this.setState({ search: e.target.value })}
									fullWidth
								/>
							</div>

							{conversations.map((convo, i) => (
								<button
									key={convo.user.id}
									className={`messaging-user-convo ${
										convo.user === this.state.active_convo_user ? 'messaging-user-convo-active' : ''
									}`}
									onClick={this.selectConvo(convo)}
								>
									<img src={this.getUserPhoto(convo.user)} alt={convo.user.firstname} />

									<div className="details">
										<p className="user-name">
											{convo.user.firstname} {convo.user.lastname}
										</p>
										<p
											className={`content ${
												!convo.latest_message.read &&
												+convo.latest_message.from.id !== +user_id()
													? 'unread'
													: 'read'
											}`}
										>
											{+convo.latest_message.from.id === +user_id()
												? 'You said: '
												: 'They said: '}
											{convo.latest_message.content}
										</p>
									</div>
								</button>
							))}
						</div>
						<div className="messaging-convo">
							<div
								className={`messaging-chat ${!this.state.active_convo_user ? 'no-chat' : ''}`}
								ref={this.chatWindow}
							>
								{this.state.active_convo_user ? (
									this.state.messages.map((msg, i) => (
										<Message
											key={msg.id}
											content={msg.content}
											date={msg.created_at}
											read={msg.read}
											side={this.side(msg)}
											showDate={this.state.messages.length - 1 === i}
											userPhoto={this.getUserPhoto(
												+msg.from_id === +user_id() ? user : this.state.active_convo_user
											)}
										/>
									))
								) : (
									<MessageIcon
										color="primary"
										classes={{ colorPrimary: '#ddd' }}
										className="no-chat-icon"
									/>
								)}
							</div>

							{this.state.active_convo_user && (
								<form
									className={`messaging-form ${
										!this.state.scrollAtBottom && this.state.active_convo_user
											? 'messaging-form-shadow'
											: ''
									}`}
									onSubmit={this.send}
								>
									<TextareaAutosize
										placeholder="Type your message here..."
										value={this.state.input}
										onChange={(e) =>
											this.setState({
												input: e.target.value,
											})
										}
										disabled={!this.state.active_convo_user}
										onKeyDown={this.handleInputKeyDown}
									/>
									<button type="submit">
										<Send fontSize="large" />
									</button>
								</form>
							)}
						</div>
					</div>
				</div>
			</Page>
		)
	}
}

export default Inbox
