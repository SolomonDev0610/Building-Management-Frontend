import React from 'react'
import format from 'date-fns/format'
import distanceInWordsToNow from 'date-fns/distance_in_words_to_now'

const Message = props => (
	<div className={`message side-${props.side}`}>
		<img src={props.userPhoto} className="message-user-photo" alt="message" />
		<div className="message-inner" title={format(props.date, 'YYYY-MM-DD HH:mm:ss')}>
			<div className="message-content">
				<p>{props.content}</p>
				{/* <div className="message-date">{format(props.date, 'hh:mm a')}</div> */}
				<div className="message-details">
					<span className="message-date">{distanceInWordsToNow(props.date)} ago</span>
					{!props.read && <span className="unread">unread</span>}
				</div>
			</div>
		</div>
	</div>
)

export default Message
