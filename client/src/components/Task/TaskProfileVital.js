
import React from 'react';
import { withRouter } from 'react-router-dom'
import PropTypes from 'prop-types'
import resizeTextarea from '../../util/resizeTextarea'
import TaskProfileEditableEntry from './TaskProfileEditableEntry'
import './TaskProfileVital.css'

class TaskProfileVitalTextEntry extends React.Component {
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
    if (row !== this.props.row || rowData !== this.state.rowData) {
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
    let element = this.refs.TaskProfileBasicTextareaEntry
    if (element) {
      let clz = element.className
      let nowEditing = clz.indexOf('NowEditing') >= 0
      let maxHeight = Math.max(Math.ceil(window.innerHeight*(nowEditing ? 0.5 : 0.1)),70)+'px'
      resizeTextarea(element, maxHeight)
    }

  }
  handleInput(event) {
    let { value } = event.target
    this.setState({ rowData: value })
  }
  render() {
    let { addlClasses, disabled, placeholder, pattern, multiline } = this.props
    let { rowData } = this.state
    let clz = 'TaskProfileSimpleTextEntry ' + addlClasses
    if (multiline === true) {
      return <textarea rows="2" className={clz} value={rowData} disabled={disabled} placeholder={placeholder}
        pattern={pattern} onInput={this.handleInput} ref='TaskProfileBasicTextareaEntry' />
    } else {
      return <input className={clz} value={rowData} disabled={disabled} placeholder={placeholder}
        pattern={pattern} onInput={this.handleInput} ref='TaskProfileVitalTextEntry' />
    }
  }
}

class TaskProfileVital extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      nowEditing: null,
      categoryData: this.props.categoryData
    }
    this.updateEditingStatus = this.updateEditingStatus.bind(this)
    this.onClickEditEntry = this.onClickEditEntry.bind(this)
    this.onClickSaveEntry = this.onClickSaveEntry.bind(this)
    this.onClickRevertEntry = this.onClickRevertEntry.bind(this)
    this.entryDataChanged = this.entryDataChanged.bind(this)
    this.nullFunc = this.nullFunc.bind(this)
  }

  updateEditingStatus(params) {
    let { editingInProcess, newCategoryData } = params
    this.props.updateEditingStatus({ editingInProcess, newCategoryData })
  }

  componentDidUpdate() {
    let control = document.querySelector('.TaskProfile .NowEditing')
    if (control) {
      control.focus()
    }
  }

  componentWillReceiveProps(nextProps) {
    let { categoryData } = nextProps
    let thisJson = JSON.stringify(this.props.categoryData)
    let nextJson = JSON.stringify(categoryData)
    if (thisJson !== nextJson) {
      this.setState({ categoryData })
    }
  }

  onClickEditEntry(e) {
    e.preventDefault()
    e.stopPropagation()
    let { categoryData } = this.state
    let current = e.currentTarget;
    let indexString = current.getAttribute('data-entry-index')
    this.setState({ nowEditing: indexString, savedNowEditing: categoryData[indexString] })
    this.updateEditingStatus({ editingInProcess: true, newCategoryData: categoryData })
  }

  onClickSaveEntry(e)  {
    e.preventDefault()
    this.setState({ nowEditing: null, savedNowEditing: null })
    this.updateEditingStatus({ editingInProcess: false, newCategoryData: this.state.categoryData })
  }

  onClickRevertEntry(e) {
    e.preventDefault()
    let { nowEditing, savedNowEditing, categoryData } = this.state
    let newCategoryData = JSON.parse(JSON.stringify(categoryData))
    newCategoryData[nowEditing] = savedNowEditing
    this.setState({ nowEditing: null, savedNowEditing: null, categoryData: newCategoryData })
    this.updateEditingStatus({ editingInProcess: false, newCategoryData })
  }

  entryDataChanged(newValue, row) {
    let { categoryData } = this.state
    let thisJson = JSON.stringify()
    let newJson = JSON.stringify(newValue)
    if (newValue !== categoryData[row]) {
      let newData = JSON.parse(JSON.stringify(categoryData))
      newData[row] = newValue
      this.setState({ categoryData: newData })
    }
  }

  nullFunc(e) {
    e.preventDefault()
  }

  render() {
    let { store } = this.props
    let { categoryData, nowEditing } = this.state
    let none = { display: 'none' }
    let hidden = { visibility: 'hidden' }
    let legalDisabled = nowEditing === 'legalName'  ? false : true
    let dobDisabled = nowEditing === 'dob'  ? false : true
    let otherVitalDisabled = nowEditing === 'otherVital'  ? false : true
    let legalEntryClasses = nowEditing === 'legalName'  ? 'NowEditing' : ''
    let dobEntryClasses = nowEditing === 'dob'  ? 'NowEditing' : ''
    let otherVitalEntryClasses = nowEditing === 'otherVital'  ? 'NowEditing' : ''
    let legalEditStyle = nowEditing === 'legalName'  ? none : {}
    let dobEditStyle = nowEditing === 'dob'  ? none : {}
    let otherVitalEditStyle = nowEditing === 'otherVital'  ? none : {}
    let legalOkCancelStyle = nowEditing === 'legalName'  ? {} : hidden
    let dobOkCancelStyle = nowEditing === 'dob'  ? {} : hidden
    let otherVitalOkCancelStyle = nowEditing === 'otherVital'  ? {} : hidden
    let placeholder = nowEditing === null ? '(press "Edit" to enter a value)' : ''
    return (
      <div className="TaskProfileVital">
        <div className="TaskProfileBasicLegalName">
          <label>
            <div className="TaskProfileEntry">
              <TaskProfileEditableEntry dataIndex='legalName' disabled={legalDisabled}
                labelText='Legal name' placeholder={placeholder}
                entryClasses={legalEntryClasses} entryComponent={TaskProfileVitalTextEntry} entryData={categoryData.legalName} entryDataChanged={this.entryDataChanged}
                labelStyle={{}} editStyle={legalEditStyle} okCancelStyle={legalOkCancelStyle} upStyle={hidden} downStyle={hidden} removeStyle={hidden}
                editFunc={this.onClickEditEntry} okFunc={this.onClickSaveEntry} cancelFunc={this.onClickRevertEntry}
                upFunc={this.nullFunc} downFunc={this.nullFunc} removeFunc={this.nullFunc} />
            </div>
          </label>
        </div>
        <div className="TaskProfileBasicDOB">
          <label>
            <div className="TaskProfileEntry">
              <TaskProfileEditableEntry dataIndex='dob' disabled={dobDisabled}
                labelText='Birth date (yyyy-mm-dd)' pattern='^(\d{4})\D?(0[1-9]|1[0-2])\D?([12]\d|0[1-9]|3[01])$' placeholder={placeholder}
                entryClasses={dobEntryClasses} entryComponent={TaskProfileVitalTextEntry} entryData={categoryData.dob} entryDataChanged={this.entryDataChanged}
                labelStyle={{}} editStyle={dobEditStyle} okCancelStyle={dobOkCancelStyle} upStyle={hidden} downStyle={hidden} removeStyle={hidden}
                editFunc={this.onClickEditEntry} okFunc={this.onClickSaveEntry} cancelFunc={this.onClickRevertEntry}
                upFunc={this.nullFunc} downFunc={this.nullFunc} removeFunc={this.nullFunc} />
            </div>
          </label>
        </div>
        <div className="TaskProfileBasicOtherVital">
          <label>
            <TaskProfileEditableEntry dataIndex='otherVital' disabled={otherVitalDisabled} multiline={true}
              labelText='Other vital information, such as place of birth or date of death' placeholder={placeholder}
              entryClasses={otherVitalEntryClasses} entryComponent={TaskProfileVitalTextEntry} entryData={categoryData.otherVital} entryDataChanged={this.entryDataChanged}
              labelStyle={{}} editStyle={otherVitalEditStyle} okCancelStyle={otherVitalOkCancelStyle} upStyle={hidden} downStyle={hidden} removeStyle={hidden}
              editFunc={this.onClickEditEntry} okFunc={this.onClickSaveEntry} cancelFunc={this.onClickRevertEntry}
              upFunc={this.nullFunc} downFunc={this.nullFunc} removeFunc={this.nullFunc} />
          </label>
        </div>
      </div>
    );
  }
}

TaskProfileVital.propTypes = {
  store: PropTypes.object.isRequired,
  categoryData: PropTypes.object.isRequired,
  updateEditingStatus: PropTypes.func.isRequired
}

export default withRouter(TaskProfileVital);
