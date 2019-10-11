
import React from 'react';
import PropTypes from 'prop-types'
import './TaskProfileEditableEntry.css'

class EditableEntry extends React.Component {
  render() {
    const EntryComponent = this.props.entryComponent
    let { addlClasses, rowData, row, disabled, placeholder, multiline, pattern, entryDataChanged } = this.props
    return <EntryComponent rowData={rowData} row={row} disabled={disabled} placeholder={placeholder}
      multiline={multiline} pattern={pattern} addlClasses={addlClasses} entryDataChanged={entryDataChanged} />
  }
}

class TaskProfileEditableEntry extends React.Component {

  render() {
    let { dataIndex, disabled, placeholder, multiline, pattern, labelText } = this.props
    let { entryClasses, entryComponent, entryData, entryDataChanged } = this.props
    let { labelStyle, editStyle, okCancelStyle, upStyle, downStyle, removeStyle } = this.props
    let { editFunc, okFunc, cancelFunc, upFunc, downFunc, removeFunc } = this.props

    return (
      <div className="TaskProfileEditableEntry" >
        <div className="TaskProfileEditDiv" >
          <a href="" onClick={editFunc} data-entry-index={dataIndex} style={editStyle} >Edit</a>
          <span className="TaskProfileEntryLabel" style={labelStyle} >{labelText}</span>
        </div>
        <EditableEntry entryComponent={entryComponent} rowData={entryData} row={dataIndex} placeholder={placeholder}
          multiline={multiline} pattern={pattern} disabled={disabled} entryDataChanged={entryDataChanged} addlClasses={entryClasses} />
        <div className="TaskProfileEditControls">
          <a href="" onClick={okFunc} data-entry-index={dataIndex} style={okCancelStyle} >OK</a>
          <span className="TaskProfileSmallSpace"></span>
          <a href="" onClick={cancelFunc} data-entry-index={dataIndex} style={okCancelStyle} >Cancel</a>
          <span className="TaskProfileLargeSpace"></span>
          <a href="" onClick={upFunc} data-entry-index={dataIndex} style={upStyle} >Move&#8593;</a>
          <span className="TaskProfileSmallSpace"></span>
          <a href="" onClick={downFunc} data-entry-index={dataIndex} style={downStyle} >Move&#8595;</a>
          <span className="TaskProfileLargeSpace"></span>
          <a href="" onClick={removeFunc} data-entry-index={dataIndex} style={removeStyle} >Remove</a>
        </div>
      </div>
    );
  }
}

TaskProfileEditableEntry.propTypes = {
  dataIndex: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number
  ]).isRequired,
  disabled: PropTypes.bool.isRequired,
  placeholder: PropTypes.string,
  multiline: PropTypes.bool,
  pattern: PropTypes.string,
  labelText: PropTypes.string.isRequired,
  entryClasses: PropTypes.string.isRequired,
  entryData: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.arrayOf(PropTypes.string)
  ]),
  entryDataChanged: PropTypes.func.isRequired,
  labelStyle: PropTypes.object.isRequired,
  editStyle: PropTypes.object.isRequired,
  okCancelStyle: PropTypes.object.isRequired,
  upStyle: PropTypes.object.isRequired,
  downStyle: PropTypes.object.isRequired,
  removeStyle: PropTypes.object.isRequired,
  editFunc: PropTypes.func.isRequired,
  okFunc: PropTypes.func.isRequired,
  cancelFunc: PropTypes.func.isRequired,
  upFunc: PropTypes.func.isRequired,
  downFunc: PropTypes.func.isRequired,
  removeFunc: PropTypes.func.isRequired
}

export default TaskProfileEditableEntry
