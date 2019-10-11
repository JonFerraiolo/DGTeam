
import React from 'react';
import { withRouter } from 'react-router-dom'
import { RSAA } from 'redux-api-middleware'
import { TEAM_BASE_URL, TEAM_API_RELATIVE_PATH } from '../../envvars'
import { getInboxSuccess } from '../../actions/inboxActions'
import parseJsonPayload from '../../util/parseJsonPayload'
import PropTypes from 'prop-types'
import DOMPurify from 'dompurify'
import { Checkbox, Feed, Icon, Input, Menu } from 'semantic-ui-react'
import InboxMoreMenu from './InboxMoreMenu'
import './Inbox.css'

let notifications = [
  {
    id: '1',
    when: '3 hours ago',
    subject: 'Welcome!',
    from: '(automatically generated)',
    content: `
<h3>Welcome to the Democracy Guardians team!</h3>
<p>With the team application, you start out at level 1.
  As you learn and develop skills, you advance to higher levels. </p>
<p>To complete Level 1 and advance to level 2, you must complete the following three training modules:</p>
<ul class="AppTaskList">
  <li><a href="/Task/1/Trustworthiness" class="AppTaskPressmeHighlight">Introducing Trustworthiness - Press here to start</a></li>
  <li>Confirming Your Oaths</li>
  <li>Filling Out Your Profile</li>
</ul>
    `
  }
]

class Inbox extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      getinboxComplete: false
    }
    this.getinbox = this.getinbox.bind(this);
    this.getinbox()
  }

  getinbox() {
    let componentThis = this
    let values = {}
    let { dispatch } = this.props.store
    let getinboxApiUrl = TEAM_BASE_URL + TEAM_API_RELATIVE_PATH + '/getinbox'
    const apiAction = {
      [RSAA]: {
        endpoint: getinboxApiUrl,
        method: 'POST',
        credentials: 'include',
        types: [
          'getinbox_request', // ignored
          {
            type: 'getinbox_success',
            payload: (action, state, res) => {
              parseJsonPayload(res, action.type, function(json) {
                dispatch(getInboxSuccess(json.account, json.progress, json.tasks))
                this.setState({ getinboxComplete: true })
              }.bind(componentThis))
            }
          },
          {
            type: 'getinbox_failure',
            payload: (action, state, res) => {
              console.error('Inbox getinbox_failure')
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

  handleItemClick = (item, e) => {
    this.props.history.push('/Inbox/'+item.id)
  }

  handleFilterIconClick = (index, e) => {
    alert('FIXME Not yet implemented')
  }

  handleUndoIconClick = (index, e) => {
    alert('FIXME Not yet implemented')
  }

  handleDeleteIconClick = (index, e) => {
    alert('FIXME Not yet implemented')
  }

  handleSelectAllClick = (index, e) => {
    alert('FIXME Not yet implemented')
  }

  render() {
    if (!this.state.getinboxComplete) {
      return (<div></div>)
    }
    let { store } = this.props
    let r = (
      <div className="Inbox">
        <div className="InboxMenu SecondaryMenu">
          <Menu secondary size='mini' >
            <Menu.Item name='selectall' className='InboxSelectAll' onClick={this.handleSelectAllClick} fitted={false} >
              <Checkbox checked={false} fitted={false} />
            </Menu.Item>
            <Menu.Item name='undo' onClick={this.handleUndoIconClick} fitted={false} >
              <Icon name='undo' size='large' inverted />
            </Menu.Item>
            <Menu.Item name='delete' onClick={this.handleDeleteIconClick} fitted={false} >
              <Icon name='delete' size='large' inverted />
            </Menu.Item>
            <Menu.Item>
              <Input className='icon' icon='search' placeholder='Search...' />
            </Menu.Item>
            <InboxMoreMenu store={store} />
          </Menu>
        </div>
        <Feed>
          {notifications.map((item, index) => (
            <Feed.Event key={item.id} onClick={this.handleItemClick.bind(this,item)} >
              <Feed.Label className='InboxSelect' >
                <Checkbox checked={false} fitted={false} />
              </Feed.Label>
              <Feed.Content>
                <Feed.Date dangerouslySetInnerHTML={{__html: DOMPurify.sanitize(item.when)}} />
                <Feed.Summary> <span dangerouslySetInnerHTML={{__html: DOMPurify.sanitize(item.subject)}} /> </Feed.Summary>
                <Feed.Extra text>
                  <span dangerouslySetInnerHTML={{__html: DOMPurify.sanitize(item.content)}} />
                </Feed.Extra>
              </Feed.Content>
            </Feed.Event>
          ))}
        </Feed>
      </div>
    );
    return r
  }
}

Inbox.propTypes = {
  store: PropTypes.object.isRequired
}

export default withRouter(Inbox);
