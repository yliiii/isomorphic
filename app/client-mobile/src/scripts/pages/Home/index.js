import React, { Component as BaseComponent } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { getUserInfo } from './dispatch'

class Home extends BaseComponent {
  componentWillMount() {
    console.log('----componentWillMount')
  }

  componentDidMount() {
    console.log('----componentDidMount')
  }

  componentWillReceiveProps(nextProps) {
    const { nickName, userName } = nextProps
  }

  render() {
    const { nickName, userName, avatar } = this.props

    return (
      <div>
        <span onClick={this.handleClick}>Hello world!!!</span>
        <br/>
        <Link to='/m/my'>{nickName || userName || '我'}的首页</Link>
        {
          avatar
          ? <img src={avatar} alt={nickName || userName} />
          : null
        }
      </div>
    )
  }

  handleClick = () => {
    getUserInfo(333333)
  }
}

export default connect((state, ownProps) => ({
  ...state.global
}))(Home)