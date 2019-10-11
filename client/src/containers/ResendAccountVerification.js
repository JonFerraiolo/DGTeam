
import React from 'react';
import { connect } from "react-redux";
import { LocalForm, Control } from 'react-redux-form'
import { Link, withRouter } from 'react-router-dom'
import PropTypes from 'prop-types'
import { Button, Container, Input, Message } from 'semantic-ui-react'
import { accountVerificationEmailSent } from '../actions/accountActions'
import { RSAA } from 'redux-api-middleware';
import parseJsonPayload from '../util/parseJsonPayload'
import { TEAM_BASE_URL, TEAM_API_RELATIVE_PATH } from '../envvars'

var EMAIL_NOT_REGISTERED = 'EMAIL_NOT_REGISTERED'
var EMAIL_ALREADY_VERIFIED = 'EMAIL_ALREADY_VERIFIED'

var resendverificationApiUrl = TEAM_BASE_URL + TEAM_API_RELATIVE_PATH + '/resendverification'

// Wrap semantic-ui controls for react-redux-forms
const wEmail = (props) => <Input name='email' placeholder='Email' fluid className="verticalformcontrol" {...props} />

class ResendAccountVerification extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      message: null,
      error: false
    }
  }

  handleSubmit(values) {
    let { dispatch } = this.props.store
    const apiAction = {
      [RSAA]: {
        endpoint: resendverificationApiUrl,
        method: 'POST',
        credentials: 'include',
        types: [
          'RESEND_VERIFICATION_REQUEST',
          {
            type: 'RESEND_VERIFICATION_SUCCESS',
            payload: (action, state, res) => {
              this.props.store.dispatch(accountVerificationEmailSent(values.email))
              this.props.history.push('/verificationsent')
            }
          },
          {
            type: 'RESEND_VERIFICATION_FAILURE',
            payload: (action, state, res) => {
              parseJsonPayload.bind(this)(res, action.type, json => {
                let { error } = json
                if (error === EMAIL_ALREADY_VERIFIED) {
                  this.setState({ message: 'Email has already been verified. Please login.',  error: true })
                } else if (error === EMAIL_NOT_REGISTERED) {
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
  }

  render() {
    let hdr = 'Resend Account Verification'
    let { message, error } = this.state
    return (
      <Container text className='ResendAccountVerification verticalformcontainer'>
        <Message header={hdr} className='verticalformtopmessage' content={message} error={error} />
        <LocalForm onSubmit={(values) => this.handleSubmit(values)} >
          <Control.text model=".email" type="email" component={wEmail} />
          <div className='verticalformbuttonrow'>
            <Button type="submit" className="verticalformcontrol verticalformbottombutton" >Resend Account Verification</Button>
            <div style={{clear:'both' }} ></div>
          </div>
        </LocalForm>
        <Message className="verticalformbottommessage" >
          <span className='innerBlock'>
            <div>Account already verified?&nbsp;<Link to="/login">Login here</Link></div>
          </span>
        </Message>
      </Container>
    )
  }
}

ResendAccountVerification.propTypes = {
  store: PropTypes.object.isRequired
}

const mapStateToProps = (state, ownProps) => {
  return {
    store: ownProps.store
  }
}

export default withRouter(connect(mapStateToProps)(ResendAccountVerification));
