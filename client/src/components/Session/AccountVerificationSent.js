
import React from 'react';
import { Container, Message } from 'semantic-ui-react'
import { Link, withRouter } from 'react-router-dom'
import PropTypes from 'prop-types'

class AccountVerificationSent extends React.Component {
  render() {
    let { message } = this.props
    let storeState = this.props.store.getState()
    let { lastVerificationEmail } = storeState.account || {}
    return (
      <Container text className='AccountVerificationSent verticalformcontainer'>
        <div className="AccountVerificationSent">
          <Message header='Check your email!' className='verticalformtopmessage' content={message} />
          <div className="signupVerificationEmailSent">
            <p>We’ve sent a message to <strong>{lastVerificationEmail}</strong>. Open it and click Activate My Account.</p>
          </div>
          <div className='verticalformbuttonrow'>
            <div>Can't find account verification email?&nbsp;<Link to='/resendverification'>Click here</Link></div>
            <div style={{clear:'both' }} ></div>
          </div>
        </div>
      </Container>
    )
  }
}

AccountVerificationSent.propTypes = {
  store: PropTypes.object.isRequired,
  message: PropTypes.string
}

export default withRouter(AccountVerificationSent)
