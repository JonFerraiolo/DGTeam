
/*
TaskProfile.Js gets/puts data to server.
Child components receive initial data and provide getData functions.
*/

import React from 'react';
import { withRouter } from 'react-router-dom'
import PropTypes from 'prop-types'
import DOMPurify from 'dompurify'
import { RSAA } from 'redux-api-middleware'
import { Button } from 'semantic-ui-react'
import parseJsonPayload from '../../util/parseJsonPayload'
import substituteVariables from '../../util/substituteVariables'
import { TEAM_BASE_URL, TEAM_API_RELATIVE_PATH } from '../../envvars'
import TaskStepBaseClass from './TaskStepBaseClass'
import TaskProfileVital from './TaskProfileVital'
import TaskProfileNames from './TaskProfileNames'
import TaskProfileList from './TaskProfileList'
import './TaskProfile.css'

class TaskProfile extends TaskStepBaseClass {
  constructor(props) {
    super(props)
    this.state = {
      editingInProcess: false,
      categoryData: null,
      lastSavedData: null
    }
    this.getCategoryName = this.getCategoryName.bind(this)
    this.updateEditingStatus = this.updateEditingStatus.bind(this)
    this.getCategoryData = this.getCategoryData.bind(this)
    this.onClickShowChanges = this.onClickShowChanges.bind(this)
    this.onClickSaveChanges = this.onClickSaveChanges.bind(this)
    this.onClickDiscardChanges = this.onClickDiscardChanges.bind(this)
    this.getCategoryData(this.getCategoryName(this.props))
  }

  getCategoryName(props) {
    let { content, store } = props
    let storeState = store.getState()
    let { profileCategories } = storeState.tasks
    let { index } = content
    let { category } = profileCategories.person[index]
    return category
  }

  componentWillReceiveProps(nextProps) {
    let thisJson = JSON.stringify(this.props.content)
    let nextJson = JSON.stringify(nextProps.content)
    if (nextJson !== thisJson) {
      this.getCategoryData(this.getCategoryName(nextProps))
    }
  }

  componentDidUpdate(prevProps, prevState) {
    let { editingInProcess, pendingChanges } = this.state
    if ( editingInProcess !== prevState.editingInProcess || pendingChanges !== prevState.pendingChanges) {
      let { hideShowWizardNavigation } = this.props
      hideShowWizardNavigation(!(editingInProcess || pendingChanges))
    }
  }

  static getTitle(store, content) {
    let storeState = store.getState()
    let { profileCategories } = storeState.tasks
    let { index, qualifier } = content
    let { variables } = profileCategories
    return substituteVariables(profileCategories.person[index].title, variables, qualifier)
  }

  updateEditingStatus(params) {
    let { editingInProcess, newCategoryData } = params
    let thisJson = JSON.stringify(this.state.categoryData)
    let newJson = JSON.stringify(newCategoryData)
    let lastJson = JSON.stringify(this.state.lastSavedData)
    let pendingChanges = !(newJson === lastJson)
    if (this.state.editingInProcess !== editingInProcess ||
      this.state.pendingChanges !== pendingChanges ||
      thisJson !== newJson) {
      this.setState({ editingInProcess, pendingChanges, categoryData: newCategoryData })
    }
    let { hideShowWizardNavigation } = this.props
    hideShowWizardNavigation(!(editingInProcess || pendingChanges))
  }

  getCategoryData(category) {
    let componentThis = this
    let { store } = this.props
    let { dispatch } = store
    let storeState = store.getState()
    let { id } = storeState.account
    let values = { subjectId: id, category }
    let getCategoryDataApiUrl = TEAM_BASE_URL + TEAM_API_RELATIVE_PATH + '/getprofilecategorydata'
    const apiAction = {
      [RSAA]: {
        endpoint: getCategoryDataApiUrl,
        method: 'POST',
        credentials: 'include',
        types: [
          'getcategorydata_request', // ignored
          {
            type: 'getcategorydata_success',
            payload: (action, state, res) => {
              parseJsonPayload(res, action.type, function(json) {
                let categoryData = {
                  legalName: json.categoryData.legalName,
                  dob: json.categoryData.dob,
                  otherVital: json.categoryData.otherVital,
                  entries: json.categoryData.values
                }
                if (!Array.isArray(categoryData.entries)) {
                  categoryData.entries = []
                }
                let lastSavedData = categoryData
                this.setState({ categoryData, lastSavedData })
              }.bind(componentThis))
            }
          },
          {
            type: 'getcategorydata_failure',
            payload: (action, state, res) => {
              console.error('TaskWizard getcategorydata_failure')
              this.props.history.push('/systemerror')
            }
          }
        ],
        body: JSON.stringify(values),
        headers: { 'Content-Type': 'application/json' }
      }
    }
    dispatch(apiAction)
  }

  onClickShowChanges(e) {
    e.preventDefault()
    alert('FIXME not yet implemented')
  }

  onClickSaveChanges(e) {
    e.preventDefault()
    let { categoryData } = this.state
    let { entries } = categoryData
    let newEntries = []
    entries.forEach(entry => {
      let trimmed = entry.trim()
      if (trimmed.length > 0) {
        newEntries.push(entry)
      }
    })
    let newCategoryData = JSON.parse(JSON.stringify(categoryData))
    newCategoryData.entries = newEntries
    this.setState({ lastSavedData: newCategoryData, categoryData: newCategoryData, pendingChanges: false })
    let componentThis = this
    let { content, store } = this.props
    let { dispatch } = store
    let storeState = store.getState()
    let category = this.getCategoryName(this.props)
    let { id } = storeState.account
    let payload = { subjectId: id, category }
    if (category === 'vital') {
      payload.legalName = categoryData.legalName
      payload.dob = categoryData.dob
      payload.otherVital = categoryData.otherVital
    } else {
      payload.values = newEntries
    }
    let setCategoryDataApiUrl = TEAM_BASE_URL + TEAM_API_RELATIVE_PATH + '/setprofilecategorydata'
    const apiAction = {
      [RSAA]: {
        endpoint: setCategoryDataApiUrl,
        method: 'POST',
        credentials: 'include',
        types: [
          'profileitem_request', // ignored
          {
            type: 'profileitem_success',
            payload: (action, state, res) => {
              parseJsonPayload(res, action.type, function(json) {
                // silent success
              }.bind(componentThis))
            }
          },
          {
            type: 'profileitem_failure',
            payload: (action, state, res) => {
              console.error('profileitem_failure')
              this.props.history.push('/systemerror')
            }
          }
        ],
        body: JSON.stringify(payload),
        headers: { 'Content-Type': 'application/json' }
      }
    }
    dispatch(apiAction)
  }

  onClickDiscardChanges(e) {
    e.preventDefault()
    let { lastSavedData } = this.state
    this.setState({ categoryData: lastSavedData, pendingChanges: false })
  }

  render() {
    //FIXME ComponentDidUpdate?? But what about first rendering?
    setTimeout(() => {
      this.props.onStepComplete() // Tell TaskWizard ok to activate Next button
    }, 0)
    let { categoryData, editingInProcess, pendingChanges } = this.state
    if (categoryData === null) {
      return <div></div>
    }
    let { content, store } = this.props
    let storeState = store.getState()
    let { profileCategories } = storeState.tasks
    let { index, qualifier } = content
    let { variables } = profileCategories
    let { category } = profileCategories.person[index]
    // Do variable substitutions on the long description string
    // Replacement strings can be recursively replaced, so /g isn't sufficient
    let long = substituteVariables(profileCategories.person[index].long, variables, qualifier)
    // Build the list of entries
    let saveDiscardChangesTop = ''
    let saveDiscardChangesBottom = ''
    let emptyEntries = ''
    let saveDiscardChanges = (<div className="TaskProfilePendingChangesDiv">
      <span className="TaskProfileSmallSpace"></span>
      <a href="" onClick={this.onClickShowChanges} >Show Changes</a>
      <span className="TaskProfileLargeSpace"></span>
      <Button onClick={this.onClickSaveChanges} size='tiny' >Save Changes</Button>
      <span className="TaskProfileLargeSpace"></span>
      <a href="" onClick={this.onClickDiscardChanges} >Discard Changes</a>
      <span className="TaskProfileSmallSpace"></span>
    </div>)
    if (pendingChanges && !editingInProcess) {
      saveDiscardChangesBottom = saveDiscardChanges
      //FIXME need a better conditional, perhaps using height of boxes
      if (categoryData.entries.length > 4) {
        saveDiscardChangesTop = saveDiscardChanges
      }
    }
    let childComponent = ''
    if (category === 'vital') {
      childComponent = <TaskProfileVital store={store} updateEditingStatus={this.updateEditingStatus} categoryData={categoryData} />
    } else if (category === 'name') {
      childComponent = <TaskProfileNames store={store} updateEditingStatus={this.updateEditingStatus}
        categoryData={categoryData} qualifier={qualifier} />
    } else {
      let multiline = category === 'internetId' ? false : true
      childComponent = <TaskProfileList store={store} updateEditingStatus={this.updateEditingStatus}
        categoryData={categoryData} multiline={multiline} />
    }
    if (!editingInProcess) {
      let anyEmpty = false
      categoryData.entries.forEach(entry => {
        let trimmed = entry.trim()
        if (trimmed.length === 0) {
          anyEmpty = true
        }
      })
      if (anyEmpty) {
        emptyEntries = (<div className="TaskProfileEmptyEntries">Empty entries will be removed with the next Save Changes.</div>)
      }
    }

    return (
      <div className="TaskProfile">
        <div className="TaskProfileCategoryDescription" dangerouslySetInnerHTML={{__html: DOMPurify.sanitize(long)}} />
        {saveDiscardChangesTop}
        {childComponent}
        {emptyEntries}
        {saveDiscardChangesBottom}
      </div>
    );
  }
}

TaskProfile.propTypes = {
  store: PropTypes.object.isRequired,
  content: PropTypes.object.isRequired,
  onStepComplete: PropTypes.func.isRequired,
  onStepAdvance: PropTypes.func.isRequired,
  onRevertProgress: PropTypes.func.isRequired,
  hideShowWizardNavigation: PropTypes.func.isRequired
}

export default withRouter(TaskProfile);
