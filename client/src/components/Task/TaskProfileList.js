
import React from 'react';
import { withRouter } from 'react-router-dom'
import PropTypes from 'prop-types'
import TaskProfileEntries from './TaskProfileEntries'
import resizeTextarea from '../../util/resizeTextarea'
import './TaskProfileList.css'

class TaskProfileListEntry extends React.Component {
  constructor(props) {
    super(props)
    let { row, rowData } = this.props
    this.state = {
      row,
      rowData
    }
    this.handleInput = this.handleInput.bind(this)
  }
  componentWillReceiveProps(nextProps) {
    let { row, rowData } = nextProps
    if (row !== this.state.row || rowData !== this.state.rowData) {
      this.setState({ row, rowData })
    }
  }
  componentDidUpdate(prevProps, prevState) {
    let { entryDataChanged } = this.props
    let { row, rowData } = this.state
    if (row !== prevState.row || rowData !== prevState.rowData) {
      entryDataChanged(rowData, row, 0)
    }
    //FIXME relies on knowing about class NowEditing
    let element = this.refs.TaskProfileListEntry
    let clz = element.className
    let nowEditing = clz.indexOf('NowEditing') >= 0
    let maxHeight = Math.max(Math.ceil(window.innerHeight*(nowEditing ? 0.5 : 0.1)),70)+'px'
    resizeTextarea(element, maxHeight)
  }
  handleInput(event) {
    let { value } = event.target
    this.setState({ rowData: value })
  }
  render() {
    let { addlClasses, disabled, multiline } = this.props
    let { rowData } = this.state
    let clz = 'TaskProfileTextarea ' + addlClasses
    if (multiline === true) {
      return <textarea className={clz} rows="2" value={rowData} disabled={disabled} onInput={this.handleInput} ref='TaskProfileListEntry' />
    } else {
      return <input className={clz} value={rowData} disabled={disabled} onInput={this.handleInput} ref='TaskProfileListEntry' />
    }
  }
}

class TaskProfileList extends React.Component {
  constructor(props) {
    super(props)
    this.updateEditingStatus = this.updateEditingStatus.bind(this)
    this.getNewEmptyRowData = this.getNewEmptyRowData.bind(this)
  }

  componentWillReceiveProps(nextProps) {
    let { categoryData } = nextProps
    let thisJson = JSON.stringify(this.props.categoryData)
    let nextJson = JSON.stringify(categoryData)
    if (thisJson !== nextJson) {
      this.setState({ categoryData })
    }
  }

  updateEditingStatus(params) {
    let { editingInProcess, newEntryData } = params
    this.props.updateEditingStatus({ editingInProcess, newCategoryData: { entries: newEntryData } })
  }

  getNewEmptyRowData() {
    return ''
  }

  render() {
    let { categoryData, store, multiline } = this.props
    return (
      <div className="TaskProfileList" >
        <TaskProfileEntries store={store} updateEditingStatus={this.updateEditingStatus} getNewEmptyRowData={this.getNewEmptyRowData}
          multiline={multiline} entryComponent={TaskProfileListEntry} entryData={categoryData.entries} />
      </div>
    );
  }
}

TaskProfileList.propTypes = {
  store: PropTypes.object.isRequired,
  multiline: PropTypes.bool.isRequired,
  categoryData: PropTypes.object.isRequired,
  updateEditingStatus: PropTypes.func.isRequired
}

export default withRouter(TaskProfileList);
