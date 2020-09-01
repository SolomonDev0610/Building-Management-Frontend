import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import { Button, Paper, TextField, InputAdornment } from '@material-ui/core'
import { Search, Add } from '@material-ui/icons'
import DashCard from 'components/DashCard/DashCard.component'
import './BuildingCards.style.scss'
import placeholderImg from 'assets/img/catalog-default-img.gif'
import config from 'config'

@withRouter
class BuildingCards extends Component {
	state = {
		searchBuildings: '',
		searchTenancies: '',
	}

	__handleChangeTextBuildingSearch = evt => {
		this.setState({ searchBuildings: evt.target.value })
	}

	__getTenancyid = (id, is_pinned) => {
		this.props.onSwitchPinnedTenancy(id, is_pinned)
	}

	render() {
		let { searchBuildings } = this.state
		let { data } = this.props

		let buildings = data.filter(building => {
			return (
				building.name.toLowerCase().indexOf(searchBuildings.toLowerCase()) !== -1 ||
				building.street_address.toLowerCase().indexOf(searchBuildings.toLowerCase()) !== -1 ||
				building.postcode.toLowerCase().indexOf(searchBuildings.toLowerCase()) !== -1
			)
		})

		return (
			<div className="component-list-wrapper">
				<div className="component-list-head">
					<Button
						variant="contained"
						color="primary"
						onClick={() => {
							this.props.history.push('/building/new')
						}}
					>
						ADD Building
						<Add />
					</Button>

					<Paper style={{ flex: 1, overflow: 'hidden' }}>
						<TextField
							fullWidth
							onChange={this.__handleChangeTextBuildingSearch}
							id="simple-state-adorment"
							value={this.state.searchBuildings}
							placeholder="Search by building name or post code..."
							InputProps={{
								disableUnderline: true,
								startAdornment: (
									<InputAdornment position="start">
										<Search />
									</InputAdornment>
								),
							}}
						/>
					</Paper>
				</div>

				<div className="component-list-body">
					{searchBuildings && !buildings.length ? (
						<div style={{ margin: 'auto', textAlign: 'center' }}>
							<p>
								No buildings match the search term "<b>{searchBuildings}</b>".
							</p>
							<Button
								variant="contained"
								color="primary"
								onClick={() => {
									this.props.history.push('/building/new')
								}}
							>
								ADD Building
								<Add />
							</Button>
						</div>
					) : (
						<div className="list-card-wrapper">
							{buildings.map(item => (
								<DashCard
									key={item.id}
									isbuildingView={false}
									image={item.photo ? config.URL + item.photo.path : placeholderImg}
									title={item.name}
									description={item.street_address}
									statNum={item.tenancies.length}
									statDetail="Tenancies"
									handleClick={() => {
										this.props.history.push(`/building/${item.id}`)
									}}
								/>
							))}
						</div>
					)}
				</div>
			</div>
		)
	}
}

export default BuildingCards
