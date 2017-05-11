import React, { Component as BaseComponent } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'

import globalActions from 'actions/global'

class Home extends BaseComponent {
  componentWillMount() {
  }

  componentWillReceiveProps(nextProps) {
    const { name } = nextProps
  }

  render() {
    const { name } = this.props

    return (
      <div>
        <span onClick={this.handleClick}>Hello world!!!</span>
        <br/>
        <Link to='/m/my'>{name || '我'}的首页</Link>
      </div>
    )
  }

  handleClick = () => {
    globalActions.getAuthInfo({
      name: 'yli'
    })
  }
}

export default connect((state, ownProps) => ({
  ...state.global
}))(Home)