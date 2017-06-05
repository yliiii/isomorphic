import React from 'react'
import { findDOMNode } from 'react-dom'
import * as DOM from 'utils/dom-utils'
import BaseComponent from 'ui-base/Component'
import Sortable from 'ui-base/Sortable'
import { reSortContent } from '../dispatch'

import ContentItem from './Item'

import styles from '../styles.styl'

export default class ContentList extends BaseComponent {
  static defaultProps = {
    dataArray: [],
    isMultiSelect: false, // 是否为选择模式
    onSplit: () => {}, // 在分界线时触发，返回一个react对象
    onSelected: () => {} // 操作checkbox时触发
  }

  constructor() {
    super()

    this.unitData = {}
    this.state = {
      selectedIds: []
    }
  }


  componentWillReceiveProps(nextProps) {
    const { isMultiSelect } = nextProps

    !isMultiSelect && this.setState({ selectedIds: [] }) // 切换多选状态的时候需要重置选中id
  }

  render() {
    return this.renderUnitList()
  }
  
  renderUnitList = () => {
    const { dataArray, onSplit } = this.props
    const cls = this.componentGetClassNames(styles)

    return (
      <div className={cls('unit-list')}>
        {
          dataArray.length
          ? dataArray.map((unit, idx) => {
            const { unitId, unitName, contentList } = unit

            return (
              <div id={unitId} className={cls('unit')} data-id={unitId} key={unitId}>
                {
                  unitId && unitName
                  ? <div className={cls('title')}>{unitName}</div>
                  : (
                    <div>
                      <div ref='customSplit'>{onSplit(idx)}</div>
                      <div className={cls('split-line')}></div>
                    </div>
                  )
                }
                {this.renderContentList(unitId, contentList)}
              </div>
            )
          }) : null
        }
      </div>
    )
  }

  renderContentList = (unitId, list = []) => {
    const { reStyles, isMultiSelect } = this.props
    const cls = this.componentGetClassNames(styles)
    const options = {
      group: unitId || 'unit',
      disabled: isMultiSelect,
      filter: '.' + cls('more'),
      onStart: e => {
        const { item } = e
        const contentId = item.getAttribute('data-id')
        
        if (contentId && this.refs[contentId]) {
          this.refs[contentId].cleanHover() // 清除悬停事件
        }
      }
    }
    
    this.unitData[unitId] = []
    
    return (
      <Sortable reStyles={styles} className={cls('sort')} options={options} ref={unitId}>
        {
          list.length 
            ? list.map(content => {
              const { contentId, contentName } = content

              this.unitData[unitId].push(contentId)

              return <ContentItem
                { ...content }
                reStyles={reStyles}
                isMultiSelect={isMultiSelect}
                onChange={this.handleChecked}
                ref={contentId}
                key={contentId}/>
            }) : null
        }
      </Sortable>
    )
  }

  handleChecked = (isChecked, content = {}) => {
    const { contentId } = content
    const selectedIds = [ ...this.state.selectedIds ]
    
    if (isChecked) {
      selectedIds.push(contentId)
    } else {
      let idx = selectedIds.indexOf(contentId)
      selectedIds.splice(idx, 1)
    }

    this.setState({ selectedIds }, () => this.props.onSelected(this.state.selectedIds))
  }

  moveTo = ({ unitId, ids }) => {
    reSortContent({ unitId, ids })
  }

  getSelectedIds = () => {
    return this.state.selectedIds
  }

  formatSort = () => {
    const keys = Object.keys(this.unitData)
    const sort = []

    keys.length && keys.forEach(unitId => {
      let contentList = this.unitData[unitId]

      if (unitId in this.refs) {
        contentList = this.refs[unitId].getSortArray()
      }

      sort.push({
        unitId,
        contentList
      })
    })

    return sort
  }
}