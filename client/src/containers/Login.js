
import React from 'react';
import { connect } from "react-redux";
import { LocalForm, Control } from 'react-redux-form'
import { Link, withRouter } from 'react-router-dom'
import { Button, Container, Input, Message } from 'semantic-ui-react'
import PropTypes from 'prop-types'
import { RSAA } from 'redux-api-middleware';
import { accountLoginSuccess } from '../actions/accountActions'
import { getLocalProgress, setLocalProgress } from '../util/localProgress'
import parseJsonPayload from '../util/parseJsonPayload'
import { TEAM_ORG, TEAM_BASE_URL, TEAM_API_RELATIVE_PATH } from '../envvars'

var EMAIL_NOT_REGISTERED = 'EMAIL_NOT_REGISTERED'
var EMAIL_NOT_VERIFIED = 'EMAIL_NOT_VERIFIED'
var INCORRECT_PASSWORD = 'INCORRECT_PASSWORD'

const loginApiUrl = TEAM_BASE_URL + TEAM_API_RELATIVE_PATH + '/login'

// Wrap semantic-ui controls for react-redux-forms
const wEmail = (props) => <Input name='email' placeholder='Email' fluid className="verticalformcontrol" {...props} />
const wPassword = (props) => <Input name='password' placeholder='Password' fluid className="verticalformcontrol" {...props} />

class Login extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      showPassword: false,
      accountNotVerified: false,
      message: this.props.message,
      error: this.props.error
    }
    this.toggleShowPassword = this.toggleShowPassword.bind(this)
  }

  handleSubmit(values) {
    let { dispatch } = this.props.store
    const apiAction = {
      [RSAA]: {
        endpoint: loginApiUrl,
        method: 'POST',
        credentials: 'include',
        types: [
          'LOGIN_REQUEST',
          {
            type: 'LOGIN_SUCCESS',
            payload: (action, state, res) => {
              parseJsonPayload.bind(this)(res, action.type, json => {
                localStorage.setItem("teamAppEmail", json.account.email)
                if (!getLocalProgress()) {
                  setLocalProgress({ level:1, tasknum:0, step:0 })
                }
                dispatch(accountLoginSuccess(json.account))
                this.props.history.push('/Tasks')
              })
            }
          },
          {
            type: 'LOGIN_FAILURE',
            payload: (action, state, res) => {
              parseJsonPayload.bind(this)(res, action.type, json => {
                if (json.error === EMAIL_NOT_REGISTERED) {
                  this.setState({ message: 'No account for this email', error: true })
                } else if (json.error === INCORRECT_PASSWORD) {
                  this.setState({ message: 'Incorrect password', error: true })
                } else if (json.error === EMAIL_NOT_VERIFIED) {
                  this.setState({ message: 'Account\'s email address not yet verified', error: true, accountNotVerified: true })
                } else {
                  console.error('LOGIN_FAILURE unrecognized error='+json.error+', msg:'+json.msg)
                  this.props.history.push('/systemerror')
                }
              })
            }
          }
        ],
        body: JSON.stringify(values),
        headers: { 'Content-Type': 'application/json' }
      }
    }
    dispatch(apiAction)
  }

  toggleShowPassword(event) {
    event.preventDefault()
    this.setState({ showPassword: !this.state.showPassword })
  }

  render() {
    let { message, error } = this.state
    let { showPassword, accountNotVerified } = this.state
    let passwordType = showPassword ? 'input' : 'password'
    let showHidePasswordText = showPassword ? 'Hide password' : 'Show password'
    let forgotPasswordStyle = accountNotVerified ? { display:'none' } : { display:'block' }
    let resendVerificationStyle = accountNotVerified ? { display:'block' } : { display:'none' }
    let hdr = TEAM_ORG+' Team Login'
    return (
      <Container text className='Login verticalformcontainer'>
        <Message header={hdr} className='verticalformtopmessage' error={error} content={message} />
        <LocalForm onSubmit={(values) => this.handleSubmit(values)} >
          <Control.text model=".email" type="email" component={wEmail} />
          <Control.password type={passwordType} model=".password" component={wPassword} />
          <div className="showPasswordRow">
            <a href="" className="showPasswordLink" onClick={this.toggleShowPassword} >{showHidePasswordText}</a>
          </div>
          <div className='verticalformbuttonrow'>
            <Button type="submit" className="verticalformcontrol verticalformbottombutton" >Login</Button>
            <div style={{clear:'both' }} ></div>
          </div>
        </LocalForm>
        <Message className="verticalformbottommessage" >
          <span className='innerBlock'>
            <div style={forgotPasswordStyle} ><Link to='/forgotpassword'>Forgot your password?</Link></div>
            <div style={resendVerificationStyle} ><Link to='/resendverification'>Need to resend account verification email?</Link></div>
            <div>Not yet a team member?&nbsp;<Link to="/signup">Signup here</Link></div>
          </span>
        </Message>
      </Container>
    )
  }
}

Login.propTypes = {
  store: PropTypes.object.isRequired
}

const mapStateToProps = (state, ownProps) => {
  return {
    store: ownProps.store
  }
}
export default withRouter(connect(mapStateToProps)(Login));
