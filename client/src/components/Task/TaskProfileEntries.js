
import React from 'react';
import { withRouter } from 'react-router-dom'
import PropTypes from 'prop-types'
import TaskProfileEditableEntry from './TaskProfileEditableEntry'
import './TaskProfileEntries.css'

class TaskProfileEntries extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      nowEditing: null,
      entryComponent: this.props.entryComponent,
      entryData: this.props.entryData
    }
    this.onClickAddEntry = this.onClickAddEntry.bind(this)
    this.onClickEditEntry = this.onClickEditEntry.bind(this)
    this.onClickSaveEntry = this.onClickSaveEntry.bind(this)
    this.onClickRevertEntry = this.onClickRevertEntry.bind(this)
    this.onClickMoveUp = this.onClickMoveUp.bind(this)
    this.onClickMoveDown = this.onClickMoveDown.bind(this)
    this.onClickDeleteEntry = this.onClickDeleteEntry.bind(this)
    this.entryDataChanged = this.entryDataChanged.bind(this)
  }

  componentWillReceiveProps(nextProps) {
    let { entryComponent, entryData } = nextProps
    let thisValue = this.props.entryData
    let nextValue = entryData
    if (typeof thisValue === 'object' || Array.isArray(thisValue)) {
      thisValue = JSON.stringify(thisValue)
      nextValue = JSON.stringify(nextValue)
    }
    if (entryComponent !== this.props.entryComponent || nextValue !== thisValue) {
      this.setState({ entryComponent, entryData })
    }
  }

  componentDidUpdate() {
    let control = document.querySelector('.TaskProfile .NowEditing')
    if (control) {
      control.focus()
    }
  }

  onClickAddEntry(e) {
    e.preventDefault()
    e.stopPropagation()
    let { entryData } = this.state
    let { updateEditingStatus } = this.props
    let newEntryData = JSON.parse(JSON.stringify(entryData))
    let blankRow = this.props.getNewEmptyRowData()
    newEntryData.push(blankRow)
    this.setState({ nowEditing: newEntryData.length-1, savedNowEditing:'', entryData: newEntryData })
    updateEditingStatus({ editingInProcess: true, newEntryData: newEntryData })
  }

  onClickEditEntry(e) {
    e.preventDefault()
    e.stopPropagation()
    let { entryData } = this.state
    let { updateEditingStatus } = this.props
    let current = e.currentTarget;
    let indexString = current.getAttribute('data-entry-index')
    let index = parseInt(indexString, 10)
    this.setState({ nowEditing: index, savedNowEditing: entryData[index] })
    updateEditingStatus({ editingInProcess: true, newEntryData: entryData })
  }

  onClickSaveEntry(e)  {
    e.preventDefault()
    this.setState({ nowEditing: null, savedNowEditing: null })
    this.props.updateEditingStatus({ editingInProcess: false, newEntryData: this.state.entryData })
  }

  onClickRevertEntry(e) {
    e.preventDefault()
    let { nowEditing, savedNowEditing, entryData } = this.state
    let newEntryData = JSON.parse(JSON.stringify(entryData))
    let trimmed = savedNowEditing.trim()
    if (trimmed.length === 0) {
      newEntryData.splice(nowEditing, 1)
    } else {
      newEntryData[nowEditing] = savedNowEditing
    }
    this.setState({ nowEditing: null, savedNowEditing: null, entryData: newEntryData })
    this.props.updateEditingStatus({ editingInProcess: false, newEntryData })
  }

  onClickMoveUp(e)  {
    e.preventDefault()
    let { nowEditing, entryData } = this.state
    if (typeof nowEditing === 'number' && nowEditing > 0 && nowEditing < entryData.length) {
      let newEntryData = JSON.parse(JSON.stringify(entryData))
      let saved = newEntryData[nowEditing-1]
      newEntryData[nowEditing-1] = newEntryData[nowEditing]
      newEntryData[nowEditing] = saved
      this.setState({ nowEditing: nowEditing-1, entryData: newEntryData })
      this.props.updateEditingStatus({ editingInProcess: true, newEntryData })
    }
  }

  onClickMoveDown(e)  {
    e.preventDefault()
    let { nowEditing, entryData } = this.state
    if (typeof nowEditing === 'number' && nowEditing >= 0 && nowEditing < entryData.length-1) {
      let newEntryData = JSON.parse(JSON.stringify(entryData))
      let saved = newEntryData[nowEditing+1]
      newEntryData[nowEditing+1] = newEntryData[nowEditing]
      newEntryData[nowEditing] = saved
      this.setState({ nowEditing: nowEditing+1, entryData: newEntryData })
      this.props.updateEditingStatus({ editingInProcess: true, newEntryData })
    }
  }

  onClickDeleteEntry(e) {
    e.preventDefault()
    let { nowEditing, entryData } = this.state
    if (typeof nowEditing === 'number' && nowEditing >= 0 && nowEditing < entryData.length) {
      let newEntryData = JSON.parse(JSON.stringify(entryData))
      newEntryData.splice(nowEditing, 1)
      this.setState({ nowEditing: null, entryData: newEntryData })
      this.props.updateEditingStatus({ editingInProcess: false, newEntryData })
    }
  }

  entryDataChanged(newValue, row) {
    let { entryData } = this.state
    let thisJson = JSON.stringify(entryData[row])
    let newJson = JSON.stringify(newValue)
    if (newJson !== thisJson) {
      let newData = JSON.parse(JSON.stringify(entryData))
      newData[row] = newValue
      this.setState({ entryData: newData })
    }
  }

  render() {
    let { entryComponent, entryData, nowEditing } = this.state
    let { multiline} = this.props
    if (!entryData) {
      return (<div></div>)
    }

    // Build the list of entries
    let hidden = {visibility:'hidden'}
    let entriesArr = []
    let addNew = ''
    let count = 0
    if (entryData.length === 0) {
      entriesArr.push(<div key={(count++).toString()} className="TaskProfileNoEntries">No entries in this section.
        You can add an entry by pressing "Add New Entry".</div>)
    } else {
      for (let i=0; i<entryData.length; i++) {
        if (i === nowEditing) {
          let upStyle = { visibility: nowEditing > 0 ? 'visible' : 'hidden' }
          let downStyle = { visibility: nowEditing < entryData.length-1 ? 'visible' : 'hidden' }
          entriesArr.push(<div key={(count++).toString()} className="TaskProfileEntry">
            <TaskProfileEditableEntry dataIndex={i} disabled={false} labelText=''
              entryClasses='NowEditing' entryComponent={entryComponent} multiline={multiline} entryData={entryData[i]} entryDataChanged={this.entryDataChanged}
              labelStyle={{}} editStyle={{display:'none'}} okCancelStyle={{}} upStyle={upStyle} downStyle={downStyle} removeStyle={{}}
              editFunc={this.onClickEditEntry} okFunc={this.onClickSaveEntry} cancelFunc={this.onClickRevertEntry}
              upFunc={this.onClickMoveUp} downFunc={this.onClickMoveDown} removeFunc={this.onClickDeleteEntry} />
          </div>)

        } else if (typeof nowEditing === 'number'){
          entriesArr.push(<div key={(count++).toString()} className="TaskProfileEntry">
            <TaskProfileEditableEntry dataIndex={i} disabled={true} multiline={multiline} labelText=''
              entryClasses='' entryComponent={entryComponent} entryData={entryData[i]} entryDataChanged={this.entryDataChanged}
              labelStyle={{}} editStyle={{display:'none'}} okCancelStyle={hidden} upStyle={hidden} downStyle={hidden} removeStyle={hidden}
              editFunc={this.onClickEditEntry} okFunc={this.onClickSaveEntry} cancelFunc={this.onClickRevertEntry}
              upFunc={this.onClickMoveUp} downFunc={this.onClickMoveDown} removeFunc={this.onClickDeleteEntry} />
          </div>)
        } else {
          entriesArr.push(<div key={(count++).toString()} className="TaskProfileEntry">
            <TaskProfileEditableEntry dataIndex={i} disabled={true} multiline={multiline} labelText=''
              entryClasses='' entryComponent={entryComponent} entryData={entryData[i]} entryDataChanged={this.entryDataChanged}
              labelStyle={{}} editStyle={{}}  okCancelStyle={hidden} upStyle={hidden} downStyle={hidden} removeStyle={hidden}
              editFunc={this.onClickEditEntry} okFunc={this.onClickSaveEntry} cancelFunc={this.onClickRevertEntry}
              upFunc={this.onClickMoveUp} downFunc={this.onClickMoveDown} removeFunc={this.onClickDeleteEntry} />
          </div>)
        }
      }
    }
    if (typeof nowEditing !== 'number') {
      addNew = (<div className="TaskProfileAddNewDiv">
        <a href="" onClick={this.onClickAddEntry} >Add New Entry</a>
      </div>)
    }
    return (
      <div className="TaskProfileEntries" >
        {entriesArr}
        {addNew}
      </div>
    );
  }
}

TaskProfileEntries.propTypes = {
  store: PropTypes.object.isRequired,
  multiline: PropTypes.bool,
  entryComponent: PropTypes.func.isRequired,
  entryData: PropTypes.arrayOf(PropTypes.string).isRequired,
  updateEditingStatus: PropTypes.func.isRequired,
  getNewEmptyRowData: PropTypes.func.isRequired
}

export default withRouter(TaskProfileEntries);
