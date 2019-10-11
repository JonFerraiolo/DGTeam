import React, { Component } from 'react';
import injectTapEventPlugin from 'react-tap-event-plugin';
import { connect } from 'react-redux'
import { BrowserRouter, Redirect, Route, Switch } from 'react-router-dom'
import './App.css';
import Login from './containers/Login'
import Signup from './containers/Signup'
import Workbench from './containers/Workbench'
import ResendAccountVerification from './containers/ResendAccountVerification'
import AccountVerificationSent from './components/Session/AccountVerificationSent'
import ForgotPassword from './containers/ForgotPassword'
import ResetPasswordSent from './components/Session/ResetPasswordSent'
import ResetPassword from './containers/ResetPassword'
import ResetPasswordSuccess from './components/Session/ResetPasswordSuccess'
import ResetProgress from './containers/ResetProgress'
import SystemError from './components/Misc/SystemError'

// Needed for onTouchTap
// http://stackoverflow.com/a/34015469/988941
injectTapEventPlugin();

class App extends Component {
  render() {
    const LoginComp = (() => (<Login store={this.props.store} />))
    const SignupComp = (() => (<Signup store={this.props.store} />))
    const ResendAccountVerificationComp = (() => (<ResendAccountVerification store={this.props.store} />))
    const AccountVerificationSentComp = (() => (<AccountVerificationSent store={this.props.store} />))
    const ForgotPasswordComp = (() => (<ForgotPassword store={this.props.store} />))
    const ResetPasswordSentComp = (() => (<ResetPasswordSent store={this.props.store} />))
    const ResetPasswordComp = (() => (<ResetPassword store={this.props.store} />))
    const ResetPasswordSuccessComp = (() => (<ResetPasswordSuccess store={this.props.store} />))
    const ResetProgressComp = (() => (<ResetProgress store={this.props.store} />))
    const WorkbenchComp = (() => (<Workbench store={this.props.store} />))
    let defaultRoute = localStorage.getItem("teamAppEmail") ? '/login' : '/signup'
    return (
      <div className="App">
        <BrowserRouter>
          <Switch>
            <Route path='/login' component={LoginComp} />
            <Route path='/signup' component={SignupComp} />
            <Route path='/resendverification' component={ResendAccountVerificationComp} />
            <Route path='/verificationsent' component={AccountVerificationSentComp} />
            <Route path='/forgotpassword' component={ForgotPasswordComp} />
            <Route path='/resetpasswordsent' component={ResetPasswordSentComp} />
            <Route path='/resetpassword' component={ResetPasswordComp} />
            <Route path='/resetpasswordsuccess' component={ResetPasswordSuccessComp} />
            <Route path='/resetprogress' component={ResetProgressComp} />
            <Route exact path='/(Tasks|Messages|Search|Me)' component={WorkbenchComp} />
            <Route exact path='/Inbox/:id' component={WorkbenchComp} />
            <Route exact path='/Task/:level/:name' component={WorkbenchComp} />
            <Route path='/systemerror' component={SystemError} />
            <Redirect path='*' to={defaultRoute} />
          </Switch>
        </BrowserRouter>
      </div>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    store: ownProps.store
  }
}

App = connect(mapStateToProps)(App)

export default App;
