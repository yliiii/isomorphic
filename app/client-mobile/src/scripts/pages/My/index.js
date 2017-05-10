import React, { Component as BaseComponent } from 'react'
import { connect } from 'react-redux'

class My extends BaseComponent {
  render() {
    const { name } = this.props

    return (
      <div>Hello {name || 'my world'}!!!</div>
    )
  }
}

export default connect((state, ownProps) => ({
  ...state.global
}))(My)