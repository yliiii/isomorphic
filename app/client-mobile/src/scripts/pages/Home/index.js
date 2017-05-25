import React from 'react'
import BaseComponent from 'ui-base/Component'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { getUserInfo } from './dispatch'

import Dragger from 'ui-base/Dragger'

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
    const { list } = this.props
    const cls = this.componentGetClassNames(styles)

    return (
      <div className={cls('list')}>
        <Dragger>
          {
            list.length
            ? list.map(info => {
              const { nickName, userId, userName } = info

              return (
                <div className={cls('item')} key={userId}>
                  <span>{nickName}</span>
                </div>
              )
            }) : null
          }
        </Dragger>
      </div>
    )
  }
}

export default connect((state, ownProps) => ({
  ...state.global
}))(Home)