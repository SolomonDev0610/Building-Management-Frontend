import React from 'react'
import './PersonCard.style.scss'
import { Paper, Button } from '@material-ui/core'
import { MailOutline, Phone } from '@material-ui/icons'
import config from 'config'
import defaultUserPhoto from 'assets/img/default-user.png'

export default class PersonCard extends React.Component {
	static defaultProps = {
		buttons: [],
		style: {},
	}

	render() {
		let { firstname, lastname, phone, email, image, title, className, buttons, style } = this.props

		return (
			<Paper className={`pb-person-card ${className}`} style={style}>
				<div className="details d-flex">
					<div className="image-col d-flex align-items-center">
						<div
							className="image"
							style={{
								backgroundImage: `url(${image ? config.URL + image : defaultUserPhoto})`,
							}}
						/>
					</div>
					<div className="detail-col  align-items-start justify-content-center">
						<h3>{title}</h3>
						<h2>
							{firstname} {lastname}
						</h2>
						{phone !== 'N/A' ? (
							<div className="bullet row d-flex justify-content-start align-items-center pl-15 pr-20">
								<Phone />
								<span>{phone}</span>
							</div>
						) : null}

						{email !== 'N/A' ? (
							<div className="bullet row d-flex justify-content-start align-items-center pl-15 pr-20">
								<MailOutline />
								<span>{email}</span>
							</div>
						) : null}
					</div>
				</div>
				{buttons.length > 0 ? (
					<div className="actions">
						{buttons
							.filter(x => x)
							.map((r, i) => (
								<Button key={i} variant="contained" color="primary" onClick={r.onClick} size="large">
									{r.name}{' '}
									{r.name === 'Message' ? <MailOutline style={{ marginLeft: '7px' }} /> : null}
								</Button>
							))}
					</div>
				) : null}
			</Paper>
		)
	}
}
