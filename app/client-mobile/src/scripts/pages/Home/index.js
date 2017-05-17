import React, { Component as BaseComponent } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'

import globalActions from 'actions/global'

export async function initServerData(id) { // server直出初始化数据
  try {
    let data = await globalActions.getUserInfo({ userId: id || 111 })
    return Promise.resolve(data)
  } catch (e) {
    return Promise.reject(e)
  }
}

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
    const { nickName, userName } = this.props

    return (
      <div>
        <span onClick={this.handleClick}>Hello world!!!</span>
        <br/>
        <Link to='/m/my'>{nickName || userName || '我'}的首页</Link>
      </div>
    )
  }

  handleClick = () => {debugger
    initServerData(333333)
  }
}

export default connect((state, ownProps) => {
  debugger
  return {
    ...state.global
  }
})(Home)