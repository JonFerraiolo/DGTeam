
import React from 'react';
import { connect } from "react-redux";
import { LocalForm, Control } from 'react-redux-form'
import { Link, withRouter } from 'react-router-dom'
import PropTypes from 'prop-types'
import { Button, Container, Input, Message } from 'semantic-ui-react'
import { resetPasswordEmailSent } from '../actions/accountActions'
import { RSAA } from 'redux-api-middleware';
import parseJsonPayload from '../util/parseJsonPayload'
import { TEAM_BASE_URL, TEAM_API_RELATIVE_PATH } from '../envvars'

var EMAIL_NOT_REGISTERED = 'EMAIL_NOT_REGISTERED'

var sendresetpasswordemailApiUrl = TEAM_BASE_URL + TEAM_API_RELATIVE_PATH + '/sendresetpassword'

// Wrap semantic-ui controls for react-redux-forms
const wEmail = (props) => <Input name='email' placeholder='Email' fluid className="verticalformcontrol" {...props} />

class ForgotPassword extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      message: null,
      error: false,
      needToValidate: false
    }
  }

  validateEmail() {
    let f = document.querySelector('.ForgotPassword form');
    let localdot = 'local.email'
    if (!f[localdot].validity.valid) {
      this.setState({ error: true, message: 'Invalid email' })
      return false
    } else {
      return true
    }
  }


  handleSubmit(values) {
    this.setState({ needToValidate: true })
    // force rerender, use setTimeout so that html5 required property will kick in on email
    this.forceUpdate()
    setTimeout(() => {
      if (!this.validateEmail()) {
        return
      }
      let { dispatch } = this.props.store
      const apiAction = {
        [RSAA]: {
          endpoint: sendresetpasswordemailApiUrl,
          method: 'POST',
          credentials: 'include',
          types: [
            'FORGOT_PASSWORD_REQUEST',
            {
              type: 'FORGOT_PASSWORD_SUCCESS',
              payload: (action, state, res) => {
                this.props.store.dispatch(resetPasswordEmailSent(values.email))
                this.props.history.push('/resetpasswordsent')
              }
            },
            {
              type: 'FORGOT_PASSWORD_FAILURE',
              payload: (action, state, res) => {
                parseJsonPayload.bind(this)(res, action.type, json => {
                  let { error } = json
                  if (error === EMAIL_NOT_REGISTERED) {
                    this.setState({ message: 'Email has not been registered yet. Please enter a different email or sign up.',  error: true })
                  } else {
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
    }, 0)
  }

  render() {
    let hdr = 'Forgot Password'
    let { message, error, needToValidate } = this.state
    return (
      <Container text className='ForgotPassword verticalformcontainer'>
        <Message header={hdr} className='verticalformtopmessage' content={message} error={error} />
        <LocalForm onSubmit={(values) => this.handleSubmit(values)} >
          <Control.text model=".email" type="email" component={wEmail} required={needToValidate} />
          <div className='verticalformbuttonrow'>
            <Button type="submit" className="verticalformcontrol verticalformbottombutton" >Send Me Reset Password Email</Button>
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

ForgotPassword.propTypes = {
  store: PropTypes.object.isRequired
}

const mapStateToProps = (state, ownProps) => {
  return {
    store: ownProps.store
  }
}

export default withRouter(connect(mapStateToProps)(ForgotPassword));
