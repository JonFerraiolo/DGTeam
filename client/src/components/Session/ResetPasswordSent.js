
import React from 'react';
import { Container, Message } from 'semantic-ui-react'
import { Link, withRouter } from 'react-router-dom'
import PropTypes from 'prop-types'

class ResetPasswordSent extends React.Component {
  render() {
    let { message } = this.props
    let storeState = this.props.store.getState()
    let { lastResetPasswordEmail } = storeState.account || {}
    return (
      <Container text className='ResetPasswordSent verticalformcontainer'>
        <div className="ResetPasswordSent">
          <Message header='Check your email!' className='verticalformtopmessage' content={message} />
          <div className="signupVerificationEmailSent">
            <p>We’ve sent a message to <strong>{lastResetPasswordEmail}</strong>. Open it and click Reset My Password.</p>
          </div>
          <div className='verticalformbuttonrow'>
            <div>Can't find reset password email?&nbsp;<Link to='/forgotpassword'>Click here</Link></div>
            <div style={{clear:'both' }} ></div>
          </div>
        </div>
      </Container>
    )
  }
}

ResetPasswordSent.propTypes = {
  store: PropTypes.object.isRequired,
  message: PropTypes.string
}

export default withRouter(ResetPasswordSent)
