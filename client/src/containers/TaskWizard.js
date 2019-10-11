
import React from 'react';
import { withRouter } from 'react-router-dom'
import { RSAA } from 'redux-api-middleware'
import { Button } from 'semantic-ui-react'
import PropTypes from 'prop-types'
import { TEAM_BASE_URL, TEAM_API_RELATIVE_PATH } from '../envvars'
import { getTaskSuccess, taskUpdateProgressSuccess, taskRevertProgressSuccess } from '../actions/taskActions'
import parseJsonPayload from '../util/parseJsonPayload'
import { getLocalProgress, setLocalProgress } from '../util/localProgress'
import TaskProse from '../components/Task/TaskProse'
import TaskTrueFalse from '../components/Task/TaskTrueFalse'
import TaskMultipleChoice from '../components/Task/TaskMultipleChoice'
import TaskConfirmOath from '../components/Task/TaskConfirmOath'
import TaskProfile from '../components/Task/TaskProfile'
import './TaskWizard.css'

let componentXref = {
  TaskProse: TaskProse,
  TaskTrueFalse: TaskTrueFalse,
  TaskMultipleChoice: TaskMultipleChoice,
  TaskConfirmOath: TaskConfirmOath,
  TaskProfile: TaskProfile
}

class TaskWizard extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      level: parseInt(this.props.level, 10),
      name: this.props.name,
      taskName: null,
      showWizardNavigation: true
    }
    this.gettask = this.gettask.bind(this);
    this.updateprogress = this.updateprogress.bind(this);
    this.onStepComplete = this.onStepComplete.bind(this);
    this.onStepAdvance = this.onStepAdvance.bind(this);
    this.hideShowWizardNavigation = this.hideShowWizardNavigation.bind(this);
    this.onRevertProgress = this.onRevertProgress.bind(this);
    this.getLocalProgressWrapper = this.getLocalProgressWrapper.bind(this);
    this.gettask()
  }

  gettask() {
    let componentThis = this
    let values = {}
    let { dispatch } = this.props.store
    if (!this.state.level || !this.state.name ) {
      console.error('TaskWizard missing level:'+this.state.level+' or name:'+this.state.name)
      this.props.history.push('/systemerror')
    }
    let newTaskName = this.props.level + '/'  + this.state.name
    if (newTaskName === this.state.taskName) {
      return
    }
    let gettaskApiUrl = TEAM_BASE_URL + TEAM_API_RELATIVE_PATH + '/gettask/' + newTaskName
    const apiAction = {
      [RSAA]: {
        endpoint: gettaskApiUrl,
        method: 'POST',
        credentials: 'include',
        types: [
          'gettask_request', // ignored
          {
            type: 'gettask_success',
            payload: (action, state, res) => {
              parseJsonPayload(res, action.type, function(json) {
                let task = json.task
                dispatch(getTaskSuccess(json.account, json.progress, json.tasks))
                if (!task.steps || !task.steps[0]) {
                  console.error('TaskWizard gettask_success, but invalid task object')
                  this.props.history.push('/systemerror')
                } else {
                  let nSteps = task.steps.length
                  let localProgress = this.getLocalProgressWrapper()
                  let storeState = this.props.store.getState()
                  let maxProgress = storeState.progress
                  let tasks = storeState.tasks
                  let screenIndex = 0
                  let progressIndex = 0
                  if (this.state.level === maxProgress.level && tasks.levels[this.state.level].tasks[maxProgress.tasknum].name === this.state.name) {
                    screenIndex = progressIndex = maxProgress.step
                  }
                  if (this.state.level === localProgress.level && tasks.levels[this.state.level].tasks[localProgress.tasknum].name === this.state.name) {
                    screenIndex = localProgress.step
                  }
                  let tasknum = tasks.levels[this.state.level].tasks.findIndex(tasknum => tasknum.name === this.state.name)
                  if (tasknum < 0) {
                    console.error('TaskWizard gettask_success could not find tasknum '+this.state.name+' for level '+this.state.level)
                    this.props.history.push('/systemerror')
                    return
                  }
                  if (maxProgress.level > this.state.level || (maxProgress.level === this.state.level && maxProgress.tasknum > tasknum)) {
                    progressIndex = nSteps
                  }
                  localProgress.level = this.state.level
                  localProgress.tasknum = tasknum
                  localProgress.step = screenIndex
                  setLocalProgress(localProgress)
                  this.setState({ taskName: newTaskName, task, tasknum, progressIndex, nSteps })
                }
              }.bind(componentThis))
            }
          },
          {
            type: 'gettask_failure',
            payload: (action, state, res) => {
              console.error('TaskWizard gettask_failure')
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

  updateprogress(level, tasknum, progressIndex) {
    return new Promise((resolve, reject) => {
      let componentThis = this
      let { dispatch, getState } = this.props.store
      let storeState = getState()
      let values = JSON.parse(JSON.stringify(storeState.progress))
      values.level = level
      values.tasknum = tasknum
      values.step = progressIndex
      let updateprogressApiUrl = TEAM_BASE_URL + TEAM_API_RELATIVE_PATH + '/updateprogress'
      const apiAction = {
        [RSAA]: {
          endpoint: updateprogressApiUrl,
          method: 'POST',
          credentials: 'include',
          types: [
            'updateprogress_request', // ignored
            {
              type: 'updateprogress_success',
              payload: (action, state, res) => {
                parseJsonPayload(res, action.type, function(json) {
                  dispatch(taskUpdateProgressSuccess(json.account, json.progress, json.tasks))
                  let progress = json.progress
                  let { level, tasknum, nSteps } = this.state
                  // In case another browser session advanced in the background
                  if (progress.level > level || (progress.level === level && progress.tasknum > tasknum)) {
                    this.setState({ progressIndex: nSteps })
                  } else if (progress.level === level && progress.tasknum === tasknum && progress.step > progressIndex) {
                    this.setState({ progressIndex: progress.step })
                  }
                }.bind(componentThis))
                resolve()
              }
            },
            {
              type: 'updateprogress_failure',
              payload: (action, state, res) => {
                reject('updateprogress_failure')
              }
            }
          ],
          body: JSON.stringify(values),
          headers: { 'Content-Type': 'application/json' }
        }
      }
      dispatch(apiAction)
    })
  }

  onStepComplete = () => {
    let { progressIndex, level, tasknum } = this.state
    let localProgress = this.getLocalProgressWrapper()
    let screenIndex = localProgress.step
    if (progressIndex < screenIndex+1) {
      progressIndex = screenIndex+1
      this.setState({ progressIndex })
    }
    // Note that screen updates before server gets its update (for responsiveness)
    this.updateprogress(level, tasknum, progressIndex).then(() => {}).catch(e => {
      console.error('TaskWizard onStepComplete updateprogress_failure')
      this.props.history.push('/systemerror')
    })
  }

  onStepAdvance = () => {
    let { nSteps, progressIndex, level, tasknum } = this.state
    let localProgress = this.getLocalProgressWrapper()
    let screenIndex = localProgress.step
    if (progressIndex < screenIndex+1) {
      progressIndex = screenIndex+1
    }
    if (screenIndex < nSteps) {
      screenIndex++
    }
    localProgress.step = screenIndex
    setLocalProgress(localProgress)
    this.setState({ progressIndex })
    // Note that screen updates before server gets its update (for responsiveness)
    this.updateprogress(level, tasknum, progressIndex).then(() => {}).catch(e => {
      console.error('TaskWizard onStepAdvance updateprogress_failure')
      this.props.history.push('/systemerror')
    })
  }

  hideShowWizardNavigation(showWizardNavigation) {
    this.setState({ showWizardNavigation })
  }

  onRevertProgress() {
    let componentThis = this
    let { dispatch, getState } = this.props.store
    let storeState = getState()
    let values = JSON.parse(JSON.stringify(storeState.progress))
    let localProgress = this.getLocalProgressWrapper()
    values.level = localProgress.level
    values.tasknum = localProgress.tasknum
    values.step = localProgress.step
    let resetprogressApiUrl = TEAM_BASE_URL + TEAM_API_RELATIVE_PATH + '/resetprogress'
    const apiAction = {
      [RSAA]: {
        endpoint: resetprogressApiUrl,
        method: 'POST',
        credentials: 'include',
        types: [
          'resetprogress_request', // ignored
          {
            type: 'resetprogress_success',
            payload: (action, state, res) => {
              parseJsonPayload(res, action.type, function(json) {
                dispatch(taskRevertProgressSuccess(json.account, json.progress, json.tasks))
                this.setState({ progressIndex: json.progress.step })
              }.bind(componentThis))
            }
          },
          {
            type: 'resetprogress_failure',
            payload: (action, state, res) => {
              console.error('TaskWizard resetprogress_failure')
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

  handleNavigationClick = (name, e) => {
    let { level, tasknum, taskName, progressIndex, nSteps} = this.state
    let localProgress = this.getLocalProgressWrapper()
    let screenIndex = localProgress.step
    if (name === 'first' && screenIndex > 0) {
      screenIndex = 0
    } else if (name === 'prev' && screenIndex > 0) {
      screenIndex--
    } else if (name === 'next' && screenIndex < nSteps) {
      screenIndex++
    } else if (name === 'last' && screenIndex < nSteps && progressIndex >= nSteps) {
      screenIndex = nSteps
    } else if (name === 'last' && screenIndex >= nSteps && progressIndex >= nSteps) {
      // User clicked on "Finish" button, so advance to the next task
      let { getState } = this.props.store
      let storeState = getState()
      let tasks = storeState.tasks
      let nTasks = tasks.levels[level].tasks.length
      tasknum++
      progressIndex = 0
      if (tasknum >= nTasks) {
        level++
        tasknum = 0
      }
      this.updateprogress(level, tasknum, progressIndex).then(() => {
        this.props.history.push('/Tasks')
      }).catch(e => {
        console.error('TaskWizard handleNavigationClick updateprogress_failure')
        this.props.history.push('/systemerror')
      })
    } else {
      console.error('TaskWizard handleNavigationClick unexpected case. taskName:'+taskName+', progressIndex='+progressIndex+', screenIndex:'+screenIndex);
      return // should not get here ever
    }
    localProgress.step = screenIndex
    setLocalProgress(localProgress)
    this.setState({ progressIndex })
    setTimeout(() => {
      let TaskStepContent = document.querySelector('.TaskStepContent')
      if (TaskStepContent) {
        TaskStepContent.scrollTop = 0
        TaskStepContent.scrollLeft = 0
      }
    }, 50)
  }

  getLocalProgressWrapper() {
    let localProgress = getLocalProgress()
    if (!localProgress) {
      console.error('TaskWizard missing localProgress value')
      this.props.history.push('/systemerror')
    } else {
      return localProgress
    }
  }

  render() {
    let { store } = this.props
    let { taskName, task, level, progressIndex, nSteps, tasknum, showWizardNavigation } = this.state
    let localProgress = this.getLocalProgressWrapper()
    let screenIndex = localProgress.step
    if (!task) {
      return (<div></div>)
    }
    let type = screenIndex < nSteps ? task.steps[screenIndex].type : 'congrats'
    let taskTitle, screenTitle, screenContent, navigation
    if (!taskName) {
      taskTitle = 'loading ... '
    } else if (!task || !task.success) {
      taskTitle = 'task not found'
    } else {
      taskTitle = (
        <h1>Task {level}.{tasknum+1}: {task.title}</h1>
      )
      if (screenIndex < nSteps ) {
        let stepTitle = (componentXref[type] && componentXref[type].getTitle) ?
            componentXref[type].getTitle(store, task.steps[screenIndex].content) : task.steps[screenIndex].title
        screenTitle = (
          <h2><div className="StepTitlePage">({screenIndex+1} of {nSteps})</div>{stepTitle}</h2>
        )
      }
      if (showWizardNavigation) {
        let firstStyle = { visibility: screenIndex > 0 ? 'visible' : 'hidden'}
        let prevStyle = { visibility: screenIndex > 0 ? 'visible' : 'hidden'}
        let nextStyle = { visibility: screenIndex < progressIndex ? 'visible' : 'hidden'}
        let lastStyle = { visibility: progressIndex >= nSteps ? 'visible' : 'hidden'}
        let lastText = screenIndex >= nSteps ? 'Finish' : 'End'
        navigation = (
          <div className="TaskNavigationButtons">
            <span className="TaskNavigationButton first" style={firstStyle} >
              <Button onClick={this.handleNavigationClick.bind(this, 'first')} >Start</Button>
            </span>
            <span className="TaskNavigationButton prev" style={prevStyle} >
              <Button onClick={this.handleNavigationClick.bind(this, 'prev')} >Prev</Button>
            </span>
            <span className="TaskNavigationButton next" style={nextStyle} >
              <Button onClick={this.handleNavigationClick.bind(this, 'next')} >Next</Button>
            </span>
            <span className="TaskNavigationButton last" style={lastStyle} >
              <Button onClick={this.handleNavigationClick.bind(this, 'last')} >{lastText}</Button>
            </span>
          </div>
        )
      } else {
        navigation = ''
      }
      if (type === 'TaskProse') {
        screenContent = (
          <div>
            <TaskProse content={task.steps[screenIndex].content} store={store}
              onStepComplete={this.onStepComplete} onStepAdvance={this.onStepAdvance}
              onRevertProgress={this.onRevertProgress} hideShowWizardNavigation={this.hideShowWizardNavigation} />
            <div className="TaskNavigation">{navigation}</div>
          </div>
        )
      } else if (type === 'TaskTrueFalse') {
        screenContent = (
          <div>
            <TaskTrueFalse content={task.steps[screenIndex].content} store={store}
              onStepComplete={this.onStepComplete} onStepAdvance={this.onStepAdvance}
              onRevertProgress={this.onRevertProgress} hideShowWizardNavigation={this.hideShowWizardNavigation} />
            <div className="TaskNavigation">{navigation}</div>
          </div>
        )
      } else if (type === 'TaskMultipleChoice') {
        screenContent = (
          <div>
            <TaskMultipleChoice content={task.steps[screenIndex].content} store={store}
              onStepComplete={this.onStepComplete} onStepAdvance={this.onStepAdvance}
              onRevertProgress={this.onRevertProgress} hideShowWizardNavigation={this.hideShowWizardNavigation} />
            <div className="TaskNavigation">{navigation}</div>
          </div>
        )
      } else if (type === 'TaskConfirmOath') {
        screenContent = (
          <div>
            <TaskConfirmOath content={task.steps[screenIndex].content} store={store}
              onStepComplete={this.onStepComplete} onStepAdvance={this.onStepAdvance}
              onRevertProgress={this.onRevertProgress} hideShowWizardNavigation={this.hideShowWizardNavigation} />
            <div className="TaskNavigation">{navigation}</div>
          </div>
        )
      } else if (type === 'TaskProfile') {
        screenContent = (
          <div>
            <TaskProfile content={task.steps[screenIndex].content} store={store}
              onStepComplete={this.onStepComplete} onStepAdvance={this.onStepAdvance}
              onRevertProgress={this.onRevertProgress} hideShowWizardNavigation={this.hideShowWizardNavigation} />
            <div className="TaskNavigation">{navigation}</div>
          </div>
        )

      }
    }
    let result
    if (screenIndex < nSteps) {
      result = ( <div className="TaskWizardStep">
        <div className="TaskTitle">{taskTitle}</div>
        <div className="TaskStepTitle">{screenTitle}</div>
        <div className="TaskStepContent">{screenContent}</div>
      </div> )
    } else {
      result = ( <div className="TaskWizardCompletion">
        <div className="TaskTitle">{taskTitle}</div>
        <h2 className="TaskWizardCongratulations">Congratulations!</h2>
        <div className="TaskWizardComplete">You have completed this task. Press "Finish" to proceed.</div>
        <div className="TaskNavigation">{navigation}</div>
      </div> )
    }
    return ( <div className="TaskWizard">
      {result}
    </div> );
  }
}

TaskWizard.propTypes = {
  store: PropTypes.object.isRequired,
  level: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired
}

export default withRouter(TaskWizard);
