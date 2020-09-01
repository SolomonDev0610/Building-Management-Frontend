import React, { Component } from 'react'
import './messaging.scss'
import withTitle from 'util/withTitle'
import { Message as MessageIcon, Send, Add, Edit } from '@material-ui/icons'
import { Tabs, Tab, Button, Input } from '@material-ui/core'
import query from 'util/query'
import { getDecodedToken } from 'util/helpers'
import Page from 'components/Page'
import config from 'config'
import io from 'socket.io-client'
import TextareaAutosize from 'react-autosize-textarea'
import { userHeaderQuery } from 'queries/user_queries'
import Message from './Message'
import defaultUserPhoto from 'assets/img/default-user.png'
import ContentHeader from 'components/ContentHeader/ContentHeader.component'
import { buildingMessagingQuery } from 'queries/message_queries'
import { MessageGroupAdd, MessageGroupChange } from 'queries/message_mutations'
import MessageGroupDialog from './MessageGroupDialog'
import apollo from 'util/apollo'

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
@query(({ match }) => ({
	query: buildingMessagingQuery,
	variables: {
		token: localStorage.getItem('pb_user_token'),
		id: match.params.building_id,
	},
	fetchPolicy: 'cache-and-network',
}))
@withTitle
class BuildingMessaging extends Component {
	state = {
		messages: [],
		input: '',
		search: '',
		active_convo_user: null,
		active_group: null,
		shouldScrollDown: false,
		scrollAtBottom: false,
		tab: 0,
		groupDialog: false,
		editGroup: null,
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
		if (!this.props.query.data.buildings) return

		let user_ids = this.props.query.data.buildings[0].conversations.map((x) => x.user.id)

		this.socket.emit('subscribe', {
			id: user_id(),
			user_ids,
		})
	}

	serverConnected = (data) => {
		console.log('serverConnected', data)
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
			(this.state.active_group && +this.state.active_group.id === +data.message_group_id) ||
			(this.state.active_convo_user &&
				((+data.to_id === +user_id() && +data.from_id === +this.state.active_convo_user.id) ||
					(+data.from_id === +user_id() && +data.to_id === +this.state.active_convo_user.id)))
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

	selectConvo = (convo) => () => {
		if (convo.user === this.state.active_convo_user) return

		this.setState(
			{
				active_convo_user: convo.user,
				active_group: null,
				messages: [],
			},
			() => {
				this.socket.emit('clientConnected', {
					user_id: user_id(),
					to_id: convo.user.id,
				})
			}
		)
	}

	selectGroup = (group) => () => {
		if (group === this.state.active_group) return

		this.setState(
			{
				active_group: group,
				active_convo_user: null,
				messages: [],
			},
			() => {
				this.socket.emit('clientConnected', {
					user_id: user_id(),
					group_id: group.id,
				})
			}
		)
	}

	send = (e) => {
		if (e) e.preventDefault()

		if (this.state.input.trim() === '') return

		if (this.state.active_convo_user) {
			let data = { user_id: user_id(), to_id: this.state.active_convo_user.id, message: this.state.input }

			this.socket.emit('clientMessage', data)

			this.setState({
				input: '',
			})
		} else if (this.state.active_group) {
			let data = { user_id: user_id(), group_id: this.state.active_group.id, message: this.state.input }

			this.socket.emit('clientMessage', data)

			this.setState({
				input: '',
			})
		}
	}

	handleInputKeyDown = (e) => {
		if (e.nativeEvent.key === 'Enter' && e.nativeEvent.shiftKey) {
			e.preventDefault()
			this.send()
		}
	}

	selectTab = (_, tab) => {
		if (this.state.tab !== tab) {
			this.setState({
				tab,
				active_convo_user: null,
				active_group: null,
				search: '',
			})
		}
	}

	createGroup = async (data) => {
		if (data.id) {
			await apollo.mutate({
				mutation: MessageGroupChange,
				variables: {
					token: localStorage.getItem('pb_user_token'),
					building_id: this.getBuilding().id,
					...data,
					floor_ids: data.floors.map((x) => x.id),
					tenancy_ids: data.tenancies.map((x) => x.id),
				},
			})
		} else {
			await apollo.mutate({
				mutation: MessageGroupAdd,
				variables: {
					token: localStorage.getItem('pb_user_token'),
					building_id: this.getBuilding().id,
					...data,
					floor_ids: data.floors.map((x) => x.id),
					tenancy_ids: data.tenancies.map((x) => x.id),
				},
			})
		}

		this.setState({ groupDialog: false }, () => {
			this.props.query.refetch()
		})
	}

	editGroup = (group) => (e) => {
		e.stopPropagation()

		this.setState({ groupDialog: true, editGroup: group })
	}

	getUserPhoto = (user) => {
		return user && user.photo ? config.URL + user.photo.path : defaultUserPhoto
	}

	getBuilding = () => {
		if (this.props.query.data.buildings) {
			return this.props.query.data.buildings[0]
		}

		return null
	}

	getConversations = () => {
		let building = this.getBuilding()

		if (!building) return []

		return building.conversations
			.filter(
				(convo) =>
					(convo.user.firstname.toLowerCase() + ' ' + convo.user.lastname.toLowerCase()).indexOf(
						this.state.search.toLowerCase()
					) !== -1
			)
			.sort((x, y) => {
				return new Date(y.latest_message.created_at).valueOf() - new Date(x.latest_message.created_at).valueOf()
			})
	}

	getMessageGroups = () => {
		let building = this.getBuilding()

		if (!building) return []

		return building.message_groups
			.filter((group) => group.name.toLowerCase().indexOf(this.state.search.toLowerCase()) !== -1)
			.sort((x, y) => {
				if (!y.latest_message || !x.latest_message) return Infinity
				return new Date(y.latest_message.created_at).valueOf() - new Date(x.latest_message.created_at).valueOf()
			})
	}

	render() {
		let building = this.getBuilding()

		let conversations = this.getConversations()
		let messageGroups = this.getMessageGroups()

		return (
			<Page>
				{this.state.groupDialog && (
					<MessageGroupDialog
						open={this.state.groupDialog}
						floors={building ? building.floors : []}
						onClose={() => this.setState({ groupDialog: false })}
						onSubmit={this.createGroup}
						value={this.state.editGroup}
					/>
				)}
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
							standalone
						/>
					) : null}
					<div className="messaging-body">
						<div className="messaging-sidebar">
							<Tabs
								scrollButtons="auto"
								value={this.state.tab}
								onChange={this.selectTab}
								indicatorColor="primary"
								textColor="primary"
							>
								<Tab
									label="Individual"
									classes={{
										root: 'tab-element',
									}}
								/>
								<Tab
									label="Groups"
									classes={{
										root: 'tab-element',
									}}
								/>
							</Tabs>
							{building && (
								<div className="messaging-sidebar-list">
									{this.state.tab === 0 ? (
										<>
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
													key={i}
													className={`messaging-user-convo ${
														convo.user === this.state.active_convo_user
															? 'messaging-user-convo-active'
															: ''
													}`}
													onClick={this.selectConvo(convo)}
												>
													<img
														src={this.getUserPhoto(convo.user)}
														alt={convo.user.firstname}
													/>

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
																: convo.latest_message.from.firstname + ' said: '}
															{convo.latest_message.content}
														</p>
													</div>
												</button>
											))}
										</>
									) : (
										<div className="messaging-groups">
											<div className="button-container">
												<Input
													placeholder="Search group to message..."
													value={this.state.value}
													onChange={(e) => this.setState({ search: e.target.value })}
													style={{
														marginBottom: '1em',
													}}
													fullWidth
												/>
												<Button
													variant="contained"
													color="primary"
													fullWidth
													onClick={() => this.setState({ groupDialog: true })}
												>
													ADD GROUP <Add />
												</Button>
											</div>
											{messageGroups.map((group) => (
												<div
													key={group.id}
													className={`messaging-group ${
														this.state.active_group &&
														+this.state.active_group.id === +group.id
															? 'messaging-user-convo-active'
															: ''
													}`}
													onClick={this.selectGroup(group)}
												>
													{group.latest_message && (
														<img
															src={this.getUserPhoto(group.latest_message.from)}
															alt={group.latest_message.from.firstname}
														/>
													)}

													<div className="details">
														<p className="user-name">{group.name}</p>
														{group.latest_message && (
															<p className={`content`}>
																{+group.latest_message.from.id === +user_id()
																	? 'You said: '
																	: group.latest_message.from.firstname + ' said: '}
																{group.latest_message.content}
															</p>
														)}
													</div>

													<button className="edit-button" onClick={this.editGroup(group)}>
														<Edit />
													</button>
												</div>
											))}
										</div>
									)}
								</div>
							)}
						</div>
						<div className="messaging-convo">
							<div
								className={`messaging-chat ${
									!this.state.active_convo_user && !this.state.active_group ? 'no-chat' : ''
								}`}
								ref={this.chatWindow}
							>
								{this.state.active_convo_user ? (
									this.state.messages.map((msg, i) => (
										<Message
											key={msg.id}
											content={msg.content}
											date={msg.created_at}
											read={msg.read}
											side={+msg.from_id === user_id() ? 'us' : 'them'}
											showDate={this.state.messages.length - 1 === i}
											userPhoto={this.getUserPhoto(
												+msg.from_id === +user_id()
													? this.props.headerQuery.data.user
													: this.state.active_convo_user
											)}
										/>
									))
								) : this.state.active_group ? (
									this.state.messages.map((msg, i) => (
										<Message
											key={msg.id}
											content={msg.content}
											date={msg.created_at}
											read={msg.read}
											side={'us'}
											showDate={this.state.messages.length - 1 === i}
											userPhoto={this.getUserPhoto(msg.from)}
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

							{(this.state.active_convo_user || this.state.active_group) && (
								<form
									className={`messaging-form ${
										!this.state.scrollAtBottom &&
										(this.state.active_convo_user || this.state.active_group)
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
										disabled={!this.state.active_convo_user && !this.state.active_group}
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

export default BuildingMessaging
