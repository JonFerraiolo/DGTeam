
import React from 'react';
import { withRouter } from 'react-router-dom'
import { RSAA } from 'redux-api-middleware'
import { TEAM_BASE_URL, TEAM_API_RELATIVE_PATH } from '../../envvars'
import { getTasksSuccess } from '../../actions/taskActions'
import parseJsonPayload from '../../util/parseJsonPayload'
import PropTypes from 'prop-types'
import './Tasks.css'

class Tasks extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      tasks: null
    }
    this.gettasks = this.gettasks.bind(this);
    this.gettasks()
  }

  gettasks() {
    let componentThis = this
    let values = {}
    let { dispatch } = this.props.store
    let gettasksApiUrl = TEAM_BASE_URL + TEAM_API_RELATIVE_PATH + '/gettasks'
    const apiAction = {
      [RSAA]: {
        endpoint: gettasksApiUrl,
        method: 'POST',
        credentials: 'include',
        types: [
          'gettasks_request', // ignored
          {
            type: 'gettasks_success',
            payload: (action, state, res) => {
              parseJsonPayload(res, action.type, function(json) {
                dispatch(getTasksSuccess(json.account, json.progress, json.tasks))
                this.setState({ tasks: json.tasks, progress: json.progress })
              }.bind(componentThis))
            }
          },
          {
            type: 'gettasks_failure',
            payload: (action, state, res) => {
              console.error('Tasks gettasks_failure')
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

  render() {
    if (!this.state.tasks) {
      return (<div></div>)
    }
    let { tasks, progress } = this.state
    let { level, tasknum, step } = progress
    let count = 0
    let r = []
    let nLevels = tasks.levels.length
    if (level < nLevels)  {
      let levelTasks = tasks.levels[level].tasks
      levelTasks.map((item, index) => {
        let num = <span className="TaskItemNum">{level}.{index+1}</span>
        let title = <span className="TaskItemTitle">{item.title}</span>
        let href = "/Task/" + level + "/" + item.name
        if (index === tasknum) {
          let thisIs = <span className="TasksThisIsCurrent">Current task</span>
          r.push( <li key={(count++).toString()} className="TasksItemCurrent">
            <a href={href}>{thisIs} Task {num}: {title}</a>
          </li> )
        } else if (index < tasknum) {
          r.push( <li key={(count++).toString()} className="TasksItemCompleted">
            <a href={href}>Task {num}: {title}</a>
          </li> )
        } else {
          r.push( <li key={(count++).toString()} className="TasksItemFuture">Task {num}: {title}</li> )
        }
        return null
      })
      let workVerb = step === 0 ? 'begin' : 'continue'
      return (
        <div className="Tasks">
          <p>You are currently at <span className="TasksCurrentLevel">level {level}</span>.</p>
          <p>Once you complete the following tasks,
            you will advance to <span className="TasksNextLevel">level {level+1}</span>:
          </p>
          <ul>
            {r}
          </ul>
          <p>Press the highlighted item to {workVerb} on your current task. </p>
        </div>
      )
    } else {
      return (
        <div className="Tasks">
          <p>You have completed all levels defined so far.</p>
        </div>
      )
    }
  }
}

Tasks.propTypes = {
  store: PropTypes.object.isRequired
}

export default withRouter(Tasks);
