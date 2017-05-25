import React from 'react'
import BaseComponent from 'ui-base/Component'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { getUserInfo } from './dispatch'
import styles from './styles.styl'

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
    const cls = this.componentGetClassNames(styles)

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
        <div className={cls('bg')}>
          asdf
        </div>
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