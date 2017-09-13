import React from 'react'
import { findDOMNode } from 'react-dom'
import { connect } from 'react-redux'

import BaseComponent from 'ui-base/Component'

import { getUserInfo, addUserList } from './dispatch'
import ContentList from './ContentList'
import AddUnit from './AddUnit'

import styles from './styles.styl'

class Home extends BaseComponent {
  constructor() {
    super()
    
    this.state = {
      isShowUnitOptional: false, // 是否显示单元选择列表（批量移动）
      isShowAddUnit: false, // 是否显示创建单元
      isMultiSelect: false, // 是否多选
      selectedUnitName: '', // 选中的单元
      selectedUnitId: '' // 选中的单元id
    }
  }

  componentWillMount() {
  }

  componentDidMount() {
    window.formatSort = this.refs['contentList'].formatSort
  }

  componentDidUpdate() {
    const { isShowAddUnit, isShowUnitOptional } = this.state
    const { contentList, unitOptional } = this.refs

    this.onClickComponentOutside({ // 用于关闭创建单元
      component: findDOMNode(contentList.refs['customSplit']),
      isBind: isShowAddUnit,
      onBind: () => {
        ('createUnit' in contentList.refs) && contentList.refs['createUnit'].doFocus()
        window.location.href = '#0' // 锚点定位
      },
      onClickOutside: () => {
        this.setState({ isShowAddUnit: false })
      }
    })

    this.onClickComponentOutside({ // 用于关闭单元选择列表
      component: findDOMNode(unitOptional),
      isBind: isShowUnitOptional,
      onClickOutside: () => {
        this.setState({ isShowUnitOptional: false })
      }
    })
  }

  componentWillReceiveProps(nextProps) {
  }

  render() {
    const { isMultiSelect } = this.state
    const { list } = this.props

    return (
      <div>
        {this.renderEditBar()}
        <ContentList
          dataArray={list}
          isMultiSelect={isMultiSelect}
          onSplit={this.renderCreateInUnitList}
          ref='contentList' />
        {this.renderBottom()}
      </div>
    )
  }

  renderEditBar = () => {
    const { isMultiSelect } = this.state
    const { list } = this.props
    const cls = this.componentGetClassNames(styles)

    return (
      <div className={cls('edit-bar')}>
        <div className={cls('btn')} onClick={() => this.setState({ isShowAddUnit: true })}>添加单元</div>
        {
          // 当没有单元的时候不会显示批量移动按钮
          list.length === 1 && (!list[0]['unitId'] || !list[0]['unitName'])
            ? null
            : <div className={cls('btn')} onClick={() => this.setState({ isMultiSelect: !isMultiSelect })}>批量移动</div>
        }
      </div>
    )
  }

  renderBottom = () => {
    const { isMultiSelect, isShowUnitOptional, selectedUnitName, selectedUnitId } = this.state
    const cls = this.componentGetClassNames(styles)

    return (
      <div className={cls('bottom')}>
        {
          isMultiSelect
          ? (
            <div className={cls('re-sort')}>
              <div className={cls('unit-optional')} ref='unitOptional'>
                <div className={cls('optoinal')} onClick={() => this.setState({ isShowUnitOptional: !isShowUnitOptional })}>
                  {selectedUnitName || '请选择单元'}
                </div>
                {
                  isShowUnitOptional
                  ? this.renderUnitOptional()
                  : null
                }
              </div>
              <div className={cls('btn-area')}>
                <div className={cls('btn')} onClick={this.moveTo}>确定</div>
                <div className={cls('btn')} onClick={() => this.setState({
                  isMultiSelect: false,
                  selectedUnitId: '',
                  selectedUnitName: ''
                })}>取消</div>
              </div>
            </div>
          )
          : null
        }
      </div>
    )
  }

  renderUnitOptional = () => {
    const { list } = this.props
    const cls = this.componentGetClassNames(styles)

    return list.length
      ? (
        <div className={cls('optoinal-list')}>
          {
            list.map((unit, idx) => {
              const { unitId, unitName } = unit

              return unitId && unitName
                ? <div className={cls('unit-item')} onClick={() => this.setState({
                    selectedUnitName: unitName,
                    selectedUnitId: unitId,
                    isShowUnitOptional: false
                  })} key={unitId}>{unitName}</div>
                : null
            })     
          }
        </div>
      ) : null
  }

  renderCreateInUnitList = (idx) => {
    const { isShowAddUnit } = this.state
    return isShowAddUnit ? <AddUnit index={idx} onConfirm={() => this.setState({ isShowAddUnit: false })} ref='createUnit' /> : null
  }

  moveTo = () => {
    const { selectedUnitId } = this.state
    const { contentList } = this.refs

    selectedUnitId && selectedUnitId != 0 && contentList && contentList.moveTo({ unitId: selectedUnitId, ids: contentList.getSelectedIds() })
    
    this.setState({
      isMultiSelect: false,
      selectedUnitId: '',
      selectedUnitName: ''
    })
  }
}

export default connect((state, ownProps) => ({
  ...state.content
}))(Home)