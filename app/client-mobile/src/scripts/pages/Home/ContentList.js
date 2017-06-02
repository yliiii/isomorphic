import React from 'react'
import BaseComponent from 'ui-base/Component'
import Sortable from 'ui-base/Sortable'
import { reSortContent } from './dispatch'

import styles from './styles.styl'

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
      selectedIds: [],
      isChecked: {}
    }
  }

  componentWillReceiveProps(nextProps) {
    const { isMultiSelect } = nextProps

    !isMultiSelect && this.setState({ isChecked: {}, selectedIds: [] })
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
    const { isMultiSelect } = this.props
    const cls = this.componentGetClassNames(styles)
    const options = {
      group: unitId || 'unit',
      disabled: isMultiSelect
    }
    
    this.unitData[unitId] = []
    
    return (
      <Sortable className={cls('sort')} options={options} ref={unitId}>
        {
          list.length 
            ? list.map(content => {
              const { contentId, contentName } = content

              this.unitData[unitId].push(contentId)

              return (
                <div className={cls('item')} data-id={contentId} key={contentId}>
                  <label>
                    {
                      isMultiSelect
                      ? <input
                        type='checkbox'
                        name='content'
                        checked={!!this.state.isChecked[contentId]}
                        onChange={(e) => this.handleChecked(e, contentId)} />
                      : null
                    }
                    {`${contentName} - (${contentId})`}
                  </label>
                </div>
              )
            }) : null
        }
      </Sortable>
    )
  }

  handleChecked = (e, contentId) => {
    const { isChecked } = this.state
    const selectedIds = [ ...this.state.selectedIds ]
    const target = e.target
    
    if (target.checked) {
      selectedIds.push(contentId)
    } else {
      let idx = selectedIds.indexOf(contentId)
      selectedIds.splice(idx, 1)
    }

    isChecked[contentId] = target.checked

    this.setState({ 
      selectedIds,
      isChecked
    }, () => this.props.onSelected(this.state.selectedIds))
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