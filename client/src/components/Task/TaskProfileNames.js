
import React from 'react';
import { withRouter } from 'react-router-dom'
import PropTypes from 'prop-types'
import TaskProfileEntries from './TaskProfileEntries'
import substituteVariables from '../../util/substituteVariables'
import './TaskProfileNames.css'

class TaskProfileNameTextEntry extends React.Component {
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
  }
  handleInput(event) {
    let { value } = event.target
    this.setState({ rowData: value })
  }
  render() {
    let { addlClasses, disabled } = this.props
    let { rowData } = this.state
    let clz = 'TaskProfileSimpleTextEntry ' + addlClasses
    return <input className={clz} value={rowData} disabled={disabled} onInput={this.handleInput} ref='TaskProfileNameTextEntry' />
  }
}

class TaskProfileNames extends React.Component {
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
    let { categoryData, store, qualifier } = this.props
    let storeState = store.getState()
    let { profileCategories } = storeState.tasks
    let { variables } = profileCategories
    let legalName = categoryData.legalName || '<em>(not yet provided)</em>'
    let otherNamesLabel = substituteVariables('Provide all other names by which ((this person)) ((is)) known to the general public.', variables, qualifier)
    return (
      <div className="TaskProfileNames">
        <div className="TaskProfileNamesLegalName">
          <label>
            <div className="TaskProfileNamesLabel">Legal name: {legalName}</div>
          </label>
        </div>
        <div className="TaskProfileNamesOtherNames">
          <div className="TaskProfileNamesOtherNamesLabel">
            {otherNamesLabel}
          </div>
          <TaskProfileEntries store={store} updateEditingStatus={this.updateEditingStatus} getNewEmptyRowData={this.getNewEmptyRowData}
            entryComponent={TaskProfileNameTextEntry} entryData={categoryData.entries} />
        </div>
      </div>
    );
  }
}

TaskProfileNames.propTypes = {
  store: PropTypes.object.isRequired,
  categoryData: PropTypes.object.isRequired,
  updateEditingStatus: PropTypes.func.isRequired,
  qualifier: PropTypes.string.isRequired
}

export default withRouter(TaskProfileNames);
