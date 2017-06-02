import React from 'react'
import BaseComponent from 'ui-base/Component'
import { createUnit, addContentUnit } from './dispatch'

import styles from './styles.styl'

export default class AddUnit extends BaseComponent {
  static defaultProps = {
    placeholder: '',
    index: -1, // 需要插入的位置
    onBlur: () => {},
    onFocus: () => {}
  }

  constructor() {
    super()

    this.state = {
      value: ''
    }
  }

  componentWillReceiveProps(nextProps) {
  }

  render() {
    const { placeholder } = this.props

    return (
      <div>
        <input type='text'
          value={this.state.value}
          onChange={this.handleChange}
          onBlur={this.handleBlur}
          onFocus={this.handleFocus}
          placeholder={placeholder}
          onKeyPress={this.handleSubmit}
          ref='input'/>
      </div>
    )
  }

  getValue = () => {
    return this.state.value
  }

  handleChange = e => {
    this.setState({ value: e.target.value.trim() })
  }

  handleBlur = e => {
    const { value } = this.state

    if (this.props.onBlur(value) === false) return

    this.handleConfirm()
  }

  handleFocus = () => {
    const { value } = this.state
    this.props.onFocus(value)
  }

  handleSubmit = (e) => {
    if (e.type === 'keypress' && e.key === 'Enter') {
      this.handleConfirm()
    }
  }

  handleConfirm = () => {
    const { value } = this.state
    const { index } = this.props

    if ((value + '')) {
      createUnit({ unitName: value }, {
        success: ({ payload }) => {
          addContentUnit({ ...payload, index })
          this.props.onConfirm(value)
        }
      })
    }
  }

  doFocus = () => {
    this.refs.input && setTimeout(() => this.refs.input.focus(), 200)
  }
}