import React from 'react'
import './Form.style.scss'
import 'assets/scss/custom/_pb_forms.scss'

export default class InfoCard extends React.Component {
  constructor(props) {
    super(props)
    this.state = {}
  }
  render() {
    return (
      <div className="pb-form-container p-0">
        <div className="pb-form-wrapper">{this.props.children}</div>
      </div>
    )
  }
}
