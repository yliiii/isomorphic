import React from 'react'
import BaseComponent from 'ui-base/Component'
import { connect } from 'react-redux'

class My extends BaseComponent {
  render() {
    const { avatar, nickName, userName } = this.props

    return (
      <div>
        <div>Hello {nickName || userName || 'my world'}!!!</div>
          {
            avatar
            ? <img src={avatar} alt={nickName || userName} />
            : null
          }
      </div>
    )
  }
}

export default connect((state, ownProps) => ({
  ...state.global
}))(My)