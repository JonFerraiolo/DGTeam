
import React from 'react';
import { connect } from "react-redux";
import { LocalForm, Control } from 'react-redux-form'
import { Link, withRouter } from 'react-router-dom'
import PropTypes from 'prop-types'
import { Button, Container, Input, Message } from 'semantic-ui-react'
import { TEAM_BASE_URL, TEAM_API_RELATIVE_PATH } from '../envvars'
import passwordRegexp from '../util/passwordRegexp'
import { RSAA } from 'redux-api-middleware';
import parseJsonPayload from '../util/parseJsonPayload'

var TOKEN_NOT_FOUND = 'TOKEN_NOT_FOUND'
var TOKEN_EXPIRED = 'TOKEN_EXPIRED'

var resetpasswordApiUrl = TEAM_BASE_URL + TEAM_API_RELATIVE_PATH + '/resetpassword'

var missingToken = 'Invalid url. Url parameter "t" is missing'

// Wrap semantic-ui controls for react-redux-forms
const wPassword = (props) => <Input name='password' placeholder='Password' fluid className="verticalformcontrol" {...props} />

class ResetPassword extends React.Component {
  constructor(props) {
    super(props)
    let searchParams = new URLSearchParams(window.location.search)
    var token = searchParams.get("t") // if no token, show an error message
    this.state = {
      // this.props.message from parent holds initial message and is usually ''
      // this.state.message holds message to display at top of form
      message: token ? this.props.message : missingToken,
      // this.props.error from parent indicates whether initial message is an error and is usually false
      // this.state.error is a boolean that indicates whether message is an error
      error: token ? this.props.error : true,
      token,
      showPassword: false,
      needToValidate: false
    }
    this.validatePassword = this.validatePassword.bind(this)
    this.toggleShowPassword = this.toggleShowPassword.bind(this)
  }

  validatePassword() {
    let f = document.querySelector('.ResetPassword form');
    let localdot = 'local.password'
    if (!f[localdot].validity.valid) {
      this.setState({ error: true, message: 'Password must have at least 8 characters and must include at least one uppercase, one lowercase, one number and one punctuation character' })
      return false
    } else {
      return true
    }
  }

  handleSubmit(values) {
    this.setState({ needToValidate: true })
    // force rerender, use setTimeout so that html5 required property will kick in on password
    this.forceUpdate()
    setTimeout(() => {
      if (!this.validatePassword()) {
        return
      }
      let { token } = this.state
      if (!token) {
        this.setState({ message: missingToken, error: true })
        return
      }
      let payload = Object.assign({}, values, { token })
      let { dispatch } = this.props.store
      const apiAction = {
        [RSAA]: {
          endpoint: resetpasswordApiUrl,
          method: 'POST',
          credentials: 'include',
          types: [
            'RESET_PASSWORD_REQUEST',
            {
              type: 'RESET_PASSWORD_SUCCESS',
              payload: (action, state, res) => {
                this.props.history.push('/resetpasswordsuccess')
              }
            },
            {
              type: 'RESET_PASSWORD_FAILURE',
              payload: (action, state, res) => {
                parseJsonPayload.bind(this)(res, action.type, json => {
                  let { error } = json
                  let retry = 'Please go to login screen and press Forgot Password again'
                  if (error === TOKEN_NOT_FOUND) {
                    this.setState({ message: 'Invalid token. '+retry,  error: true })
                  } else if (error === TOKEN_EXPIRED) {
                    this.setState({ message: 'Expired token. '+retry,  error: true })
                  } else {
                    this.props.history.push('/systemerror')
                  }
                })
              }
            }
          ],
          body: JSON.stringify(payload),
          headers: { 'Content-Type': 'application/json' }
        }
      }
      dispatch(apiAction)
    }, 0)
  }

  toggleShowPassword(event) {
    event.preventDefault()
    this.setState({ showPassword: !this.state.showPassword })
  }

  render() {
    let hdr = 'Reset Password'
    let { message, error, needToValidate, showPassword } = this.state
    let passwordPattern = needToValidate ? passwordRegexp : '.*'
    let passwordType = showPassword ? 'input' : 'password'
    let showHidePasswordText = showPassword ? 'Hide password' : 'Show password'

    return (
      <Container text className='ResetPassword verticalformcontainer'>
        <Message header={hdr} className='verticalformtopmessage' content={message} error={error} />
        <LocalForm onSubmit={(values) => this.handleSubmit(values)} >
          <Control.password model=".password" type={passwordType} className="verticalformcontrol" pattern={passwordPattern} component={wPassword} required={needToValidate} />
          <div className="showPasswordRow">
            <a href="" className="showPasswordLink" onClick={this.toggleShowPassword} >{showHidePasswordText}</a>
          </div>
          <div className="passwordRules">At least: 1 lowercase, 1 uppercase, 1 number, 1 punctuation, 8 chars total</div>
          <div className='verticalformbuttonrow'>
            <Button type="submit" className="verticalformcontrol verticalformbottombutton" >Save Password</Button>
            <div style={{clear:'both' }} ></div>
          </div>
        </LocalForm>
        <Message className="verticalformbottommessage" >
          <span className='innerBlock'>
            <div>Have your password?&nbsp;<Link to="/login">Login here</Link></div>
          </span>
        </Message>
      </Container>
    )
  }
}

ResetPassword.propTypes = {
  store: PropTypes.object.isRequired
}

const mapStateToProps = (state, ownProps) => {
  return {
    store: ownProps.store
  }
}

export default withRouter(connect(mapStateToProps)(ResetPassword));
