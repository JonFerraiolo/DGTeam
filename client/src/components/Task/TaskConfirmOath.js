
import React from 'react';
import { withRouter } from 'react-router-dom'
import PropTypes from 'prop-types'
import { Button, Message } from 'semantic-ui-react'
import { RSAA } from 'redux-api-middleware';
import TaskStepBaseClass from './TaskStepBaseClass'
import { accountLogoutSuccess } from '../../actions/accountActions'
import { TEAM_BASE_URL, TEAM_API_RELATIVE_PATH } from '../../envvars'
import './TaskConfirmOath.css'

const logoutApiUrl = TEAM_BASE_URL + TEAM_API_RELATIVE_PATH + '/logout'

class TaskConfirmOath extends TaskStepBaseClass {
  constructor(props) {
    super(props)
    this.state = {
      confirmed: 'notyet'
    }
    this.doLogout = this.doLogout.bind(this)
  }

  yes = (e) => {
    this.props.onStepAdvance() // Tell TaskWizard to advance to next screen
  }

  no = (e) => {
    this.setState({ confirmed: 'no' })
    this.props.onRevertProgress()
  }

  doLogout() {
    let values = {}
    let { dispatch } = this.props.store
    const apiAction = {
      [RSAA]: {
        endpoint: logoutApiUrl,
        method: 'POST',
        credentials: 'include',
        types: [
          'logout_request', // ignored
          {
            type: 'logout_success',
            payload: (action, state, res) => {
              console.log('logout_success')
              dispatch(accountLogoutSuccess())
              this.props.history.push('/login')
            }
          },
          {
            type: 'logout_failure',
            payload: (action, state, res) => {
              console.error('logout_failure')
              this.props.history.push('/login')
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
    let { confirmed } = this.state
    let msg, noButtonText, noButtonFunc, yesButtonText
    if (confirmed === 'no') {
      msg = ( <Message className="TaskConfirmOathAreYouSure">
          <Message.Header>Another chance to agree</Message.Header>
          <p>Every team member must agree with all of the oaths.
            If you cannot agree with this oath, you cannot advance further with organizational activities.</p>
          <p>Please press "I Agree" if you do indeed agree with this oath or press "Logout" to exit.</p>
        </Message> )
      yesButtonText = "I Agree"
      noButtonText = "Logout"
      noButtonFunc = this.doLogout
    } else {
      msg = ''
      yesButtonText = "Yes"
      noButtonText = "No"
      noButtonFunc = this.no
    }
    return (
      <div className="TaskConfirmOath" >
        <div className="TaskConfirmOathText" >
          {this.props.content}
        </div>
        {msg}
        <div className="TaskConfirmOathButtonRow">
          <span className="spacer"></span>
          <Button className="TaskConfirmOathButtonYes" onClick={this.yes} >{yesButtonText}</Button>
          <span className="spacer"></span>
          <Button className="TaskConfirmOathButtonNo" onClick={noButtonFunc} >{noButtonText}</Button>
          <span className="spacer"></span>
        </div>
      </div>
    );
  }
}

TaskConfirmOath.propTypes = {
  store: PropTypes.object.isRequired,
  content: PropTypes.string.isRequired,
  onStepComplete: PropTypes.func.isRequired,
  onStepAdvance: PropTypes.func.isRequired,
  onRevertProgress: PropTypes.func.isRequired,
  hideShowWizardNavigation: PropTypes.func.isRequired
}

export default withRouter(TaskConfirmOath);
