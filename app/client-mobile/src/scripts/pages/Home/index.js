import React, { Component as BaseComponent } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'

import globalActions from 'actions/global'

class Home extends BaseComponent {
  componentWillMount() {
  }

  componentWillReceiveProps(nextProps) {
    const { nickName, userName } = nextProps
  }

  initData = () => {
    globalActions.getUserInfo({ userId: 23403752 })
  }

  render() {
    const { nickName, userName } = this.props

    return (
      <div>
        <span onClick={this.handleClick}>Hello world!!!</span>
        <br/>
        <Link to='/m/my'>{nickName || userName || '我'}的首页</Link>
      </div>
    )
  }

  handleClick = () => {
    globalActions.getUserInfo({ userId: 23403752 })
  }
}

export default connect((state, ownProps) => ({
  ...state.global
}))(Home)