
import React, {Component} from 'react'
import { getGlobalState } from 'controller/constsCtl'

export default class Lazyload extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isInit: false
    }
  }

  componentWillMount() {
    this.load(this.props)
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.load !== this.props.load) {
      this.load(nextProps)
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    const { isInit } = nextState

    if (isInit) {
      const preloadWrapper = document.getElementById(getGlobalState('serverWrap'))
      // preloadWrapper && document.body.removeChild(preloadWrapper) // 移除server render的内容
    }

    return true
  }

  load = (props) => {
    this.setState({
      mod:null
    })

    props.load((mod) => {
      this.setState({
        mod: mod.default ? mod.default : mod,
        isInit: true
      })
    })
  }

  render() {
    return this.props.children(this.state.mod)
  }
}