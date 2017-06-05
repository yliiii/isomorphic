import React from 'react'
import BaseComponent from 'ui-base/Component'

import styles from '../styles.styl'

export default class ListItem extends BaseComponent {
  static defaultProps = {
    isMultiSelect: false,
    contentId: 0,
    contentName: '',
    onChange: () => {}
  }

  constructor() {
    super()

    this.hoverT = 0
    this.state = {
      isShowMore: false,
      isChecked: false
    }
  }

  componentWillReceiveProps(nextProps) {
    const { isMultiSelect } = this.props
    const { isMultiSelect: nextIsMultiSelect } = nextProps

    if (!isMultiSelect || isMultiSelect !== nextIsMultiSelect) {
      this.setState({ isChecked: false })
    }
  }

  render() {
    const { isChecked, isShowMore } = this.state
    const { reStyles, isMultiSelect, ...args } = this.props
    const { contentId, contentName } = args
    const cls = this.componentGetClassNames(styles, reStyles)

    return (
      <div className={cls('item')}
        data-id={contentId}
        onMouseOver={e => this.handleHover(true)}
        onMouseOut={e => this.handleHover(false)}>
        <label>
          {
            isMultiSelect
            ? <input
              type='checkbox'
              name='content'
              checked={!!isChecked}
              onChange={this.handleChecked} />
            : null
          }
          {`${contentName} - (${contentId})`}
        </label>
        {
          isShowMore
          ? <div className={cls('more')}>更多</div>
          : null
        }
      </div>
    )
  }

  handleChecked = (e) => {
    const { target } = e
    const { isMultiSelect, onChange, ...args  } = this.props

    this.setState({ isChecked: target.checked }, () => onChange(this.state.isChecked, args))
  }

  handleHover = (status) => {
    clearTimeout(this.hoverT)

    if (status) {
      this.hoverT = setTimeout(() => {
        this.setState({ isShowMore: true })
      }, 500)
    } else {
      this.setState({ isShowMore: false })
    }
  }

  cleanHover = () => {
    clearTimeout(this.hoverT)
  }
}