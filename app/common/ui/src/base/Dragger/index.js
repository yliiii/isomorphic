import React from 'react'
import { findDOMNode } from 'react-dom';
import BaseComponent from '../Component'
import Sortable from 'sortablejs'

import styles from './styles.styl'

const IS_TOUCH = typeof __SERVER__ === 'undefined' ? ('ontouchstart' in document) : false
const EVENT ={
  START: IS_TOUCH ? 'touchstart' : 'mousedown',
  END: IS_TOUCH ? 'touchend' : 'mouseup',
  MOVE: IS_TOUCH ? 'touchmove': 'mousemove',
}

export default class Dragger extends BaseComponent {
  static defaultProps = {
    isVertical: true
  }

  constructor() {
    super()
    
    this.sortable = null
  }

  shouldComponentUpdate(nextProps, nextState) {

  }

  componentDidMount() {
    const container = findDOMNode(this)
    this.sortable = Sortable.create(container)
    debugger
  }

  render() {
    const { children } = this.props

    return <div>{ children }</div>
  }
}