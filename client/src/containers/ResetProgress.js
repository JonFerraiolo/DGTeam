
import React from 'react';
import { connect } from "react-redux";
import { LocalForm, Control } from 'react-redux-form'
import { Link, withRouter } from 'react-router-dom'
import { Button, Container, Input } from 'semantic-ui-react'
import PropTypes from 'prop-types'
import { RSAA } from 'redux-api-middleware';
import { resetProgressSuccess } from '../actions/progressActions'
import { setLocalProgress } from '../util/localProgress'
import parseJsonPayload from '../util/parseJsonPayload'
import { TEAM_BASE_URL, TEAM_API_RELATIVE_PATH } from '../envvars'

const resetprogressApiUrl = TEAM_BASE_URL + TEAM_API_RELATIVE_PATH + '/resetprogress'

// Wrap semantic-ui controls for react-redux-forms
const wLevel = (props) => <Input name='level' placeholder='level' fluid className="verticalformcontrol" {...props} />
const wTasknum = (props) => <Input name='tasknum' placeholder='tasknum' fluid className="verticalformcontrol" {...props} />
const wStep = (props) => <Input name='step' placeholder='step' fluid className="verticalformcontrol" {...props} />

class ResetProgress extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      level: 1,
      tasknum: 0,
      step: 0
    }
    this.handleInput = this.handleInput.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  handleInput(event) {
    let { name, value } = event.target
    let tokens = name.split('.')
    let field = tokens[1]
    let values = {}
    values[field] = value
    this.setState(values)
  }

  handleSubmit(values) {
    let localProgress = values
    let componentThis = this
    let { dispatch, getState } = this.props.store
    let storeState = getState()
    let storeStateProgress = JSON.parse(JSON.stringify(storeState.progress))
    values = Object.assign({}, storeStateProgress, localProgress)
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
                dispatch(resetProgressSuccess(json.account, json.progress, json.tasks))
                setLocalProgress(localProgress)
                this.props.history.push('/Tasks')
              }.bind(componentThis))
            }
          },
          {
            type: 'resetprogress_failure',
            payload: (action, state, res) => {
              console.error('resetprogress_failure')
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
    let { level, tasknum, step } = this.state
    let numPattern = '\\d+'
    return (
      <Container text className='ResetProgress verticalformcontainer'>
        <LocalForm initialState={{ level, tasknum, step }} onSubmit={this.handleSubmit} >
          <label>
            <div>Level (1 or greater)</div>
            <Control.text model=".level" value={level} pattern={numPattern} component={wLevel} onInput={this.handleInput} />
          </label>
          <label>
            <div>Task (0 or greater)</div>
            <Control.text model=".tasknum" value={tasknum} pattern={numPattern} component={wTasknum} onInput={this.handleInput} />
          </label>
          <label>
            <div>Step (0 or greater)</div>
            <Control.text model=".step" value={step} pattern={numPattern} component={wStep} onInput={this.handleInput} />
          </label>
          <div className='verticalformbuttonrow'>
            <Button type="submit" className="verticalformcontrol verticalformbottombutton" >Reset Progress</Button>
          </div>
        </LocalForm>
      </Container>
    )
  }
}

ResetProgress.propTypes = {
  store: PropTypes.object.isRequired
}

const mapStateToProps = (state, ownProps) => {
  return {
    store: ownProps.store
  }
}
export default withRouter(connect(mapStateToProps)(ResetProgress));
