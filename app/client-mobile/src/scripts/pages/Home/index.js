import React, { Component as BaseComponent } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'

class Home extends BaseComponent {
  render() {
    const { name } = this.props

    return (
      <div>
        Hello world!!!
        <br/>
        <Link to='/m/my'>{name || '我'}的首页</Link>
      </div>
    )
  }
}

export default connect((state, ownProps) => {
  return {
    ...state.global
  }
})(Home)