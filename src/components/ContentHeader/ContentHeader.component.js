import React from 'react'
import './ContentHeader.style.scss'
import { IconButton, Button } from '@material-ui/core'
import { ArrowBack, ChevronRight, Add } from '@material-ui/icons'
import { withRouter, Link } from 'react-router-dom'

@withRouter
class ContentHeader extends React.Component {
	static defaultProps = {
		title: 'Page Title',
		addbutton: { visible: false, onClick: () => {} },
		visibleBack: false,
		breadcrumb: [],
	}

	render() {
		let { visibleBack, addbutton, breadcrumb, title, standalone } = this.props

		let backLink = breadcrumb.length
			? breadcrumb
					.slice(0)
					.reverse()
					.find(x => x.link).link
			: ''

		return (
			<React.Fragment>
				{title !== 'Dashboard' ? (
					<div
						className={`pb-content-header-comp ${visibleBack ? 'm-0' : ''}`}
						style={
							standalone
								? {
										paddingLeft: '1em',
										paddingRight: '1em',
								  }
								: {}
						}
					>
						{visibleBack ? (
							<div className="pb-back-button">
								<IconButton component={Link} to={backLink}>
									<ArrowBack />
								</IconButton>
							</div>
						) : null}
						<div className="pb-title-wrapper">
							<span>{title}</span>
						</div>
						{addbutton && addbutton.visible ? (
							<div className="actions">
								<Button variant="contained" color="primary" onClick={addbutton.onClick}>
									{addbutton.label} <Add />
								</Button>
							</div>
						) : null}
						<div className="filler" />
						<div className="pb-breadcrumb">
							{breadcrumb.map((crumb, i) => (
								<React.Fragment key={i}>
									{crumb.link ? (
										<Link
											to={crumb.link || this.props.match.url}
											className={`pb-breadcrumb-item active`}
										>
											<span>{crumb.name}</span>
										</Link>
									) : (
										<div className="pb-breadcrumb-item">
											<span>{crumb.name}</span>
										</div>
									)}
									{i < breadcrumb.length - 1 ? <ChevronRight /> : null}
								</React.Fragment>
							))}
						</div>
					</div>
				) : (
					<div className="pb-content-header-comp-empty" />
				)}
			</React.Fragment>
		)
	}
}

export default ContentHeader
